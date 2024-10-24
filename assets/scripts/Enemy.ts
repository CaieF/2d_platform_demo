import { _decorator,  clamp,  Collider2D, Component, Contact2DType, dragonBones, IPhysics2DContact, lerp, Node, randomRangeInt, RigidBody2D, Vec2 } from 'cc';
import { Constant } from './Constant';
import { playIdle, playRun, playTakedamage } from './PlayAnimation';
import { GameContext } from './GameContext';
import { Globals } from './Globals';
import { Util } from './Util';
import { Arrow } from './Arrow';
import { Explosion } from './Explosion';
import { UseSkill } from './UseSkill';
import { CharData } from './CharData';
import { Camera } from './Camera';
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
    private randomMoveTime: number = 0.016; // 随机移动时间
    private isSpeed: boolean = false; // 是否加速
    enemyId: number = 0; // 角色id
    isBoss: boolean = false; // 是否是Boss
    speed: number = 10;
    hp:number = 100;
    maxHp:number = 100;
    chaseDistance:number = 200; // 追击距离
    attackRange: number = 70; // 攻击距离
    attackNumber: number = 1; // 攻击方式数
    attack: number = 1; // 正在使用的攻击方式
    HitColliderOffsetX: number = 0; // 受击范围偏移量x

    public setValue(enemyId: number, isBoss: boolean = false, speed:number, hp: number, chaseDistance: number, attackRange:number, attackNumber: number, HitColliderOffsetX: number) {
        this.enemyId = enemyId;
        this.isBoss = isBoss;
        this.speed = speed;
        this.maxHp = hp;
        this.hp = hp;
        this.chaseDistance = chaseDistance;
        this.attackRange = attackRange;
        this.attackNumber = attackNumber;
        this.HitColliderOffsetX = HitColliderOffsetX;
    }

    static readonly Event = {
        DEATH: 0,
        HURT: 1,
        WIN: 2,
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
        // this.speed = 10;
        
        if (this.ndAni) {
            this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        }
        this.rb = this.getComponent(RigidBody2D);
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

        // this.hp = 100; //重置
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
        if (this.enemyStatus === Constant.CharStatus.DEATH) {
            Util.checkCollider(this.attackCollider, false);
            return;
        }
        const x = clamp(this.node.position.x, -180, 1330); // 限制角色移动范围
        this.node.setPosition(x, this.node.position.y, 0);
        let lv = this.rb!.linearVelocity;

        this.randomMoveTimer += deltaTime;
        if (this.randomMoveTimer > this.randomMoveTime) {
            this.randomMoveTimer = 0;
            lv.x = (Math.random() * 2 - 1) / 10;
        }

        if (this.enemyStatus !== Constant.CharStatus.DEATH 
            && this.enemyStatus !== Constant.CharStatus.ATTACK
            && this.enemyStatus !== Constant.CharStatus.TAKEDAMAGE 
            && this.hp > 0) {
        
            const playerPosition = Util.getPlayerPosition();
            const distanceToPlayer = Vec2.distance(playerPosition, this.node.worldPosition);
            
            if (distanceToPlayer < this.chaseDistance) {
                if (this.enemyStatus === Constant.CharStatus.IDLE) {
                    this.enemyStatus = Constant.CharStatus.RUN;
                    if(this.isBoss) GameContext.ndCamera.getComponent(Camera).shake(); // 震动
                }
                // 玩家在敌人左边
                if (this.enemyStatus === Constant.CharStatus.RUN) {
                    if (playerPosition.x < this.node.worldPosition.x) {
                        this.HitCollider.offset.x = this.HitColliderOffsetX;
                        lv.x = - this.speed / 2;
                        this.node.setScale(-1, 1)
                    } else { // 玩家在敌人右边
                        this.HitCollider.offset.x = -this.HitColliderOffsetX;
                        lv.x = this.speed / 2;
                        this.node.setScale(1, 1)
                    }
                } // 在攻击范围内
                if (distanceToPlayer < this.attackRange) {
                    this.enemyStatus = Constant.CharStatus.ATTACK;
                    if (!this.isBoss) {
                        lv.x = 0;
                    }
                }
            
            } else { // 在追击范围外
                if (this.enemyStatus === Constant.CharStatus.RUN) this.enemyStatus = Constant.CharStatus.IDLE;
                this.randomMoveTimer += deltaTime;
                if (this.randomMoveTimer > this.randomMoveTime) {
                    this.randomMoveTimer = 0;
                    lv.x = (Math.random() * 2 - 1) / 10;
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
                            Util.applyKnockback(this.isBoss? 10000:1000, this.rb!, new Vec2(direction, 0));
                            this.hurt(1);
                        }
                        break;
                    case Constant.ColliderTag.PLAYER_ATTACK3:
                        if (this.enemyStatus !== Constant.CharStatus.DEATH) {
                            if (other.node.getComponent(Arrow).isSkill === true) {
                                this.hurt(3);
                            } else {
                                other.node.getComponent(Arrow).isHit = true;
                                this.hurt(100);
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
                                UseSkill.shootThunderStrike(self.node.worldPosition);
                            }, 0)
                        } else if(other.node.getComponent(Arrow).isFireBall === true) {
                            setTimeout(() => {
                                UseSkill.redExplosion(self.node.worldPosition, 1);
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
                if (this.isBoss === true && this.hp <= 0) {
                    this._cb && this._cb.apply(this._target, [Enemy.Event.WIN])
                }
                if (this.hp <= 0) {
                    Globals.putNode(this.node);
                }
            
            display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        display.on(dragonBones.EventObject.COMPLETE, onComplete, this);
        
    }

    playAttack() {
        
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        // this.attack = randomRangeInt(1, this.attackNumber + 1);
        this.attack = 1;
        display.armatureName = `Attack${this.attack}`;
        display.playAnimation(`Attack${this.attack}`, 1);
        if (this.isBoss === false) {
            switch (this.enemyId) {
                    case CharData.EnemysId.Enemy1:
                    this.updateAttackCollider(0.65, 22.5, 0.8);
                    break;
                    case CharData.EnemysId.Enemy2:
                    this.updateAttackCollider(0.2, 1.2);
                    break;
                    case CharData.EnemysId.Enemy3:
                    this.updateAttackCollider(0.3, 14, 0.55);
                    break;
                default:
                    break;
            }
        }
        
        if (this.isBoss === true) {
            switch (this.enemyId) {
                case CharData.EnemysId.Boss1:
                    // boos1相关技能
                    switch (this.attack) {
                        case 1:
                            this.isSpeed = true;
                            this.updateSpeed(this.speed * 0.9);
                            this.updateAttackCollider(0, 0, null, -60);
                            GameContext.ndCamera.getComponent(Camera).shake(); // 震动
                            break;
                        case 2:
                            this.node.setPosition(this.node.position.x, this.node.position.y + 50);
                            this.updateAttackCollider(0.5, 10, 1, -60);
                            break;
                        case 3:
                            this.updateAttackCollider(0.4, 25, 0.6, -30);
                            break;
                    }
                    break;
                case CharData.EnemysId.Boss2:
                    // boss2相关技能
                    switch (this.attack) {
                        case 1:
                            this.updateAttackCollider(0.5, 24.5, null, -18.1);
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                default:
                    break;
                }
            }
            
        }
        // this.attackCollider.enabled = false;

        const onComplete = () => {
            // if (this.isBoss) return;
            this.isSpeed = false;
            // this.updateSpeed(this.speed);
            if (this.hp > 0) this.enemyStatus = Constant.CharStatus.IDLE;
            this.attackCollider.enabled = false;
            
            display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        
        display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);

    }

    // 更新攻击范围随左右移动的变化
    updateColliderPosition =(collider: Collider2D, offsetX: number, offsetY?: number) => {
        if (offsetY) {
            collider.offset.y = offsetY;
        }
        collider.offset.x = this.node.scale.x * offsetX;
        collider.node.worldPosition = this.node.worldPosition;
    }

    // 攻击范围显示
    private updateAttackCollider(time1: number, offsetx:number,time2?: number, offsety?: number) {
        const callback = this.scheduleOnce(() => {
            this.updateColliderPosition(this.attackCollider, offsetx, offsety? offsety : null);
            this.attackCollider.enabled = true;
        }, time1);
        if (time2) {
            this.scheduleOnce(() => {
                Util.checkCollider(this.attackCollider, false);
                this.unschedule(callback);
            }, time2);
        }
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


    // 受伤
    hurt (damage: number) {
        this.hp -= damage;
        Util.showText( `${damage}`, '#FFFFFF' ,this.node.worldPosition, GameContext.ndTextParent);
        this._cb && this._cb.apply(this._target, [Enemy.Event.HURT, damage]);
        
        if (this.hp <= 0) {
            this._cb && this._cb.apply(this._target, [Enemy.Event.DEATH])
            this.enemyStatus = Constant.CharStatus.DEATH;
        }

        if (this.isBoss === false && this.hp > 0 && this.enemyStatus !== Constant.CharStatus.ATTACK && this.enemyStatus !== Constant.CharStatus.TAKEDAMAGE) {
            this.enemyStatus = Constant.CharStatus.TAKEDAMAGE;
        } 
    }

    // 注册事件
    onEnemyEvent(cb: Function, target?: any) {
        this._cb = cb;
        this._target = target;
    }

    // 更新速度
    private updateSpeed(newSpeed: number) {
        this.rb.linearVelocity = this.rb.linearVelocity.normalize().multiply(new Vec2(newSpeed, newSpeed));
    }
    
}


