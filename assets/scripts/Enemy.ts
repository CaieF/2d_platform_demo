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
    private attackCollider: Collider2D = null!; // 碰撞器
    private HitCollider: Collider2D = null!; // 受击范围
    hp:number = 100;
    chaseDistance:number = 200; // 追击距离
    attackRange: number = 50; // 攻击距离

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
                playTakedamage(this.display, this.attackCollider);
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
        
        if (this.ndAni) {
            this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        }
    }

    protected onEnable(): void {
        this.enemyStatus = Constant.CharStatus.IDLE;
        const colliders = this.node.getComponents(Collider2D);
        for (let collider of colliders) {
            if (collider.tag === Constant.ColliderTag.ENEMY) {
                this.HitCollider = collider;
            } else if (collider.tag === Constant.ColliderTag.ENEMY_ATTACK1) {
                this.attackCollider = collider;
            }
        }
        
        if (this.HitCollider) {
            this.HitCollider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.HitCollider?.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        this.hp = 100; //重置
    }

    protected onDisable(): void {
        if (this.HitCollider) {
            this.HitCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.HitCollider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {

    }

    update(deltaTime: number) {
        if (this.enemyStatus !== Constant.CharStatus.DEATH && this.enemyStatus !== Constant.CharStatus.ATTACK && this.enemyStatus !== Constant.CharStatus.TAKEDAMAGE && this.hp > 0) {
            this.rb = this.getComponent(RigidBody2D);
        
            let lv = this.rb!.linearVelocity;
            const playerPosition = this.getPlayerPosition();
            const distanceToPlayer = Vec2.distance(playerPosition, this.node.worldPosition);
            
            if (distanceToPlayer < this.chaseDistance) {
                if (this.enemyStatus === Constant.CharStatus.IDLE) this.enemyStatus = Constant.CharStatus.RUN;
                // 玩家在敌人左边
                if (this.enemyStatus === Constant.CharStatus.RUN) {
                    if (playerPosition.x < this.node.worldPosition.x) {
                        this.HitCollider.offset.x = 4.4;
                        lv.x -= this.speed * deltaTime;
                        this.node.setScale(-1.5, 1.5)
                    } else { // 玩家在敌人右边
                        this.HitCollider.offset.x = -4.4;
                        lv.x += this.speed * deltaTime;
                        this.node.setScale(1.5, 1.5)
                    }
                } // 在攻击范围内
                if (distanceToPlayer < this.attackRange) {
                    this.enemyStatus = Constant.CharStatus.ATTACK;
                    lv.x = 0;
                }
            
            } else { // 在追击范围外
                if (this.enemyStatus === Constant.CharStatus.RUN) this.enemyStatus = Constant.CharStatus.IDLE;
                lv.x = 0;
            }
        
            this.rb!.linearVelocity = lv;
        }    
        
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
                        console.log(111);
                        
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
                case Constant.ColliderTag.PLAYER:
                    contact.disabled = false;
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

        const callback = this.scheduleOnce(() => {
            this.updateColliderPosition(this.attackCollider, 14);
            this.attackCollider.enabled = true;
        }, 0.8)
        // this.attackCollider.enabled = false;
        
        display.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            if (this.hp > 0) this.enemyStatus = Constant.CharStatus.IDLE;
            this.attackCollider.enabled = false;
            this.unschedule(callback);
        }, this);

    }

    updateColliderPosition =(collider: Collider2D, offset: number) => {
        collider.offset.x = this.node.scale.x * offset;
        collider.node.worldPosition = this.node.worldPosition;
    }

    // 获取角色位置
    getPlayerPosition() {
        return GameContext.ndPlayer.worldPosition;
    }
}


