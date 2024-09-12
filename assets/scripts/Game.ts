import { _decorator, Component, Label, Node, randomRangeInt, Slider, TiledMap } from 'cc';
import { Util } from './Util';
import { GameContext } from './GameContext';
import { Player } from './Player';
import { Globals } from './Globals';
import { Constant } from './Constant';
import { Enemy } from './Enemy';
import { ProgressBar } from './ProgressBar';
import { SkillButton } from './SkillButton';
import { CharData } from './CharData';
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

    private _ndLifeBar: Node;
    private _ndExpBar: Node;
    private _ndLevel: Node;

    private _sk0Button: SkillButton;
    private _sk1Button: SkillButton;
    private _sk2Button: SkillButton;
    private _sk3Button: SkillButton;

    protected onLoad() {
        GameContext.ndPlayerParents = this.ndPlayerParents;
        GameContext.ndTextParent = this.ndTextParent; 
        this._loadPlayer();
        GameContext.ndEnemyParents = this.ndEnemyParents;
        GameContext.ndWeaponParent = this.ndWeaponParent;
        GameContext.ndWeaponParent0 = this.ndWeaponParent0;

        this._ndLifeBar = this.ndPlayerMessage.getChildByName('LifeBar');
        this._ndExpBar = this.ndPlayerMessage.getChildByName('ExpBar');
        this._ndLevel = this.ndPlayerMessage.getChildByName('Level');

    }

    protected onEnable(): void {
        this._rebindSkillButtons();

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
        let playerPrefabUrl = Constant.PrefabUrl.PLAYER1; // 角色预制体
        let playerAvatarPrefabUrl = Constant.PrefabUrl.PLAYER1_AVATAR; // 角色头像预制体
        let SkillBarPrefabUrl = Constant.PrefabUrl.SKILL_BAR1; // 技能预制体
        let hp: number = 100;
        let speed: number = 12;
        let jump_speed: number = 10;

        switch(GameContext.selectedPlayerId) {
            case 0:
                // 骑士猫
                playerPrefabUrl = Constant.PrefabUrl.PLAYER1;
                playerAvatarPrefabUrl = Constant.PrefabUrl.PLAYER1_AVATAR;
                SkillBarPrefabUrl = Constant.PrefabUrl.SKILL_BAR1;
                hp = CharData.Player1.hp;
                speed = CharData.Player1.speed;
                jump_speed = CharData.Player1.jump_speed;
                break;
            case 1:
                // 国王猫
                playerPrefabUrl = Constant.PrefabUrl.PLAYER2;
                playerAvatarPrefabUrl = Constant.PrefabUrl.PLAYER2_AVATAR;
                SkillBarPrefabUrl = Constant.PrefabUrl.SKILL_BAR2;
                hp = CharData.Player2.hp;
                speed = CharData.Player2.speed;
                jump_speed = CharData.Player2.jump_speed;
                break;
            case 2:
                // 猎人喵
                playerPrefabUrl = Constant.PrefabUrl.PLAYER3;
                playerAvatarPrefabUrl = Constant.PrefabUrl.PLAYER3_AVATAR;
                SkillBarPrefabUrl = Constant.PrefabUrl.SKILL_BAR3;
                hp = CharData.Player3.hp;
                speed = CharData.Player3.speed;
                jump_speed = CharData.Player3.jump_speed;
                break;
            default:
                playerPrefabUrl = Constant.PrefabUrl.PLAYER1;
                break;
        }
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
        const skillBarNode = Globals.getNode(SkillBarPrefabUrl, this.node);
        
        if (skillBarNode) {
            skillBarNode.setScale(0.5, 0.5);
            skillBarNode.setPosition(-150, -130)
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
