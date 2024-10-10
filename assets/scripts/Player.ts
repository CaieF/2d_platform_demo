import { _decorator, clamp, Collider2D, Component, Contact2DType, dragonBones, IPhysics2DContact, KeyCode, macro, Node, PhysicsSystem2D, RigidBody2D, tween, UIStaticBatch, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { AxInput } from './AxInput';
import { Util } from './Util';
import { Constant } from './Constant';
import { playIdle, playJump, playRun } from './PlayAnimation';
import { GameContext } from './GameContext';
import { CharData } from './CharData';
import { UseSkill } from './UseSkill';
const axInput = AxInput.instance;

@ccclass('Player')
export class Player extends Component {
    @property(Node) private ndAni: Node;
    @property(Node) private ndSkillStart: Node;
    private beforeStatus: number = 0; // 之前角色状态
    private _playerId: number = 0; // 角色id
    private _attack1Offset: number = 0; // 攻击1偏移量
    private _playerStatus: number = 0; // 角色状态
    private rb: RigidBody2D = null!;
    private HitCollider: Collider2D = null!; // 受击范围
    private PlayerFooterCollider: Collider2D; // 角色脚下碰撞
    private attack1Collider: Collider2D; // 普通攻击范围
    private attack2Collider: Collider2D; // 击退效果攻击的范围
    private display: dragonBones.ArmatureDisplay;
    private callback: void;
    private randomMoveTimer: number = 0; // 随机移动计时器
    private randomMoveTime: number = 0.2; // 随机移动时间
    

    hp: number = 100; // 血量
    maxHp: number = 100; // 最大血量
    speed: number = 12; // 移动速度
    jump_speed:number = 10; // 跳跃速度
    level: number = 1; // 等级
    exp: number = 0; // 经验值
    maxExp: number = 100; // 最大经验值

    setValue (hp: number, maxHp: number, speed: number, jump_speed: number) {
        this.hp = hp;
        this.maxHp = maxHp;
        this.speed = speed;
        this.jump_speed = jump_speed;
    }

    private _onEvent: Function;
    private _target: any;

    // 角色事件
    static readonly Event = {
        HURT: 0, // 受伤
        DEATH: 1, // 死亡
        ADD_EXP: 2, // 增加经验
        LEVEL_UP: 3, // 升级
    }

    public get playerStatus(): number {
        return this._playerStatus;
    }

    public set playerStatus(value: number) {
        this.beforeStatus = this.playerStatus;
        this._playerStatus = value;
        
        this.unschedule(this.callback)
        Util.checkCollider(this.attack1Collider);
        Util.checkCollider(this.attack2Collider);
        switch (value) {
            case Constant.CharStatus.IDLE:
                playIdle(this.display);
                break;
            case Constant.CharStatus.RUN:
                playRun(this.display);
                break;
            case Constant.CharStatus.JUMP:
                playJump(this.display);
                break;
            case Constant.CharStatus.ATTACK:
                this.playAttack();
                break;
            case Constant.CharStatus.TAKEDAMAGE:
                this.playTakedamage();
                break;
            case Constant.CharStatus.SKILL0:
                this.playSkill0();
                break;
            case Constant.CharStatus.SKILL1:
                this.playSkill1();
                break;
            case Constant.CharStatus.SKILL2:
                this.playSkill2();
                break;
            case Constant.CharStatus.DODGE:
                this.playDodge();
                break;
            case Constant.CharStatus.DEATH:
                this.playDeath();
                break;
            default:
                break;
            }
    }


    protected onLoad(): void {
        this._playerId = GameContext.selectedPlayerId;
        // 加载攻击范围
        switch(this._playerId) {
            case CharData.Player1.playerId:
                this._attack1Offset = CharData.Player1.atk1Offset;
                break;
            case CharData.Player2.playerId:
                this._attack1Offset = CharData.Player2.atk1Offset;
                break;
            case CharData.Player4.playerId:
                this._attack1Offset = CharData.Player4.atk1Offset;
                break;
            default:
                this._attack1Offset = CharData.Player1.atk1Offset;
                break;
        }
        if (this.ndAni) {
            this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        }
        PhysicsSystem2D.instance.gravity = new Vec2(0, -600);
    }

    protected onEnable(): void {
        let colliders = this.getComponents(Collider2D);
        
        for (let collider of colliders) {
            if (collider.tag == Constant.ColliderTag.PLAYER) {
                this.HitCollider = collider;
            } else if (collider.tag == Constant.ColliderTag.PLAYER_ATTACK1) {
                this.attack1Collider = collider;
            } else if (collider.tag == Constant.ColliderTag.PLATER_FOOTER) {
                this.PlayerFooterCollider = collider;
            } else if (collider.tag == Constant.ColliderTag.PLAYER_ATTACK2) {
                this.attack2Collider = collider;
            }
        }
        if (this.HitCollider) {
            this.HitCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.HitCollider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        if (this.PlayerFooterCollider) {
            this.PlayerFooterCollider.on(Contact2DType.BEGIN_CONTACT, (self: Collider2D, other: Collider2D, contact: IPhysics2DContact) => {
                if (other.group === Constant.ColliderGroup.WALL && self.tag == Constant.ColliderTag.PLATER_FOOTER) {
                    if (this.playerStatus == Constant.CharStatus.JUMP) {
                        if (axInput.is_action_pressed(KeyCode.KEY_A) || axInput.is_action_pressed(KeyCode.KEY_D)) {
                            this.playerStatus = Constant.CharStatus.RUN;
                        } else {
                            this.playerStatus = Constant.CharStatus.IDLE;
                        }
                    }
                }
            }, this);
        }
    }

    protected onDisable(): void {
        if (this.HitCollider) {
            this.HitCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.HitCollider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {
        this.playerStatus = Constant.CharStatus.IDLE;
    }

    
    update(deltaTime: number) {
        const x = clamp(this.node.position.x, -180, 1330); // 限制角色移动范围
        this.node.setPosition(x, this.node.position.y, 0);
        if (this.playerStatus == Constant.CharStatus.TAKEDAMAGE) return;
        if (this.playerStatus == Constant.CharStatus.ATTACK) return;
        if (this.playerStatus == Constant.CharStatus.SKILL0) return;
        if (this.playerStatus == Constant.CharStatus.SKILL1) return;
        if (this.hp <= 0) return;


        this.rb = this.getComponent(RigidBody2D);
        let lv = this.rb!.linearVelocity;
        let gravity = PhysicsSystem2D.instance.gravity;

        // 随机移动
        if (this.playerStatus == Constant.CharStatus.IDLE || this.playerStatus == Constant.CharStatus.ATTACK) {
            this.randomMoveTimer += deltaTime;
            if (this.randomMoveTimer > this.randomMoveTime) {
                this.randomMoveTimer = 0;
                lv.x = (Math.random() * 2 - 1) / 10 ;
            }
        }

        // 翻滚
        if (this.playerStatus == Constant.CharStatus.DODGE) {
            if (this.ndAni.scale.x < 0) lv.x -= this.speed * deltaTime;
            else lv.x += this.speed * deltaTime;
        }

        // 按下按钮
        if (axInput.is_action_just_pressed(KeyCode.KEY_A) || axInput.is_action_just_pressed(KeyCode.KEY_D) || axInput.is_action_pressed(KeyCode.KEY_A) || axInput.is_action_pressed(KeyCode.KEY_D)){
            if (this.playerStatus == Constant.CharStatus.IDLE) {
                this.playerStatus = Constant.CharStatus.RUN;
            }
        }

        // 水平移动
        if (this.playerStatus == Constant.CharStatus.RUN || this.playerStatus == Constant.CharStatus.JUMP) {
            if (this.playerStatus == Constant.CharStatus.IDLE) {
                this.playerStatus = Constant.CharStatus.RUN;
            }
            if (axInput.is_action_pressed(KeyCode.KEY_A)){
                lv.x = -this.speed / 2;
                this.ndAni.setScale(-1, 1)
            } else if (axInput.is_action_pressed(KeyCode.KEY_D)){
                lv.x = this.speed / 2;
                this.ndAni.setScale(1, 1)
            } 
        }
        

        // 松开移动按钮
        if (axInput.is_action_just_released(KeyCode.KEY_A) || axInput.is_action_just_released(KeyCode.KEY_D)){
            if (this.playerStatus == Constant.CharStatus.RUN) this.playerStatus = Constant.CharStatus.IDLE;
            lv.x = 0;
        }

        // 跳跃
        if ((axInput.is_action_just_pressed(KeyCode.KEY_W) || axInput.is_action_just_pressed(KeyCode.KEY_K)) && (this.playerStatus != Constant.CharStatus.JUMP)){
            this.playerStatus = Constant.CharStatus.JUMP;
            lv.y = this.jump_speed * -Math.sign(gravity.y);
        }

        this.rb!.linearVelocity = lv;

        // 按下攻击键
        if (axInput.is_action_just_pressed(KeyCode.KEY_J)){
            this.playerStatus = Constant.CharStatus.ATTACK;
        }
    }

    // 注册角色事件
    onPlayerEvent(onEvent: Function, target?: any) {
        this._onEvent = onEvent;
        this._target = target;
    }

    // 攻击状态
    playAttack() {
        this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        this.display.armatureName = 'Attack1';
        this.display.playAnimation('Attack1', 1);

        switch (this._playerId) {
            case CharData.Player3.playerId:
                UseSkill.shootArrow(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                break;
            case CharData.Player4.playerId:
                UseSkill.shootFireBall(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                break;
            case CharData.Player5.playerId:
                this.updateColliderPosition(this.attack1Collider, this._attack1Offset);
                    Util.checkCollider(this.attack1Collider, true);
                break;
            default:
                this.callback = this.scheduleOnce(() => {
                    this.updateColliderPosition(this.attack1Collider, this._attack1Offset);
                    Util.checkCollider(this.attack1Collider, true);
                }, 0.3)
                this.scheduleOnce(() => {
                    Util.checkCollider(this.attack1Collider, false);
                }, 0.5)
                break;
        }

        
        const onComplete = () => {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
            this.unschedule(this.callback);
            this.playerStatus = Constant.CharStatus.IDLE;
        };
        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    // 释放技能0
    playSkill0() {
        this.display.armatureName = 'Attack2';
        this.display.playAnimation('Attack2', 1);
        
        if (this._playerId === CharData.Player4.playerId) {
            this.callback = this.scheduleOnce(() => {
                this.updateColliderPosition(this.attack1Collider, this._attack1Offset);
                Util.checkCollider(this.attack1Collider, true);
            }, 0.25)
        }
        const onComplete = () => {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
            switch(this._playerId) {
                case CharData.Player1.playerId:
                    UseSkill.shootSwordQi(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                    break;
                case CharData.Player2.playerId:
                    UseSkill.throwStone(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                    break;
                case CharData.Player3.playerId:
                    UseSkill.shootElectorArrow(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                    break;
                case CharData.Player4.playerId:
                    Util.checkCollider(this.attack1Collider, false);
                    break;
                default:
                    break;
            }
            this.playerStatus = Constant.CharStatus.IDLE;
        };
        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    // 释放技能1
    playSkill1() {
        this.display.armatureName = 'Attack3';
        this.display.playAnimation('Attack3', 1);
        switch(this._playerId) {
            case CharData.Player3.playerId:
                UseSkill.shootThunderSplash(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                break;
            case CharData.Player4.playerId:
                this.cure(5)
            default:
                break;
        }

        const onComplete = () => {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
            switch(this._playerId) {
                case CharData.Player1.playerId:
                    UseSkill.shootSwordGroup(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                    break;
                case CharData.Player2.playerId:
                    UseSkill.shootHole(this.ndSkillStart.worldPosition);
                    break;
                case CharData.Player3.playerId:
                    // UseSkill.shootThunderSplash(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                    break;
                default:
                    break;
            }
            this.playerStatus = Constant.CharStatus.IDLE;
        }

        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    // 释放技能2
    playSkill2() {
        this.display.armatureName = 'Attack4';
        this.display.playAnimation('Attack4', 1);
        this.node.setPosition(this.node.position.x, this.node.position.y + 20);
        this.scheduleOnce(() => {
            Util.checkCollider(this.attack2Collider, true);
        }, 0.3)
        this.scheduleOnce(() => {
            Util.checkCollider(this.attack2Collider, false);
        }, 0.5)
        const onComplete = () => {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
            this.playerStatus = Constant.CharStatus.IDLE;
        }

        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    // 翻滚状态
    playDodge() {
        this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        this.display.armatureName = 'Dodge';
        this.display.playAnimation('Dodge', 1);
        const onComplete = () => {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
            this.playerStatus = Constant.CharStatus.IDLE;
        }

        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }


    // 受击状态
    playTakedamage() {
        // this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        this.display.armatureName = 'TakeDamage';
        this.display.playAnimation('TakeDamage', 1);


        const onComplete = () => {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
            this.playerStatus = Constant.CharStatus.IDLE;
        };
        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    // 死亡状态
    playDeath() {
        this.display.armatureName = 'Death';
        this.display.playAnimation('Death', 1);
        console.log(this.display);
        

        const onComplete = () => {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
            this._onEvent && this._onEvent.apply(this._target, [Player.Event.DEATH, 0]);
        }
        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    updateColliderPosition =(collider: Collider2D, offset: number) => {
        collider.offset.x = this.ndAni.scale.x * offset;
        collider.node.worldPosition = this.node.worldPosition;
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        
        if (other.group === Constant.ColliderGroup.ENEMY_ATTACK && self.tag == Constant.ColliderTag.PLAYER) {
            switch(other.tag) {
                case Constant.ColliderTag.ENEMY_ATTACK1:
                    if (this.playerStatus !== Constant.CharStatus.DEATH && this.playerStatus !== Constant.CharStatus.DODGE) {
                        this.hurt(1);
                        // Util.moveNode(this.node, 1, 0.0001);
                    }
                    break;
                default:
                    break;
            }
         }
    }

    onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if (other.group === Constant.ColliderGroup.ENEMY && self.tag == Constant.ColliderTag.PLAYER) {
            switch(other.tag) {
                case Constant.ColliderTag.ENEMY_ATTACK1:
                    this.playerStatus = Constant.CharStatus.IDLE;
                    break;
                default:
                    break
            }
        }
    }

    // 获取下一极所需经验
    private _getNextLevelExp(level: number) {
        return (level + 1) * 50;
    }

    // 增加经验
    addExp(exp: number) {
        this.exp += exp;
        this._onEvent && this._onEvent.apply(this._target, [Player.Event.ADD_EXP, exp]);

        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level += 1;
            this.maxExp = this._getNextLevelExp(this.level);
            this._onEvent && this._onEvent.apply(this._target, [Player.Event.LEVEL_UP, -1]);
        }
    }

    

    // 受伤
    hurt (damage: number) {
        this.hp -= damage;
        
        
        Util.showText( `${damage}`, '#DC143C' ,this.node.worldPosition, GameContext.ndTextParent);

        if (this.hp <= 0) {
            this.hp = 0;
            this._onEvent && this._onEvent.apply(this._target, [Player.Event.HURT, damage]);
            this.playerStatus = Constant.CharStatus.DEATH;
        }


        if (this.hp > 0) {
            this._onEvent && this._onEvent.apply(this._target, [Player.Event.HURT, damage]);
            if ( this.playerStatus !== Constant.CharStatus.ATTACK && 
                this.playerStatus !== Constant.CharStatus.TAKEDAMAGE && 
                this.playerStatus !== Constant.CharStatus.SKILL0 && 
                this.playerStatus !== Constant.CharStatus.SKILL1 && 
                this.playerStatus !== Constant.CharStatus.SKILL2) {
                this.playerStatus = Constant.CharStatus.TAKEDAMAGE;
            } 
            // console.log(`HP: ${this.hp}, Status: ${this.playerStatus}`);
        } 
    }

    // 恢复HP
    cure (cureValue: number) {
        this.hp += cureValue;
        Util.showText( `${cureValue}`, '#7FFF00' ,this.node.worldPosition, GameContext.ndTextParent);
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
        this._onEvent && this._onEvent.apply(this._target, [Player.Event.HURT, cureValue]);
    }

}


