import { _decorator, Collider2D, Component, dragonBones, Node, NodePool, RigidBody2D, Vec2 } from 'cc';
import { Util } from './Util';
import { Constant } from './Constant';
import { playIdle, playRun } from './PlayAnimation';
const { ccclass, property } = _decorator;

@ccclass('PetCat')
export class PetCat extends Component {
    @property(Node) private ndAni: Node;

    private _petStatus: number = 0; // 宠物状态
    private display: dragonBones.ArmatureDisplay; // 骨骼动画
    private rb: RigidBody2D = null!; // 刚体
    private HitCollider: Collider2D = null!; // 受击范围
    private AttackCollider: Collider2D = null!; // 攻击范围
    private randomMoveTimer: number = 0; // 随机移动计时器
    private randomMoveTime: number = 0.5; // 随机移动时间
    speed: number = 7;
    hp:number = 100;
    fllowDistance: number = 50; // 跟随距离
    chaseDistance:number = 100; // 追击距离
    attackRange: number = 70; // 攻击距离

    public get petStatus(): number {
        return this._petStatus;
    }

    public set petStatus(value: number) {
        Util.checkCollider(this.AttackCollider);
        this._petStatus = value;
        switch (value) {
            case Constant.CharStatus.IDLE:
                playIdle(this.display);
                break;
            case Constant.CharStatus.RUN:
                playRun(this.display);
                break;
            default:
                break;
        }
    }

    protected onLoad(): void {
        this.speed = 7;
        if (this.ndAni) {
            this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        }

        
    }

    protected onEnable(): void {
        this.petStatus = Constant.CharStatus.IDLE;
        const colliders = this.node.getComponents(Collider2D);
        
        for (let collider of colliders) {
            
            if (collider.tag === Constant.ColliderTag.ENEMY) {
                this.HitCollider = collider;
            } else if (collider.tag === Constant.ColliderTag.ENEMY_ATTACK1) {
                this.AttackCollider = collider;
            }
        }
    }
    start() {

    }

    update(deltaTime: number) {
        if (this.petStatus !== Constant.CharStatus.DEATH && this.petStatus !== Constant.CharStatus.ATTACK && this.petStatus !== Constant.CharStatus.TAKEDAMAGE) {
            this.rb = this.getComponent(RigidBody2D);
            let lv = this.rb!.linearVelocity;
            const playerPosition = Util.getPlayerPosition(); // 玩家位置
            const distanceToPlayer = Vec2.distance(playerPosition, this.node.worldPosition);

            if (this.petStatus === Constant.CharStatus.IDLE) {
                Util.rangeMove(deltaTime, this.randomMoveTimer, this.randomMoveTime, lv);
            }

            if (distanceToPlayer > this.fllowDistance) {
                // console.log(111);
                
                if (this.petStatus === Constant.CharStatus.IDLE) this.petStatus = Constant.CharStatus.RUN;
                if (this.petStatus === Constant.CharStatus.RUN) {
                    if (playerPosition.x < this.node.worldPosition.x) {
                        lv.x -= this.speed * deltaTime;
                        this.node.setScale(-1, 1)
                    } else { // 玩家在宠物右边
                        lv.x += this.speed * deltaTime;
                        this.node.setScale(1, 1)
                    }
                }
            } else {
                if (this.petStatus === Constant.CharStatus.RUN) this.petStatus = Constant.CharStatus.IDLE;
                if (this.petStatus === Constant.CharStatus.IDLE) {
                    // this.randomMoveTimer += deltaTime;
                    // if (this.randomMoveTimer > this.randomMoveTime) {
                    //     this.randomMoveTimer = 0;
                    //     lv.x = (Math.random() * 2 - 1) / 10;
                    // }
                    Util.rangeMove(deltaTime, this.randomMoveTimer, this.randomMoveTime, lv);
                } else {
                    lv.x = 0;
                }
            }
            this.rb!.linearVelocity = lv;
        }
    }
}


