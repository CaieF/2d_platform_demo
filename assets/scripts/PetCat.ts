import { _decorator, Collider2D,clamp, Component,Contact2DType, IPhysics2DContact, dragonBones, Node, NodePool, RigidBody2D, Vec2 } from 'cc';
import { Util } from './Util';
import { Constant } from './Constant';
import { playIdle, playRun } from './PlayAnimation';
import { GameContext } from './GameContext';
import { Globals } from './Globals';
import { CharData } from './CharData';
import { UseSkill } from './UseSkill';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('PetCat')
export class PetCat extends Component {
    @property(Node) private ndAni: Node;
    @property(Node) private ndSkillStart: Node=null!;

    private _petStatus: number = 0; // 宠物状态
    private display: dragonBones.ArmatureDisplay; // 骨骼动画
    private rb: RigidBody2D = null!; // 刚体
    private HitCollider: Collider2D = null!; // 受击范围
    private AttackCollider: Collider2D = null!; // 攻击范围
    private randomMoveTimer: number = 0; // 随机移动计时器
    private randomMoveTime: number = 0.5; // 随机移动时间
    private attackTimer: number = 0; // 攻击计时器
    private attackTime: number = 0.35; // 攻击时间
    private petType: number = 0; // 宠物类型
    private petId: number = 0; // 宠物id

    speed: number = 7;
    hp:number = 10;
    ap: number = 1; // 攻击力
    maxHp: number = 10; // 最大血量

    hurtedDamage: number = 0; // 受到的伤害
    hurtedMaxDamage: number = 20; // 受到的最大伤害

    fllowDistance: number = 100; // 跟随距离
    chaseDistance:number = 500; // 追击距离
    attackRange: number = 30; // 攻击距离
    HitColliderOffsetX: number = 0;

    level: number = 1; // 等级
    exp: number = 0; // 经验值
    maxExp: number = 100; // 最大经验值

    private _onEvent: Function;
    private _target: any;

    // 角色事件
    static readonly Event = {
        HURT: 0, // 受伤
        DEATH: 1, // 死亡
        ADD_EXP: 2, // 增加经验
        LEVEL_UP: 3, // 升级
    }

    // 注册宠物事件
    onPetEvent(onEvent: Function, target?: any) {
        this._onEvent = onEvent;
        this._target = target;
    }

    public setValue(id: number, hp: number, ap: number, speed: number, petType: number, chaseDistance: number, attackRange: number, attackTime?: number) {
        this.petId = id;
        this.hp = hp;
        this.ap = ap;
        this.speed = speed;
        this.maxHp = hp;
        this.petType = petType;
        this.chaseDistance = chaseDistance;
        this.attackRange = attackRange;
        if (attackTime) {
            this.attackTime = attackTime;
        }
    }


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
            case Constant.CharStatus.ATTACK:
                this.playAttack();
                break;
            case Constant.CharStatus.TAKEDAMAGE:
                this.playTakedamage();
                break;
            case Constant.CharStatus.DEATH:
                this.playDeath();
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
        this.attackTimer = 0;
        this.randomMoveTimer = 0;
        this.hp = this.maxHp;
        this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        this.petStatus = Constant.CharStatus.IDLE;
        const colliders = this.node.getComponents(Collider2D);
        
        for (let collider of colliders) {
            
            if (collider.group === Constant.ColliderGroup.PLAYER) {
                this.HitCollider = collider;
            } else if (collider.group === Constant.ColliderGroup.PLAYER_ATTACK) {
                this.AttackCollider = collider;
            }
        }

        // 添加碰撞事件
        if (this.HitCollider) {
            this.HitCollider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.HitCollider?.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    start() {

    }

    update(deltaTime: number) {
        if (this.petStatus === Constant.CharStatus.DEATH) return;
        if (this.petStatus === Constant.CharStatus.ATTACK || this.petStatus === Constant.CharStatus.TAKEDAMAGE) return;
        this.rb = this.getComponent(RigidBody2D);
        let lv = this.rb!.linearVelocity;
        const x = clamp(this.node.position.x, -180, 1330); // 限制角色移动范围
        this.node.setPosition(x, this.node.position.y, 0);
        const playerPosition = Util.getPlayerPosition(); // 玩家位置
        const distanceToPlayer = Vec2.distance(playerPosition, this.node.worldPosition);

        // console.log(Util.getNearbyEnemies(GameContext.ndPlayer, 100));

        // 随机移动
        this.randomMoveTimer += deltaTime;
        this.attackTimer += deltaTime;
        if (this.randomMoveTimer > this.randomMoveTime) {
            this.randomMoveTimer = 0;
            lv.x = (Math.random() * 2 - 1) / 10;
        }

        // 获取玩家一定范围内的最近敌人
        let chaseEnemy: Node = Util.getClosestEnemy(this.node, this.chaseDistance)
        // 敌人存在追击敌人（治疗性和增益型宠物不进行追击）
        if (chaseEnemy && this.attackTimer >= this.attackTime 
        && this.petType !== CharData.PetType.Cure && this.petType !== CharData.PetType.Help) { 
            // console.log(chaseEnemy);
            const enemyPosition = chaseEnemy.worldPosition;  // 敌人位置
            const distanceToEnemy = Math.abs(enemyPosition.x - this.node.worldPosition.x); // 距离
            if (this.petStatus === Constant.CharStatus.IDLE) {
                this.petStatus = Constant.CharStatus.RUN;
            }

            if (this.petStatus === Constant.CharStatus.RUN) {
                if (enemyPosition.x < this.node.worldPosition.x) { // // 敌人在宠物的左边
                    this.HitCollider.offset.x = this.HitColliderOffsetX;
                    lv.x = -this.speed / 2;
                    this.node.setScale(-1, 1);
                } else {
                    this.HitCollider.offset.x = -this.HitColliderOffsetX;
                    lv.x = this.speed / 2;
                    this.node.setScale(1, 1);
                }
            }
            // 在攻击范围内
            if (distanceToEnemy < this.attackRange && this.attackTimer >= this.attackTime) {
                if (this.petType === CharData.PetType.Defence) {
                    this.petStatus = Constant.CharStatus.IDLE;
                    this.attackTimer = 0;
                }
                else this.petStatus = Constant.CharStatus.ATTACK;
                lv.x = 0;
            }
        } else {
            if (this.petType === CharData.PetType.Cure && this.attackTimer >= this.attackTime) {
                this.petStatus = Constant.CharStatus.ATTACK;
                lv.x = 0;
            }
            // 距离大于跟随玩家距离，则跟随玩家
            if (distanceToPlayer > this.fllowDistance) {
                if (this.petStatus === Constant.CharStatus.IDLE) this.petStatus = Constant.CharStatus.RUN;
                if (this.petStatus === Constant.CharStatus.RUN) {
                    if (playerPosition.x < this.node.worldPosition.x) {
                        lv.x = -this.speed / 2;
                        this.node.setScale(-1, 1)
                    } else { // 玩家在宠物右边
                        lv.x = this.speed / 2;
                        this.node.setScale(1, 1)
                    }
                }
            } else {
                if (this.petStatus === Constant.CharStatus.RUN) this.petStatus = Constant.CharStatus.IDLE;
                if (this.petStatus === Constant.CharStatus.IDLE) {
                    this.randomMoveTimer += deltaTime;
                    if (this.randomMoveTimer > this.randomMoveTime) {
                        this.randomMoveTimer = 0;
                        lv.x = (Math.random() * 2 - 1) / 10;
                    }
                } else {
                    lv.x = 0;
                }
            }
        }


        this.rb!.linearVelocity = lv;
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if (other.group === Constant.ColliderGroup.ENEMY_ATTACK && self.tag === Constant.ColliderTag.PLAYER) {
            switch(other.tag) {
                case Constant.ColliderTag.ENEMY_ATTACK1:
                    if (this.petStatus !== Constant.CharStatus.DEATH) {
                        this.hurt(10);
                    }
                    break;
                case Constant.ColliderTag.ENEMY_ATTACK2:
                    if (this.petStatus !== Constant.CharStatus.DEATH) {
                        const scaleX = other.node.scale.x;
                        const direction = scaleX > 0 ? 1 : -1;
                        Util.applyKnockback(10, this.rb!, new Vec2(direction,-1));
                        this.hurt(15);
                    }
                    break;
            }
        }
    }

    onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {

    }

    // 获取下一极所需经验
    private _getNextLevelExp(level: number) {
        return (level + 1) * 50;
    }

    // 增加经验
    addExp(exp: number) {
        if (this.hp <= 0) return;

        this.exp += exp;
        this._onEvent && this._onEvent.apply(this._target, [PetCat.Event.ADD_EXP, exp]);

        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level += 1;
            this.maxExp = this._getNextLevelExp(this.level);
            this._onEvent && this._onEvent.apply(this._target, [PetCat.Event.LEVEL_UP, -1]);
        }
    }

    hurt(damage: number) {
        this.hp -= damage;
        if (this.petType === CharData.PetType.Defence) this.hurtedDamage += damage;
        Util.showText(`${damage}`, '#FF1493', this.node.worldPosition, GameContext.ndTextParent);

        if (this.petType !== CharData.PetType.Summon) {
            this._onEvent && this._onEvent.apply(this._target, [PetCat.Event.HURT, damage])
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.petStatus = Constant.CharStatus.DEATH;
        }

        if (this.hp > 0) {
            if (this.petStatus !== Constant.CharStatus.TAKEDAMAGE && 
                this.petStatus !== Constant.CharStatus.ATTACK && this.hurtedDamage < this.hurtedMaxDamage) {
                this.petStatus = Constant.CharStatus.TAKEDAMAGE;
            } else if (this.hurtedDamage >= this.hurtedMaxDamage && this.petStatus !== Constant.CharStatus.ATTACK) {
                this.petStatus = Constant.CharStatus.ATTACK;
                this.hurtedDamage = 0;
            }
        }
    }

    playAttack() {
        this.display.armatureName = 'Attack1';
        this.display.playAnimation('Attack1', 1);
        switch(this.petId) {
            case CharData.PetsId.Pet101:
                this.updateColliderPosition(this.AttackCollider, 8.6);
                this.AttackCollider.enabled = true;
                break;
            case CharData.PetsId.Pet1:
                UseSkill.shootPea(this.ndSkillStart.worldPosition, this.node.scale.x)
                break;
            case CharData.PetsId.Pet2:
                // UseSkill.createSun(this.ndSkillStart.worldPosition);
                break;
            case CharData.PetsId.Pet3:
                this.scheduleOnce(() => {
                    this.AttackCollider.enabled = true;
                }, 0.3)
                break;
            case CharData.PetsId.Pet4:
                // this.updateColliderPosition(this.AttackCollider, 0);
                this.AttackCollider.enabled = true;
                break;
            default:
                break;
        }
        
        const onComplete = () => {
            switch(this.petId) {
                case CharData.PetsId.Pet101:
                    this.AttackCollider.enabled = false;
                    break;
                case CharData.PetsId.Pet2:
                    UseSkill.createSun(this.ndSkillStart.worldPosition);
                    break;
                default:
                    this.AttackCollider.enabled = false;
                    break;
            }

            if (this.hp > 0) this.petStatus = Constant.CharStatus.IDLE;
            this.attackTimer = 0;
            this.display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    playTakedamage() {
        this.display.armatureName = 'TakeDamage';
        this.display.playAnimation('TakeDamage', 1);
        const onComplete = () => {
            this.petStatus = Constant.CharStatus.IDLE;
            this.display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    playDeath() {
        if (!this.display) return;
        this.display.armatureName = 'Death';
        this.display.playAnimation('Death', 1);
        const onComplete = () => {
            if (this.hp <= 0) {
                Globals.putNode(this.node);
            }
            
            this.display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        this.display.on(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    // 更新攻击范围随左右移动的变化
    updateColliderPosition =(collider: Collider2D, offsetX: number, offsetY?: number) => {
        if (offsetY) {
            collider.offset.y = offsetY;
        }
        collider.offset.x = this.node.scale.x * offsetX;
        collider.node.worldPosition = this.node.worldPosition;
    }

    // 恢复HP
    cure (cureValue: number) {
        if (this.hp <= 0) return;
        AudioManager.Instance.playSound('SkillSounds/cure', 0.6);
        this.hp += cureValue;
        Util.showText( `${cureValue}`, '#7FFF00' ,this.node.worldPosition, GameContext.ndTextParent);
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
        this._onEvent && this._onEvent.apply(this._target, [PetCat.Event.HURT, cureValue]);
    }
}


    // Util.rangeMove(deltaTime, this.randomMoveTimer, this.randomMoveTime, lv);
                