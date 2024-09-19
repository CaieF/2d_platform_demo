import { _decorator, Component, director, Label, Node, randomRangeInt, Slider, TiledMap } from 'cc';
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
import { SoundBar } from './SoundBar';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node) ndPlayerParents: Node;
    @property(Node) ndEnemyParents: Node;
    @property(Node) ndTextParent: Node;
    @property(TiledMap) Map: TiledMap;
    @property(Node) ndPlayerMessage: Node;
    @property(Node) ndWeaponParent: Node;
    @property(Node) ndWeaponParent0: Node;
    @property(Node) ndBtnSettingButton: Node; // 设置按钮
    @property(Node) ndSettingPanel: Node; // 设置面板

    private _ndLifeBar: Node;
    private _ndExpBar: Node;
    private _ndLevel: Node;

    private _sk0Button: SkillButton;
    private _sk1Button: SkillButton;
    private _sk2Button: SkillButton;
    private _sk3Button: SkillButton;

    private _ndButton: Node;
    private _ndSoundBar: Node; // 音量条
    private _ndCancelButton: Node; // 取消按钮
    private _ndOKButton: Node; // 确定按钮
    private _ndHomeButton: Node; // 返回按钮
    private _ndReloadButton: Node; // 重新开始按钮
    private _ndNoSoundButton: Node; // 关闭音效按钮
    private _ndMaxSoundButton: Node; // 开启音效按钮

    protected onLoad() {
        // 相关父节点赋值
        GameContext.ndPlayerParents = this.ndPlayerParents;
        GameContext.ndTextParent = this.ndTextParent; 
        this._loadPlayer();
        GameContext.ndEnemyParents = this.ndEnemyParents;
        GameContext.ndWeaponParent = this.ndWeaponParent;
        GameContext.ndWeaponParent0 = this.ndWeaponParent0;
        GameContext.GameStatus = Constant.GameStatus.RUNNING;

        // 生命条 经验条
        this._ndLifeBar = this.ndPlayerMessage.getChildByName('LifeBar');
        this._ndExpBar = this.ndPlayerMessage.getChildByName('ExpBar');
        this._ndLevel = this.ndPlayerMessage.getChildByName('Level');
        


        // 相关按钮
        this._ndButton = this.ndSettingPanel.getChildByName('Button');
        this._ndSoundBar = this.ndSettingPanel.getChildByName('SoundBar'); // 音量条
        this._ndOKButton = this._ndButton.getChildByName('OkButton'); // 确定按钮
        this._ndCancelButton = this._ndButton.getChildByName('CancelButton'); // 取消按钮
        this._ndHomeButton = this._ndButton.getChildByName('HomeButton'); // 返回按钮
        this._ndReloadButton = this._ndButton.getChildByName('ReloadingButton'); // 重新开始按钮
        this._ndNoSoundButton = this._ndButton.getChildByName('NoSoundButton'); // 关闭音效按钮
        this._ndMaxSoundButton = this._ndButton.getChildByName('MaxSoundButton'); // 开启音效按钮
    }

    protected onEnable(): void {
        this._rebindSkillButtons();
        // 设置按钮键盘事件
        this.ndBtnSettingButton.getComponent(NormalButton).onKeyEsc(() => {
            if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
            Util.applyPause();
            this.ndSettingPanel.active = !this.ndSettingPanel.active;
        })
        // 设置按钮点击事件
        this.ndBtnSettingButton.getComponent(NormalButton).onClick(() => {
            if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
            Util.applyPause();
            this.ndSettingPanel.active = !this.ndSettingPanel.active;
        })
        // 确定按钮点击事件
        this._ndOKButton.getComponent(NormalButton).onClick(() => {
            Util.applyResume();
            this.ndSettingPanel.active = !this.ndSettingPanel.active;
        })
        // 取消按钮点击事件
        this._ndCancelButton.getComponent(NormalButton).onClick(() => {
            Util.applyResume();
            this.ndSettingPanel.active = !this.ndSettingPanel.active;
        })
        // 返回按钮点击事件
        this._ndHomeButton.getComponent(NormalButton).onClick(() => {
            Util.applyResume();
            director.loadScene('Start');
        })
        // 重新开始按钮点击事件
        this._ndReloadButton.getComponent(NormalButton).onClick(() => {
            Util.applyResume();
            director.loadScene('Game');
        })
        // 点击关闭音效按钮事件
        this._ndNoSoundButton.getComponent(NormalButton).onClick(() => {
            this._ndNoSoundButton.active = false;
            this._ndMaxSoundButton.active = true;
            this._ndSoundBar.getComponent(SoundBar).updateVolumeLabel(1);
        })
        // 点击开启音效按钮事件
        this._ndMaxSoundButton.getComponent(NormalButton).onClick(() => {
            this._ndNoSoundButton.active = true;
            this._ndMaxSoundButton.active = false;
            this._ndSoundBar.getComponent(SoundBar).updateVolumeLabel(0);
        })

        // 生命条
        const lifeBar = this._ndLifeBar.getComponent(ProgressBar);
        lifeBar.setProgress(1);
        lifeBar.setLabel(GameContext.player.hp, GameContext.player.maxHp);
        // 经验条
        const expBar = this._ndExpBar.getComponent(ProgressBar);
        expBar.setProgress(0);
        expBar.setLabel(0, GameContext.player.maxExp);
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
                    lifeBar.setProgress(0);
                    lifeBar.setLabel(0, GameContext.player.maxHp);
                    break;
                case Player.Event.ADD_EXP:
                    expBar.setProgress(GameContext.player.exp / GameContext.player.maxExp);
                    expBar.setLabel(GameContext.player.exp, GameContext.player.maxExp);
                    break;
                case Player.Event.LEVEL_UP:
                    expBar.setProgress(GameContext.player.exp / GameContext.player.maxExp);
                    expBar.setLabel(GameContext.player.exp, GameContext.player.maxExp);
                    LevelLabel.string = `Lv: ${GameContext.player.level}`;
                    break;
                default:
                    break;
            }
        });
    }
    start() {
        if (this.Map){
            Util.setWall(this.Map);
        }

        this.schedule(this._spawnEnemy, 2);
    }

    // 刷怪逻辑
    private _spawnEnemy() {
        const minX = -230;
        const maxX = 90;
        const Y = 50;
        const createOne = () => {
            const x = randomRangeInt(minX, maxX);
            const y = Y;
            const node = Globals.getNode(Constant.PrefabUrl.SKELETON, GameContext.ndEnemyParents);
            node.setPosition(x, y);
            const enemy = node.getComponent(Enemy);
            enemy.hp = 100;
            enemy.speed = randomRangeInt(6, 12);
            enemy.enemyStatus = Constant.CharStatus.IDLE;
            enemy.onEnemyEvent((event: number) => {
                switch (event) {
                    case Enemy.Event.DEATH:
                        GameContext.player.addExp(60);
                        break;
                    default:
                        break;
                }
            })
        }

        if (GameContext.ndEnemyParents.children.length < 2) {
            createOne();
        }
    }

    // 加载角色
    private _loadPlayer() {
        
        const defaultPlayerId = CharData.Player1.playerId; // 默认角色ID
        const selectedPlayerId = GameContext.selectedPlayerId;

        // 获取角色配置
        const playerConfigData = CharData.playerConfig[selectedPlayerId] || CharData.playerConfig[defaultPlayerId];

        const playerPrefabUrl = playerConfigData.prefabUrl;
        const playerAvatarPrefabUrl = playerConfigData.avatarUrl;
        const SkillBarPrefabUrl = playerConfigData.skillBarUrl;

        const hp = playerConfigData.hp;
        const speed = playerConfigData.speed;
        const jump_speed = playerConfigData.jump_speed;
        // 角色
        const playerNode = Globals.getNode(playerPrefabUrl, GameContext.ndPlayerParents);
        if (playerNode) {
            GameContext.ndPlayer = playerNode;
            GameContext.player = playerNode.getComponent(Player);
            GameContext.player.setValue(hp, hp, speed, jump_speed); // 设置属性
        }
        // 角色头像
        const playerAvatarNode = Globals.getNode(playerAvatarPrefabUrl, this.ndPlayerMessage);
        if (playerAvatarNode) {
            playerAvatarNode.setPosition(-30, 0);
        }
        // 技能栏
        const skillBarNode = Globals.getNode(SkillBarPrefabUrl, this.ndPlayerMessage);
        
        if (skillBarNode) {
            skillBarNode.setScale(0.5, 0.5);
            skillBarNode.setPosition(-10, -270)
            const skillButtons = skillBarNode.getComponentsInChildren(SkillButton);
            this._sk0Button = skillButtons[0];
            this._sk1Button = skillButtons[1];
            this._sk2Button = skillButtons[2];
            this._sk3Button = skillButtons[3];
        }
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
        // 设置技能冷却
        switch (GameContext.selectedPlayerId) {
            case CharData.Player1.playerId:
                this._setSkillColdDown(CharData.Player1.sk0Cd, CharData.Player1.sk1Cd, CharData.Player1.sk2Cd, CharData.Player1.sk3Cd)
                break;
            case CharData.Player2.playerId:
                this._setSkillColdDown(CharData.Player2.sk0Cd, CharData.Player2.sk1Cd, CharData.Player2.sk2Cd, CharData.Player2.sk3Cd)
                break;
            case CharData.Player3.playerId:
                this._setSkillColdDown(CharData.Player3.sk0Cd, CharData.Player3.sk1Cd, CharData.Player3.sk2Cd, CharData.Player3.sk3Cd)
                break;
            case CharData.Player4.playerId:
                this._setSkillColdDown(CharData.Player4.sk0Cd, CharData.Player4.sk1Cd, CharData.Player4.sk2Cd, CharData.Player4.sk3Cd)
                break;
            default:
                break;
        }

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
}
