import { _decorator, Collider2D, Component, Contact2DType, dragonBones, IPhysics2DContact, lerp, Node, RigidBody2D, Vec2 } from 'cc';
import { Constant } from './Constant';
import { playIdle, playRun, playTakedamage } from './PlayAnimation';
import { GameContext } from './GameContext';
import { Globals } from './Globals';
import { Util } from './Util';
import { Arrow } from './Arrow';
import { Explosion } from './Explosion';
import { UseSkill } from './UseSkill';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property(Node) private ndAni: Node;

    private _enemyStatus: number = 0; // 角色状态
    private display: dragonBones.ArmatureDisplay;
    private rb: RigidBody2D = null!;
    private attackCollider: Collider2D = null!; // 碰撞器
    private HitCollider: Collider2D = null!; // 受击范围
    private randomMoveTimer: number = 0; // 随机移动计时器
    private randomMoveTime: number = 0.5; // 随机移动时间
    speed: number = 10;
    hp:number = 100;
    chaseDistance:number = 200; // 追击距离
    attackRange: number = 70; // 攻击距离

    static readonly Event = {
        DEATH: 0
    }

    private _cb: Function;
    private _target: any;

    public get enemyStatus(): number {
        return this._enemyStatus;
    }

    public set enemyStatus(value: number) {
        Util.checkCollider(this.attackCollider, false);
        this._enemyStatus = value;
        switch (value) {
            case Constant.CharStatus.IDLE:
                playIdle(this.display);
                break;
            case Constant.CharStatus.RUN:
                playRun(this.display);
                break;
            case Constant.CharStatus.TAKEDAMAGE:
                this.playTakedamage();
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

            if (this.enemyStatus === Constant.CharStatus.IDLE) {
                this.randomMoveTimer += deltaTime;
                if (this.randomMoveTimer > this.randomMoveTime) {
                    this.randomMoveTimer = 0;
                    lv.x = Math.random() * 2 - 1;
                }
            }
            
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
                if (this.enemyStatus === Constant.CharStatus.IDLE) {
                    this.randomMoveTimer += deltaTime;
                    if (this.randomMoveTimer > this.randomMoveTime) {
                        this.randomMoveTimer = 0;
                        lv.x = (Math.random() * 2 - 1) / 10;
                    }
                } else {
                    lv.x = 0;
                }
            }
        
            this.rb!.linearVelocity = lv;
        }    
        
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if (self && other) {
            if (other.group === Constant.ColliderGroup.PLAYER_ATTACK) {
                switch(other.tag) {
                    case Constant.ColliderTag.PLAYER_ATTACK1:
                        if (this.enemyStatus !== Constant.CharStatus.DEATH) {
                            this.hurt(1);
                        }
                        break;
                    case Constant.ColliderTag.PLAYER_ATTACK2:
                        if (this.enemyStatus !== Constant.CharStatus.DEATH) {
                            const scaleX = this.node.scale.x; // 获取敌人缩放的X值
                            const direction = scaleX > 0 ? -1 : 1;
                            Util.applyKnockback(1000, this.rb!, new Vec2(direction, 0));
                            this.hurt(1);
                        }
                        break;
                    case Constant.ColliderTag.PLAYER_ATTACK3:
                        if (this.enemyStatus !== Constant.CharStatus.DEATH) {
                            if (other.node.getComponent(Arrow).isSkill === true) {
                                // const ndThunderStrike = Globals.getNode(Constant.PrefabUrl.THUNDER_STRIKE, GameContext.ndWeaponParent);
                                // ndThunderStrike.worldPosition = other.node.worldPosition;
                                // ndThunderStrike.getComponent(Explosion).playThunderStrike();
                                this.hurt(3);
                            } else {
                                other.node.getComponent(Arrow).isHit = true;
                                this.hurt(2);
                            }
                            break;
                        }
                    default:
                        break;
                }
            } else if (other.group === Constant.ColliderGroup.PLAYER) {
                switch(other.tag) {
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
        if (other.group === Constant.ColliderGroup.PLAYER_ATTACK) {
            switch(other.tag) {
                case Constant.ColliderTag.PLAYER_ATTACK1:
                    break;
                case Constant.ColliderTag.PLAYER_ATTACK3:
                    if (this.enemyStatus !== Constant.CharStatus.DEATH) {
                        if (other.node.getComponent(Arrow).isSkill === true) {
                            setTimeout(() => {
                                const ndThunderStrike = Globals.getNode(Constant.PrefabUrl.THUNDER_STRIKE, GameContext.ndWeaponParent0);
                                if (ndThunderStrike) {
                                    ndThunderStrike.worldPosition = self.node.worldPosition;
                                    ndThunderStrike.getComponent(Explosion).playThunderStrike();
                                    console.log('闪电');
                                }
                            }, 0)
                        }
                    }
                    break;
                default:
                    break;
            }
        } else if (other.group === Constant.ColliderGroup.PLAYER) {
            switch (other.tag) {
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
        if (!display) return;
        display.armatureName = 'Death';
        display.playAnimation('Death', 1);

        const onComplete = () => {
            
                if (this.hp <= 0) {
                    Globals.putNode(this.node);
                    console.log('死亡');
                }
            
            display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        display.on(dragonBones.EventObject.COMPLETE, onComplete, this);
        
    }

    playAttack() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Attack1';
        display.playAnimation('Attack1', 1);

        const callback = this.scheduleOnce(() => {
            this.updateColliderPosition(this.attackCollider, 14);
            this.attackCollider.enabled = true;
        }, 0.65)
        this.scheduleOnce(() => {
            Util.checkCollider(this.attackCollider, false);
        }, 0.8)
        // this.attackCollider.enabled = false;

        const onComplete = () => {
            if (this.hp > 0) this.enemyStatus = Constant.CharStatus.IDLE;
            this.attackCollider.enabled = false;
            this.unschedule(callback);
            display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        
        display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);

    }

    updateColliderPosition =(collider: Collider2D, offset: number) => {
        collider.offset.x = this.node.scale.x * offset;
        collider.node.worldPosition = this.node.worldPosition;
    }

    // 受击状态
    playTakedamage() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'TakeDamage';
        display.playAnimation('TakeDamage', 1);
        const onComplete = () => {
            this.enemyStatus = Constant.CharStatus.IDLE;
            display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    // 获取角色位置
    getPlayerPosition() {
        return GameContext.ndPlayer.worldPosition;
    }

    // 受伤
    hurt (damage: number) {
        this.hp -= damage;
        Util.showText( `${damage}`, '#FFFFFF' ,this.node.worldPosition, GameContext.ndTextParent);
        if (this.hp > 0 && this.enemyStatus !== Constant.CharStatus.ATTACK && this.enemyStatus !== Constant.CharStatus.TAKEDAMAGE) {
            this.enemyStatus = Constant.CharStatus.TAKEDAMAGE;
        } else if (this.hp <= 0) {
            this._cb && this._cb.apply(this._target, [Enemy.Event.DEATH])
            this.enemyStatus = Constant.CharStatus.DEATH;
        }
    }

    // 注册事件
    onEnemyEvent(cb: Function, target?: any) {
        this._cb = cb;
        this._target = target;
    }
}


