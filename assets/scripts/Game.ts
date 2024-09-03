import { _decorator, Component, Label, Node, randomRangeInt, TiledMap } from 'cc';
import { Util } from './Util';
import { GameContext } from './GameContext';
import { Player } from './Player';
import { Globals } from './Globals';
import { Constant } from './Constant';
import { Enemy } from './Enemy';
import { ProgressBar } from './ProgressBar';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node) ndPlayerParents: Node;
    @property(Node) ndEnemyParents: Node;
    @property(Node) ndTextParent: Node;
    @property(TiledMap) Map: TiledMap;
    @property(Node) ndPlayerMessage: Node;

    private _ndLifeBar: Node;
    private _ndExpBar: Node;
    private _ndLevel: Node;

    protected onLoad() {
        GameContext.ndPlayerParents = this.ndPlayerParents;
        GameContext.ndTextParent = this.ndTextParent; 
        this._loadPlayer();
        // GameContext.ndPlayer = this.ndPlayerParents.getChildByName('Player1');
        // GameContext.player = GameContext.ndPlayer.getComponent(Player);
        GameContext.ndEnemyParents = this.ndEnemyParents;

        this._ndLifeBar = this.ndPlayerMessage.getChildByName('LifeBar');
        this._ndExpBar = this.ndPlayerMessage.getChildByName('ExpBar');
        this._ndLevel = this.ndPlayerMessage.getChildByName('Level');
    }

    protected onEnable(): void {
        const lifeBar = this._ndLifeBar.getComponent(ProgressBar);
        lifeBar.setProgress(1);
        lifeBar.setLabel(GameContext.player.hp, GameContext.player.maxHp);
        const expBar = this._ndExpBar.getComponent(ProgressBar);
        expBar.setProgress(0);
        expBar.setLabel(0, GameContext.player.maxExp);
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
        let playerPrefabUrl = Constant.PrefabUrl.PLAYER1;
        let playerAvatarPrefabUrl = Constant.PrefabUrl.PLAYER1_AVATAR;
        let hp: number = 100;
        let speed: number = 12;
        let jump_speed: number = 10;

        switch(GameContext.selectedPlayerId) {
            case 0:
                // 骑士猫
                playerPrefabUrl = Constant.PrefabUrl.PLAYER1;
                playerAvatarPrefabUrl = Constant.PrefabUrl.PLAYER1_AVATAR;
                hp = 100;
                speed = 12;
                jump_speed = 10;
                break;
            case 1:
                // 国王猫
                playerPrefabUrl = Constant.PrefabUrl.PLAYER2;
                playerAvatarPrefabUrl = Constant.PrefabUrl.PLAYER2_AVATAR;
                hp = 200;
                speed = 8;
                jump_speed = 8;
                break;
            default:
                playerPrefabUrl = Constant.PrefabUrl.PLAYER1;
                break;
        }
        const playerNode = Globals.getNode(playerPrefabUrl, GameContext.ndPlayerParents);
        if (playerNode) {
            GameContext.ndPlayer = playerNode;
            GameContext.player = playerNode.getComponent(Player);
            GameContext.player.hp = hp;
            GameContext.player.speed = speed;
            GameContext.player.maxHp = hp;
            GameContext.player.jump_speed = jump_speed;
        }
        const playerAvatarNode = Globals.getNode(playerAvatarPrefabUrl, this.ndPlayerMessage);
        if (playerAvatarNode) {
            playerAvatarNode.setPosition(-30, 0);
        }

    }
    protected update(dt: number): void {
        
    }

}
