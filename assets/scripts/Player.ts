import { _decorator, clamp, Collider2D, Component, Contact2DType, dragonBones, IPhysics2DContact, KeyCode, macro, Node, PhysicsSystem2D, RigidBody2D, tween, UIStaticBatch, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { AxInput } from './AxInput';
import { Util } from './Util';
import { Constant } from './Constant';
import { playIdle, playJump, playRun } from './PlayAnimation';
import { GameContext } from './GameContext';
import { CharData } from './CharData';
import { UseSkill } from './UseSkill';
import { AudioManager } from './AudioManager';
import { Globals } from './Globals';
import { Item } from './Item';
import { StorageManager } from './StorageManager';
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
    private isSummon: boolean = false; // 是否召唤
    private SummonId: number = -1; // 召唤角色id
    
    public get playerId(): number {
        return this._playerId;
    }

    public set playerId(value: number) {
        this._playerId = value;
    }


    hp: number = 100; // 血量
    maxHp: number = 100; // 最大血量
    speed: number = 12; // 移动速度
    jump_speed:number = 10; // 跳跃速度
    level: number = 1; // 等级
    exp: number = 0; // 经验值
    maxExp: number = 100; // 最大经验值

    setValue (hp: number, maxHp: number, speed: number, jump_speed: number, level: number, isSummon=false, SummonId?: number) {
        this.level = level;
        this.hp = hp + (level - 1) * 5;
        this.maxHp = maxHp + (level - 1) * 5;
        this.speed = speed;
        this.jump_speed = jump_speed;
        this.exp = GameContext.playerLevel[this.playerId].exp;
        this.maxExp = this._getNextLevelExp(this.level);
        this.isSummon = isSummon;
        if (SummonId) this.SummonId = SummonId;
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
        const defaultPlayerId = CharData.PlayersId.Player1;
        const selectedPlayerId = GameContext.selectedPlayerId;

        const playerConfigData = CharData.playerConfig[selectedPlayerId] || CharData.playerConfig[defaultPlayerId];
        this._attack1Offset = playerConfigData.atk1Offset!;
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
        if (this.isSummon) this.playerStatus = Constant.CharStatus.SKILL0;
        else this.playerStatus = Constant.CharStatus.IDLE;
        
    }

    protected onDisable(): void {
        if (this.HitCollider) {
            this.HitCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.HitCollider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {
        this.playerStatus = Constant.CharStatus.IDLE;
        if (this.isSummon) {
            this.playerStatus = Constant.CharStatus.SKILL0;
        }
    }

    
    update(deltaTime: number) {
        const x = clamp(this.node.position.x, -180, 1330); // 限制角色移动范围
        this.node.setPosition(x, this.node.position.y, 0);
        if (this.playerStatus == Constant.CharStatus.TAKEDAMAGE) return;
        if (this.playerStatus == Constant.CharStatus.ATTACK) return;
        if (this.playerStatus == Constant.CharStatus.SKILL0) return;
        if (this.playerStatus == Constant.CharStatus.SKILL1) return;
        if (this.isSummon) return;
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
        if (this.playerStatus == Constant.CharStatus.DODGE && this.playerId !== CharData.PlayersId.Player5) {
            if (this.ndAni.scale.x < 0) lv.x = -this.speed;
            else lv.x = this.speed;
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

    onComplete() {
        this.display.removeEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
        if (this.hp <=0) return;
        this.unschedule(this.callback);
        this.playerStatus = Constant.CharStatus.IDLE;
    }

    // 攻击状态
    playAttack() {
        this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        this.display.armatureName = 'Attack1';
        this.display.playAnimation('Attack1', 1);

        switch (this._playerId) {
            case CharData.PlayersId.Player3:
                UseSkill.shootArrow(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                break;
            case CharData.PlayersId.Player4:
                UseSkill.shootFireBall(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                break;
            case CharData.PlayersId.Player5:
                AudioManager.Instance.playSound('SkillSounds/sword1', 0.4)
                this.updateColliderPosition(this.attack1Collider, this._attack1Offset);
                    Util.checkCollider(this.attack1Collider, true);
                break;
            default:
                this.callback = this.scheduleOnce(() => {
                    AudioManager.Instance.playSound('SkillSounds/sword1', 0.4)
                    this.updateColliderPosition(this.attack1Collider, this._attack1Offset);
                    Util.checkCollider(this.attack1Collider, true);
                }, 0.3)
                this.scheduleOnce(() => {
                    Util.checkCollider(this.attack1Collider, false);
                }, 0.5)
                break;
        }

        this.display.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }

    // 释放技能0
    playSkill0() {
        this.display.armatureName = 'Attack2';
        this.display.playAnimation('Attack2', 1);
        if (this._playerId === CharData.PlayersId.Player5 && !this.isSummon) {
            UseSkill.shootWaterBall(this.ndSkillStart.worldPosition, this.ndAni.scale.x)
        }
        
        if (this._playerId === CharData.PlayersId.Player4 || this.SummonId === (CharData.PlayersId.Player4 + 1)) {
            AudioManager.Instance.playSound('SkillSounds/fire', 0.6);
            this.callback = this.scheduleOnce(() => {
                this.updateColliderPosition(this.attack1Collider, this._attack1Offset);
                Util.checkCollider(this.attack1Collider, true);
            }, 0.25)
        }
        const onComplete = () => {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
            const skillMap = {
                [CharData.PlayersId.Player1]: UseSkill.shootSwordQi,
                [CharData.PlayersId.Player2]: UseSkill.throwStone,
                [CharData.PlayersId.Player3]: UseSkill.shootElectorArrow,
            }

            const invokeSkill = (playerId: number, scale: number) => {
                const skillFunc = skillMap[playerId];
                if (playerId === CharData.PlayersId.Player4) {
                    Util.checkCollider(this.attack1Collider, false)
                } else if(playerId === CharData.PlayersId.Player5) {
                    return;
                } else skillFunc(this.ndSkillStart.worldPosition, scale);
            }

            if (this.isSummon && this.SummonId !== -1) {
                invokeSkill(this.SummonId - 1, this.node.scale.x);
            } else invokeSkill(this._playerId, this.ndAni.scale.x);

            if (this.isSummon) this.node.destroy();
            else this.playerStatus = Constant.CharStatus.IDLE;
        };
        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    // 释放技能1
    playSkill1() {
        this.display.armatureName = 'Attack3';
        this.display.playAnimation('Attack3', 1);
        switch(this._playerId) {
            case CharData.PlayersId.Player3:
                UseSkill.shootThunderSplash(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                break;
            case CharData.PlayersId.Player4:
                AudioManager.Instance.playSound('SkillSounds/cure', 0.6);
                this.cure(5)
                break;
            default:
                break;
        }

        const onComplete = () => {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
            if (this.hp <=0) return;
            switch(this._playerId) {
                case CharData.PlayersId.Player1:
                    UseSkill.shootSwordGroup(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
                    break;
                case CharData.PlayersId.Player2:
                    UseSkill.shootHole(this.ndSkillStart.worldPosition);
                    break;
                case CharData.PlayersId.Player5:
                    UseSkill.shootWaterBlast(new Vec3(this.ndSkillStart.worldPosition.x, this.ndSkillStart.worldPosition.y + 40, this.ndSkillStart.worldPosition.z), this.ndAni.scale.x);
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
        if (this._playerId === CharData.PlayersId.Player5) {
            UseSkill.summonCat(this.ndSkillStart.worldPosition);
        } else {
            AudioManager.Instance.playSound('SkillSounds/explosion', 1);
            this.node.setPosition(this.node.position.x, this.node.position.y + 20);
            this.scheduleOnce(() => {
                Util.checkCollider(this.attack2Collider, true);
            }, 0.3)
            this.scheduleOnce(() => {
                Util.checkCollider(this.attack2Collider, false);
            }, 0.5)
        }

        this.display.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }

    // 翻滚状态
    playDodge() {
        this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        this.display.armatureName = 'Dodge';
        this.display.playAnimation('Dodge', 1);
        AudioManager.Instance.playSound('SkillSounds/roll')
        if (this._playerId === CharData.PlayersId.Player5) {
            UseSkill.summonPlayer(this.ndSkillStart.worldPosition, this.ndAni.scale.x);
        }

        this.display.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }

    // 受击状态
    playTakedamage() {
        if (this.playerId === CharData.PlayersId.Player5) {
            AudioManager.Instance.playSound('CharSounds/grilHit')
        } else {
            AudioManager.Instance.playSound('sounds/hit', 1);
        }
                
        this.display.armatureName = 'TakeDamage';
        this.display.playAnimation('TakeDamage', 1);

        this.display.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }

    // 死亡状态
    playDeath() {
        if (this.playerId === CharData.PlayersId.Player5) {
            AudioManager.Instance.playSound('CharSounds/grilDeath')
        } else {
            AudioManager.Instance.playSound('sounds/death', 0.8);
        }
        // AudioManager.Instance.playSound('sounds/death', 0.8);
        this.display.armatureName = 'Death';
        this.display.playAnimation('Death', 1); 

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
                        this.hurt(10);
                    }
                    break;
                case Constant.ColliderTag.ENEMY_ATTACK2:
                    if (this.playerStatus !== Constant.CharStatus.DEATH && this.playerStatus !== Constant.CharStatus.DODGE) {
                        const scaleX = other.node.scale.x; // 获取怪物缩放的X值
                        const direction = scaleX > 0 ? 1 : -1; // 击退方向
                        Util.applyKnockback(10000, this.rb!, new Vec2(direction, -1));
                        this.hurt(10);
                    }
                    break;
                default:
                    break;
            }
         } else if (other.group === Constant.ColliderGroup.ITEM && self.tag == Constant.ColliderTag.PLAYER) {
            switch(other.tag) {
                case Constant.ColliderTag.ITEM_CURE:
                    AudioManager.Instance.playSound('SkillSounds/cure', 0.6);
                    this.cure(5);
                    other.node.getComponent(Item).isUsed = true;
                    break;
                case Constant.ColliderTag.ITEM_COIN:
                    AudioManager.Instance.playSound('ItemSounds/eatCoin', 0.9);
                    Util.changeMoney(10);
                    other.node.getComponent(Item).isUsed = true;
                    break;
                default:
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
        GameContext.playerLevel[this.playerId].exp = this.exp;
        this._onEvent && this._onEvent.apply(this._target, [Player.Event.ADD_EXP, exp]);

        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level += 1;
            GameContext.playerLevel[this.playerId].exp = this.exp;
            GameContext.playerLevel[this.playerId].level = this.level;
            this.maxHp += 5;
            this.hp = this.maxHp;
            this.maxExp = this._getNextLevelExp(this.level);
            this._onEvent && this._onEvent.apply(this._target, [Player.Event.LEVEL_UP, -1]);
        }
        StorageManager.save('playerLevel', GameContext.playerLevel);
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
        if (this.hp <= 0) return;
        this.hp += cureValue;
        Util.showText( `${cureValue}`, '#7FFF00' ,this.node.worldPosition, GameContext.ndTextParent);
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
        this._onEvent && this._onEvent.apply(this._target, [Player.Event.HURT, cureValue]);
    }

}


