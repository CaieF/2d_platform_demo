import { _decorator, Collider2D, Component, Contact2DType, dragonBones, IPhysics2DContact, Node, RigidBody2D, Vec2 } from 'cc';
import { Constant } from './Constant';
import { playIdle, playRun, playTakedamage } from './PlayAnimation';
import { GameContext } from './GameContext';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property(Node) private ndAni: Node;

    private _enemyStatus: number = 0; // 角色状态
    private speed: number = 10;
    private display: dragonBones.ArmatureDisplay;
    private rb: RigidBody2D = null!;
    private getHitRange: Collider2D = null!; // 受击范围
    hp:number = 100;
    chaseDistance:number = 120; // 追击距离
    attackRange: number = 30; // 攻击距离

    public get enemyStatus(): number {
        return this._enemyStatus;
    }

    public set enemyStatus(value: number) {
        this._enemyStatus = value;
        switch (value) {
            case Constant.CharStatus.IDLE:
                playIdle(this.display);
                break;
            case Constant.CharStatus.RUN:
                playRun(this.display);
                break;
            case Constant.CharStatus.TAKEDAMAGE:
                playTakedamage(this.display);
                break;
            case Constant.CharStatus.DEATH:
                this.playDeath();
                break;
            case Constant.CharStatus.ATTACK:
                this.playAttack();
                break;
            default:
                break;
            }
    }

    protected onLoad() {
        this.speed = 10;
        this.getHitRange = this.node.getComponent(Collider2D);
        if (this.ndAni) {
            this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        }
    }

    protected onEnable(): void {
        this.enemyStatus = Constant.CharStatus.IDLE;
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider?.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        this.hp = 100; //重置
    }

    protected onDisable(): void {
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {

    }

    update(deltaTime: number) {
        this.rb = this.getComponent(RigidBody2D);
        let lv = this.rb!.linearVelocity;
        const playerPosition = this.getPlayerPosition();
        const distanceToPlayer = Vec2.distance(playerPosition, this.node.worldPosition);
        if (distanceToPlayer < this.chaseDistance) {
            

            if (this.enemyStatus === Constant.CharStatus.IDLE) this.enemyStatus = Constant.CharStatus.RUN;
            // 玩家在敌人左边
            if (this.enemyStatus === Constant.CharStatus.RUN) {
                if (playerPosition.x < this.node.worldPosition.x) {
                    this.getHitRange.offset.x = 4.4;
                    lv.x -= this.speed * deltaTime;
                    this.node.setScale(-1.5, 1.5)
                } else { // 玩家在敌人右边
                    this.getHitRange.offset.x = -4.4;
                    lv.x += this.speed * deltaTime;
                    this.node.setScale(1.5, 1.5)
                }
            }
            // 在敌人攻击范围内
            // if (distanceToPlayer < this.attackRange) {
            //     this.enemyStatus = Constant.CharStatus.ATTACK;
            // }
        } else {
            if (this.enemyStatus === Constant.CharStatus.RUN) this.enemyStatus = Constant.CharStatus.IDLE;
            lv.x = 0;
        }
        
        this.rb!.linearVelocity = lv;
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if (self && other) {
            if (other.group === Constant.ColliderGroup.PLAYER) {
                switch(other.tag) {
                    case Constant.ColliderTag.PLAYER_ATTACK1:
                        if (this.enemyStatus !== Constant.CharStatus.DEATH) {
                            this.enemyStatus = Constant.CharStatus.TAKEDAMAGE;
                            this.hp -= 10;
                        }
                        break;
                    case Constant.ColliderTag.PLAYER:
                        contact.disabled = true;
                        break;
                    default:
                        break;
                }
            }
        }
        
    }

    onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if (other.group === Constant.ColliderGroup.PLAYER) {
            switch(other.tag) {
                case Constant.ColliderTag.PLAYER_ATTACK1:
                    if (this.enemyStatus === Constant.CharStatus.TAKEDAMAGE) {
                        if (this.hp > 0) {
                            this.enemyStatus = Constant.CharStatus.IDLE;
                        } else {
                            this.enemyStatus = Constant.CharStatus.DEATH;
                        }
                    }
                    
                    break;
                default:
                    break;
            }
        }
    }

    
    
    playDeath() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        console.log('playDeath');
        
        display.armatureName = 'Death';
        display.playAnimation('Death', 1);
        // this.node.destroy();
    }

    playAttack() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Attack1';
        display.playAnimation('Attack1', 1);
    }

    // 获取角色位置
    getPlayerPosition() {
        return GameContext.ndPlayer.worldPosition;
    }
}


