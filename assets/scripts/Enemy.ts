import { _decorator,  BoxCollider2D,  clamp,  Collider2D, Component, Contact2DType, dragonBones, IPhysics2DContact, lerp, math, Node, randomRangeInt, RigidBody2D, Vec2 } from 'cc';
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
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property(Node) private ndAni: Node;

    private _enemyStatus: number = 0; // 角色状态
    private display: dragonBones.ArmatureDisplay;
    private rb: RigidBody2D = null!;
    private attack1Collider: Collider2D = null!; // 攻击类型1碰撞器
    private attack2Collider: Collider2D = null!; // 攻击类型2碰撞器
    private HitCollider: Collider2D = null!; // 受击范围
    private randomMoveTimer: number = 0; // 随机移动计时器
    private randomMoveTime: number = 0.016; // 随机移动时间
    private attackTimer: number = 0; // 攻击计时器
    private attackTime: number = 0.25; // 攻击时间
    private runTimer: number = 0; // 移动计时器
    private runTime: number = 0.35; // 移动时间
    private shakeTimer: number = 0; // 震动计时器
    private shakeTime: number = 0.8; // 震动时间
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
        Util.checkCollider(this.attack1Collider, false);
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
        this.attackTimer = 0;
        this.randomMoveTimer = 0;
        this.enemyStatus = Constant.CharStatus.IDLE;
        const colliders = this.node.getComponents(Collider2D);
        for (let collider of colliders) {
            
            if (collider.tag === Constant.ColliderTag.ENEMY) {
                this.HitCollider = collider;
            } else if (collider.tag === Constant.ColliderTag.ENEMY_ATTACK1) {
                this.attack1Collider = collider;
            } else if (collider.tag === Constant.ColliderTag.ENEMY_ATTACK2) {
                this.attack2Collider = collider;
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
            Util.checkCollider(this.attack1Collider, false);
            return;
        }
        const x = clamp(this.node.position.x, -180, 1330); // 限制角色移动范围
        this.node.setPosition(x, this.node.position.y, 0);
        let lv = this.rb!.linearVelocity;

        this.attackTimer += deltaTime;
        this.randomMoveTimer += deltaTime;
        this.runTimer += deltaTime;
        this.shakeTimer += deltaTime;
        if (this.randomMoveTimer > this.randomMoveTime) {
            this.randomMoveTimer = 0;
            lv.x = (Math.random() * 2 - 1) / 10;
        }
        if (this.runTimer >= this.runTime && this.isBoss && this.enemyStatus === Constant.CharStatus.RUN) {
            this.runTimer = 0;
            AudioManager.Instance.playSound('BossSkillSounds/bong', 0.6)
        }
        if (this.shakeTimer >= this.shakeTime && this.isBoss && this.enemyStatus === Constant.CharStatus.RUN) {
            this.shakeTimer = 0;
            GameContext.ndCamera.getComponent(Camera).shake(); // 震动 
        }

        if (this.enemyStatus !== Constant.CharStatus.DEATH 
            && this.enemyStatus !== Constant.CharStatus.ATTACK
            && this.enemyStatus !== Constant.CharStatus.TAKEDAMAGE 
            && this.hp > 0) {
        
            const chaseNode = Util.getClosestPlayerOrPet(this.node, this.chaseDistance);  // 获取最近的玩家或宠物

            // const playerPosition = Util.getPlayerPosition();
            // const distanceToPlayer = Vec2.distance(chaseNode.worldPosition, this.node.worldPosition);
            let distanceToPlayer = Infinity
            if (chaseNode) {
                distanceToPlayer = Math.abs(chaseNode.worldPosition.x - this.node.worldPosition.x); 
            } 
             // 距离
            
            if (chaseNode && this.attackTimer >= this.attackTime) {
                if (this.enemyStatus === Constant.CharStatus.IDLE) {
                    this.enemyStatus = Constant.CharStatus.RUN;
                }
                
                if (this.enemyStatus === Constant.CharStatus.RUN) {
                    if (chaseNode.worldPosition.x < this.node.worldPosition.x) { // 追击目标在敌人左边
                        this.HitCollider.offset.x = this.HitColliderOffsetX;
                        lv.x = - this.speed / 2;
                        this.node.setScale(-1, 1)
                    } else { // 追击目标在敌人右边
                        this.HitCollider.offset.x = -this.HitColliderOffsetX;
                        lv.x = this.speed / 2;
                        this.node.setScale(1, 1)
                    }
                } // 在攻击范围内
                if (distanceToPlayer < this.attackRange && this.attackTimer >= this.attackTime) {
                    this.enemyStatus = Constant.CharStatus.ATTACK;
                    if (!this.isBoss) {
                        lv.x = 0;
                    }
                }
            
            } else { // 在追击范围外
                if (this.enemyStatus === Constant.CharStatus.RUN) {
                    this.enemyStatus = Constant.CharStatus.IDLE;
                    if (this.isBoss) console.log('boss技能停止了');
                    
                }
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
                            Util.applyKnockback(this.isBoss? 10000:3000, this.rb!, new Vec2(direction, 0));
                            this.hurt(1);
                        }
                        break;
                    case Constant.ColliderTag.PLAYER_ATTACK3:
                        if (this.enemyStatus !== Constant.CharStatus.DEATH) {
                            if (other.node.getComponent(Arrow).isSkill === true) {
                                this.hurt(3);
                            } else {
                                other.node.getComponent(Arrow).isHit = true;
                                this.hurt(4);
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
        if (this.enemyId !== CharData.EnemysId.Boss1) {
            AudioManager.Instance.playSound('CharSounds/skeletonHit', 0.4)
        } else {
            AudioManager.Instance.playSound('CharSounds/BossGrilDeath')
        }
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
        this.attack = randomRangeInt(1, this.attackNumber + 1);
        // this.attack = 2;
        display.armatureName = `Attack${this.attack}`;
        display.playAnimation(`Attack${this.attack}`, 1);
        if (this.isBoss === false) {
            switch (this.enemyId) {
                    case CharData.EnemysId.Enemy1:
                    this.updateAttackCollider(this.attack1Collider, 0.65, 22.5, 0.8);
                    break;
                    case CharData.EnemysId.Enemy2:
                    this.updateAttackCollider(this.attack1Collider, 0.2, 1.2);
                    break;
                    case CharData.EnemysId.Enemy3:
                    this.updateAttackCollider(this.attack1Collider, 0.3, 14, 0.55);
                    break;
                default:
                    break;
            }
        }
        
        if (this.isBoss === true) {
            switch (this.enemyId) {
                case CharData.EnemysId.Boss1:
                    this.Boss1UseSkill(this.attack);
                    break;
                case CharData.EnemysId.Boss2:
                    this.Boss2UseSkill(this.attack);
                    break;
                default:
                    break;
            }
            
        }
        // this.attackCollider.enabled = false;

        const onComplete = () => {
            // if (this.isBoss) return;
            this.attackTimer = 0;

            this.isSpeed = false;
            // this.updateSpeed(this.speed);
            if (this.hp > 0) this.enemyStatus = Constant.CharStatus.IDLE;
            this.attack1Collider.enabled = false;
            
            display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        
        display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);

    }


    // 受击状态
    playTakedamage() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'TakeDamage';
        display.playAnimation('TakeDamage', 1);
        if (!this.isBoss) {
            AudioManager.Instance.playSound('CharSounds/skeletonHit', 0.4)
        }
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
    
    // boss1相关技能
    private Boss1UseSkill (attack: number) {
        switch (attack) {
            case 1:
                this.isSpeed = true;
                AudioManager.Instance.playSound('BossSkillSounds/bong', 0.8)
                this.updateSpeed(this.speed * 0.9);
                this.updateAttackCollider(this.attack1Collider, 0, 0, null, -60);
                GameContext.ndCamera.getComponent(Camera).shake(); // 震动
                break;
            case 2:
                AudioManager.Instance.playSound('BossSkillSounds/bong', 0.8)
                this.node.setPosition(this.node.position.x, this.node.position.y + 50);
                this.updateAttackCollider(this.attack1Collider, 0.5, 10, 1, -60);
                break;
            case 3:
                AudioManager.Instance.playSound('BossSkillSounds/Fist1', 0.6)
                this.updateAttackCollider(this.attack1Collider, 0.4, 25, 0.6, -30);
                break;
        }
    }
    private Boss2UseSkill (attack: number) {
        switch (attack) {
            case 1:
                AudioManager.Instance.playSound('BossSkillSounds/bong', 0.6)
                this.updateAttackCollider(this.attack1Collider, 0.5, 24.5, null, -18.1);
                // this.updateAttackColliderSize(this.attackCollider, 100, 50)
                break;
            case 2:
                AudioManager.Instance.playSound('SkillSounds/explosion', 0.8);
                this.node.setPosition(this.node.position.x, this.node.position.y + 50);
                this.updateAttackCollider(this.attack2Collider, 0.2, 10, 0.3, -27);
                GameContext.ndCamera.getComponent(Camera).shake(); // 震动
                break;
            case 3:
                AudioManager.Instance.playSound('BossSkillSounds/Fist', 0.6)
                this.updateAttackCollider(this.attack2Collider, 0.2, 11.2, 0.4, -4);
                break;
        }
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
    private updateAttackCollider(collider: Collider2D, time1: number, offsetx:number,time2?: number, offsety?: number) {
        const callback = this.scheduleOnce(() => {
            this.updateColliderPosition(collider, offsetx, offsety? offsety : null);
            collider.enabled = true;
        }, time1);
        if (time2) {
            this.scheduleOnce(() => {
                // Util.checkCollider(this.attack1Collider, false);
                Util.checkCollider(collider, false);
                this.unschedule(callback);
            }, time2);
        }
    }

    // 攻击范围大小改变
    private updateAttackColliderSize(collider: BoxCollider2D, width: number, height: number) {
        collider.size = new math.Size(width, height);
    }

}


