import { _decorator, Component, director, Label, Node, NodePool, randomRangeInt, Slider, TiledMap, TiledMapAsset, UITransform } from 'cc';
import { Util } from './Util';
import { GameContext } from './GameContext';
import { Player } from './Player';
import { Globals } from './Globals';
import { Constant } from './Constant';
import { Enemy } from './Enemy';
import { ProgressBar } from './ProgressBar';
import { SkillButton } from './SkillButton';
import { CharData } from './CharData';
import { NormalButton } from './NormalButton';
import { ButtonEvent } from './ButtonEvent';
import { ResUtil } from './ResUtil';
import { AudioManager } from './AudioManager';
import { SettingPanel } from './SettingPanel';
import { PetCat } from './PetCat';
import { StorageManager } from './StorageManager';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node) ndPlayerParents: Node;
    @property(Node) ndEnemyParents: Node;
    @property(Node) ndTextParent: Node;
    @property(Node) ndLevelManager: Node;
    // @property(TiledMap) Map: TiledMap;
    @property(Node) ndPlayerMessage: Node;  // 角色信息
    @property(Node) ndBossMessage: Node;    // boss信息
    @property(Node) ndPetMessage: Node;  // 宠物信息
    @property(Node) ndWeaponParent: Node;
    @property(Node) ndWeaponParent0: Node;
    @property(Node) ndBtnSettingButton: Node; // 设置按钮
    @property(Node) ndSettingPanel: Node; // 设置面板
    @property(Node) ndDeathPanel: Node; // 死亡面板
    @property(Node) ndLoadingPanel: Node; // 加载面板
    @property(Node) ndWinPanel: Node; // 胜利面板
    @property(Node) ndCamera: Node;
    @property(Label) GameMoneyLabel: Label; // 准备页面的金钱标签
    @property(Node) ItemList: Node; // 物品列表
    map: TiledMap;

    private _ndLifeBar: Node;
    private _ndExpBar: Node;
    private _ndLevel: Node;
    private _ndPetLifeBar: Node;
    private _ndPetExpBar: Node;
    private _ndPetLevel: Node;
    private _ndBossLifeBar: Node;
    private _BossName: Node;
    private _BossLifeBar: ProgressBar;

    private _sk0Button: SkillButton;
    private _sk1Button: SkillButton;
    private _sk2Button: SkillButton;
    private _sk3Button: SkillButton;
    protected async onLoad() {
        
        // 相关父节点赋值
        // this.node.getChildByName('Map').TiledMap
        GameContext.GameStatus = Constant.GameStatus.LOADING;
        this.ndLoadingPanel.active = true;
        GameContext.ndCamera = this.ndCamera;
        GameContext.ndPlayerParents = this.ndPlayerParents;
        GameContext.ndTextParent = this.ndTextParent; 
        
        GameContext.ndEnemyParents = this.ndEnemyParents;
        GameContext.ndWeaponParent = this.ndWeaponParent;
        GameContext.ndWeaponParent0 = this.ndWeaponParent0;
        
        GameContext.gameMoneyLabel = this.GameMoneyLabel;

        // 生命条 经验条 等级
        this._ndLifeBar = this.ndPlayerMessage.getChildByName('LifeBar');
        this._ndExpBar = this.ndPlayerMessage.getChildByName('ExpBar');
        this._ndLevel = this.ndPlayerMessage.getChildByName('Level');

        // 宠物生命条 经验条 等级 宠物名字
        this._ndPetLifeBar = this.ndPetMessage.getChildByName('LifeBar');
        this._ndPetExpBar = this.ndPetMessage.getChildByName('ExpBar');
        this._ndPetLevel = this.ndPetMessage.getChildByName('Level');

        // Boss 生命条 boss名字
        this._ndBossLifeBar = this.ndBossMessage.getChildByName('LifeBar');
        this._BossName = this.ndBossMessage.getChildByName('name');
        
        
        if (GameContext.selectedPetId !== -1) {
            this._loadPet(); // 加载宠物
        }
        this._loadPlayer(); // 加载角色
        await this.loadLevel(GameContext.selectedLevelId) // 加载地图
        this.map = this.ndLevelManager.getComponent(TiledMap); // 地图
        if (this.map){
            this.ndLevelManager.getComponent(UITransform).setAnchorPoint(0,0)
            // console.log('this.map.tmxAsset:',this.map.tmxAsset);
            
            Util.setWall(this.map);
        } else {
            console.log('this.map.tmxAsset no');     
        }
        this.ndLoadingPanel.active = false;
        // this.ndWinPanel.active = false;
    }

    protected async onEnable() {
        GameContext.GameScene = Constant.GameScene.Prepare;
        Util.changeMoney();
        
        GameContext.GameScene = Constant.GameScene.Game;
        AudioManager.Instance.playMusic('sounds/Game', 1);
        this._rebindSkillButtons();
        // 设置按钮键盘事件
        this.ndBtnSettingButton.getComponent(NormalButton).onKeyEsc(() => {
            if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
            Util.applyPause();
            this.ndSettingPanel.active = !this.ndSettingPanel.active;
        })
        
        ButtonEvent.setButtonEvent(this.ndBtnSettingButton, 'Setting', this.ndSettingPanel); // 设置按钮点击事件

        // 生命条
        const lifeBar = this._ndLifeBar.getComponent(ProgressBar);
        lifeBar.setProgress(1);
        lifeBar.setLabel(GameContext.player.hp, GameContext.player.maxHp);
        // 经验条
        const expBar = this._ndExpBar.getComponent(ProgressBar);
        expBar.setProgress(GameContext.player.exp / GameContext.player.maxExp);
        expBar.setLabel(GameContext.player.exp, GameContext.player.maxExp);
        // 等级
        const LevelLabel = this._ndLevel.getComponent(Label);
        LevelLabel.string = `Lv: ${GameContext.player.level}`;
        
        GameContext.player.onPlayerEvent((event: number, value: number) => {
            switch (event) {
                case Player.Event.HURT:
                    lifeBar.setProgress(GameContext.player.hp / GameContext.player.maxHp);
                    lifeBar.setLabel(GameContext.player.hp, GameContext.player.maxHp);
                    break;
                case Player.Event.DEATH:
                    this.ndDeathPanel.active = true;
                    AudioManager.Instance.playMusic('sounds/Requiem', 1);
                    this.ndDeathPanel.getComponent(SettingPanel).onPlayerDeath();
                    Util.applyPause();
                    break;
                case Player.Event.ADD_EXP:
                    expBar.setProgress(GameContext.player.exp / GameContext.player.maxExp);
                    expBar.setLabel(GameContext.player.exp, GameContext.player.maxExp);
                    break;
                case Player.Event.LEVEL_UP:
                    lifeBar.setProgress(GameContext.player.hp / GameContext.player.maxHp);
                    lifeBar.setLabel(GameContext.player.hp, GameContext.player.maxHp);
                    expBar.setProgress(GameContext.player.exp / GameContext.player.maxExp);
                    expBar.setLabel(GameContext.player.exp, GameContext.player.maxExp);
                    LevelLabel.string = `Lv: ${GameContext.player.level}`;
                    break;
                default:
                    break;
            }
        });

        if (GameContext.selectedPetId !== -1) {
            const petLifeBar = this._ndPetLifeBar.getComponent(ProgressBar);
            petLifeBar.setProgress(GameContext.pet.hp / GameContext.pet.maxHp);
            petLifeBar.setLabel(GameContext.pet.hp, GameContext.pet.maxHp);
            // 经验条
            const petExpBar = this._ndPetExpBar.getComponent(ProgressBar);
            petExpBar.setProgress(GameContext.pet.exp / GameContext.pet.maxExp);
            petExpBar.setLabel(GameContext.pet.exp, GameContext.pet.maxExp);
            // 等级
            const petLevelLabel = this._ndPetLevel.getComponent(Label);
            petLevelLabel.string = `Lv: ${GameContext.pet.level}`;

            GameContext.pet.onPetEvent((event: number, value: number) => {
                switch(event) {
                    case PetCat.Event.HURT:
                        petLifeBar.setProgress(GameContext.pet.hp / GameContext.pet.maxHp);
                        petLifeBar.setLabel(GameContext.pet.hp, GameContext.pet.maxHp);
                        break;
                    case PetCat.Event.ADD_EXP:
                        petExpBar.setProgress(GameContext.pet.exp / GameContext.pet.maxExp);
                        petExpBar.setLabel(GameContext.pet.exp, GameContext.pet.maxExp);
                        break;
                    case PetCat.Event.LEVEL_UP:
                        petLifeBar.setProgress(GameContext.pet.hp / GameContext.pet.maxHp);
                        petExpBar.setLabel(GameContext.pet.exp, GameContext.pet.maxExp);
                        petExpBar.setProgress(GameContext.pet.exp / GameContext.pet.maxExp);
                        petExpBar.setLabel(GameContext.pet.exp, GameContext.pet.maxExp);
                        petLevelLabel.string = `Lv: ${GameContext.pet.level}`;
                        break;
                    default:
                        break;
                }
            })
        }


        if (this.ItemList) {
            for (let i = 0; i < this.ItemList.children.length; i++) {
                const item = this.ItemList.children[i];
                const itemNums = item.getChildByName('nums');
                const itemNumsLabel = itemNums.getComponent(Label);
                itemNumsLabel.string = `${GameContext.Goods[i]}`;
                const itemSkBtn = item.getComponent(SkillButton);
                itemSkBtn.isSkill = false;
                itemSkBtn.ItemId = i;
                if (GameContext.Goods[i] <= 0) {
                    itemSkBtn.isAvaliable = false;
                };
                if (GameContext.selectedPetId === -1 && i === 1) {
                    itemSkBtn.isAvaliable = false;
                }
                switch (i) {
                    case CharData.GoodsId.Good1: {
                        itemSkBtn.onKeyQ(() => {
                            this.useLotion(itemSkBtn, itemNumsLabel, i)
                        })
                        break;
                    }
                    case CharData.GoodsId.Good2: {
                        if (GameContext.selectedPetId === -1) return;
                        itemSkBtn.onKeyE(() => {
                            this.useLotion(itemSkBtn, itemNumsLabel, i)
                        })
                        break;
                    }
                }
                itemSkBtn.onClick(() => {
                    this.useLotion(itemSkBtn, itemNumsLabel, i)
                })
            }
        }
    }

    useLotion(itemSkBtn: SkillButton, nums: Label, id: number) {
        if (id === 0) {
            AudioManager.Instance.playSound('SkillSounds/cure', 0.6);
            GameContext.player.cure(50);
        } else if (id === 1) {
            if (GameContext.selectedPetId === -1) return;
            GameContext.pet.cure(10);
        }
        GameContext.Goods[id] -= 1;
        nums.string = `${GameContext.Goods[id]}`;
        StorageManager.save('Goods', GameContext.Goods);
        if (GameContext.Goods[id] <= 0) {
            itemSkBtn.isAvaliable = false;
        }

    }
    async start() {
        GameContext.GameStatus = Constant.GameStatus.RUNNING;
        GameContext.EnemyNowNumbers = 1; // 当前怪物波数
        GameContext.EnemyAllNumbers = GameContext.levels[GameContext.selectedLevelId].numbers;
        this.scheduleOnce(this._spawnEnemy, 2);
    }

    // 刷怪逻辑
    private _spawnEnemy() {
        const selectedLevel = GameContext.levels[GameContext.selectedLevelId];
        if (!selectedLevel) return;
        // const numbers = selectedLevel.numbers; // 怪物波数
        // GameContext.EnemyNowNumbers += 1; // 当前怪物波数 +1
        const minX = -90 + (GameContext.EnemyNowNumbers - 1) * 360;
        const maxX = 90 + (GameContext.EnemyNowNumbers - 1) * 360;
        const Y = 0;
        let deathEnemy = 0; // 死亡怪物数
        const createOne = (enemyId: number) => {
            if (!enemyId) return;
            // 相关数值配置
            const enemyConfigData = CharData.enemyConfig[enemyId] || CharData.enemyConfig[1];
            const x = randomRangeInt(minX, maxX);
            const y = Y;
            const node = Globals.getNode(enemyConfigData.prefabUrl, GameContext.ndEnemyParents);
            node.setPosition(x, y);
            const enemy = node.getComponent(Enemy);
            enemy.setValue(enemyConfigData.enemyId, enemyConfigData.isBoss, 
                randomRangeInt(enemyConfigData.minSpeed, enemyConfigData.maxSpeed), 
                enemyConfigData.hp, enemyConfigData.chaseDistance, enemyConfigData.attackRange, 
                enemyConfigData.attackNumber, enemyConfigData.HitColliderOffsetX);
                enemy.enemyStatus = Constant.CharStatus.IDLE;
            if (enemyConfigData.isBoss) {
                this.ndBossMessage.active = true;
                GameContext.ndBoss = node;
                GameContext.boss = enemy;
                this._BossName.getComponent(Label).string = ` ${enemyConfigData.name}`;
                this._BossLifeBar = this._ndBossLifeBar.getComponent(ProgressBar);
                this._BossLifeBar.setProgress(1);
                this._BossLifeBar.setLabel(enemyConfigData.hp, enemyConfigData.hp);
            }
            enemy.onEnemyEvent((event: number, value: number) => { // 怪物事件
                switch (event) {
                    case Enemy.Event.DEATH:
                        GameContext.player.addExp(enemyConfigData.exp);
                        if (GameContext.selectedPetId !== -1) GameContext.pet.addExp(enemyConfigData.exp);
                        deathEnemy += 1;
                        if (deathEnemy === 6 && GameContext.EnemyNowNumbers !== GameContext.EnemyAllNumbers) {
                            GameContext.EnemyNowNumbers += 1; // 当前怪物波数 +1;
                            this.scheduleOnce(this._spawnEnemy, 4);
                        }
                        break;
                    case Enemy.Event.HURT:
                        if (GameContext.player.playerId === CharData.PlayersId.Player1) {
                            GameContext.player.cure(value)
                        }
                        if (enemy.isBoss) {
                            this._BossLifeBar.setProgress(GameContext.boss.hp / GameContext.boss.maxHp);
                            this._BossLifeBar.setLabel(GameContext.boss.hp, GameContext.boss.maxHp);
                        }
                        break;
                    case Enemy.Event.WIN:
                        this.ndWinPanel.active = true;
                        AudioManager.Instance.playMusic('sounds/Win', 1);
                        this.ndWinPanel.getComponent(SettingPanel).onPlayerDeath();
                        Util.applyPause();
                        break;
                        // AudioManager.Instance.playMusic('sounds/Requiem', 1);
                    default:
                        break;
                }
            })
        }

        
        // 刷新小怪
        if (selectedLevel.enemies.length > 0) {
            const numberOfEnemies = 6; // 小怪数量
            for (let i = 0; i < numberOfEnemies; i++) {
                const randomEnemyId = selectedLevel.enemies[randomRangeInt(0, selectedLevel.enemies.length)];
                createOne(randomEnemyId);
            }
        }

        // 刷新boss
        if (selectedLevel.boss.length > 0 && GameContext.EnemyNowNumbers === GameContext.EnemyAllNumbers) {
            const BossId = selectedLevel.boss[0];
            createOne(BossId);
        }
    }

    // 加载角色
    private _loadPlayer() {
        
        const defaultPlayerId = CharData.PlayersId.Player1; // 默认角色ID
        const selectedPlayerId = GameContext.selectedPlayerId;

        // 获取角色配置
        const playerConfigData  = CharData.playerConfig[selectedPlayerId] || CharData.playerConfig[defaultPlayerId];

        const playerPrefabUrl = playerConfigData.prefabUrl;
        const SkillBarPrefabUrl = playerConfigData.skillBarUrl;

        const hp = playerConfigData.hp;
        const ap = playerConfigData.ap;
        const addhp = playerConfigData.add_hp;
        const speed = playerConfigData.speed;
        const jump_speed = playerConfigData.jump_speed;
        // 角色
        const playerNode = Globals.getNode(playerPrefabUrl, GameContext.ndPlayerParents);
        if (playerNode) {
            GameContext.ndPlayer = playerNode;
            GameContext.player = playerNode.getComponent(Player);
            GameContext.player.setValue(hp, ap, speed, jump_speed, addhp, false); // 设置属性
        }
        Util.loadPlayerAvatar(this.ndPlayerMessage)
        // 技能栏
        const skillBarNode = Globals.getNode(SkillBarPrefabUrl, this.ndPlayerMessage);
        
        if (skillBarNode) {
            skillBarNode.setScale(0.625, 0.625);
            skillBarNode.setPosition(-20, -330)
            const skillButtons = skillBarNode.getComponentsInChildren(SkillButton);
            this._sk0Button = skillButtons[0];
            this._sk1Button = skillButtons[1];
            this._sk2Button = skillButtons[2];
            this._sk3Button = skillButtons[3];
        }
    }

    // 加载宠物
    private _loadPet() {
        if (GameContext.selectedPetId === -1) return;

        const petConfig = CharData.petConfig[GameContext.selectedPetId];
        const petPrefabUrl = petConfig.prefabUrl;
        const petNode = Globals.getNode(petPrefabUrl, GameContext.ndPlayerParents);
        if (petNode) {
            GameContext.ndPet = petNode;
            GameContext.pet = petNode.getComponent(PetCat);
            // const pet = petNode.getComponent(PetCat);
            GameContext.pet.setValue(petConfig.petId, petConfig.hp, petConfig.ap, petConfig.speed, petConfig.add_hp, petConfig.type, petConfig.chaseDistance, petConfig.attackRange, petConfig.attackTime);
        }
        this.ndPetMessage.active = true;
        Util.loadPlayerAvatar(this.ndPetMessage, true);

    }

    protected update(dt: number): void {
        
    }

    // 设置技能冷却
    private _setSkillColdDown(sk0Cd: number, sk1Cd: number, sk2Cd: number, sk3Cd: number) {
        this._sk0Button.coldDownTime = sk0Cd;
        this._sk1Button.coldDownTime = sk1Cd;
        this._sk2Button.coldDownTime = sk2Cd;
        this._sk3Button.coldDownTime = sk3Cd;
    }

    // 注册技能点击事件
    private _skOnClick(sk: SkillButton, CharStatus: number) {
        sk.onClick(() => {
            GameContext.player.playerStatus = CharStatus;
        });
    }

    // 技能相关
    private _rebindSkillButtons() {
        const defaultPlayerId = CharData.PlayersId.Player1;
        const selectedPlayerId = GameContext.selectedPlayerId;

        const playerConfigData = CharData.playerConfig[selectedPlayerId] || CharData.playerConfig[defaultPlayerId];
        this._setSkillColdDown(playerConfigData.sk0Cd, playerConfigData.sk1Cd, playerConfigData.sk2Cd, playerConfigData.sk3Cd);

        this._skOnClick(this._sk0Button, Constant.CharStatus.SKILL0);
        this._skOnClick(this._sk1Button, Constant.CharStatus.SKILL1);
        this._skOnClick(this._sk2Button, Constant.CharStatus.SKILL2);
        this._skOnClick(this._sk3Button, Constant.CharStatus.DODGE);
        this._sk0Button.onKeyU(() => {
            GameContext.player.playerStatus = Constant.CharStatus.SKILL0;
        });
        this._sk1Button.onKeyI(() => {
            GameContext.player.playerStatus = Constant.CharStatus.SKILL1;
        });
        this._sk2Button.onKeyO(() => {
            GameContext.player.playerStatus = Constant.CharStatus.SKILL2;
        });
        this._sk3Button.onKeyL(() => {
            GameContext.player.playerStatus = Constant.CharStatus.DODGE;
        });
    }

    loadLevel(levelIndex: number): Promise<void> {
        return new Promise(( resolve, reject ) => {
        // 确保索引有效
        if (levelIndex < 0 || levelIndex >= GameContext.levels.length) {
            console.error('无效的关卡索引');
        }
        // console.log('正在加载关卡：' + levelIndex);
        
        const selectedLevel = GameContext.levels[levelIndex];
        // console.log('selectedLevel:map:', selectedLevel.map);
        
        ResUtil.loadTiledMap(selectedLevel.map).then((map) => {
            this.instantiateMap(map);
            resolve();
        }).catch((err) => {
            console.error('关卡加载失败！');
            reject(err);
        });
        })
        
    }

    instantiateMap(map: TiledMapAsset) {
        const tiledMapComponent = this.ndLevelManager.getComponent(TiledMap)
        this.map = tiledMapComponent;
        tiledMapComponent.tmxAsset = map;
    }

    initGame() {

    }
}
