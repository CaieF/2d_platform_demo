import { _decorator, clamp, Collider2D, Component, Contact2DType, dragonBones, IPhysics2DContact, KeyCode, macro, Node, PhysicsSystem2D, RigidBody2D, tween, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
import { AxInput } from './AxInput';
import { Util } from './Util';
import { Constant } from './Constant';
import { playIdle, playJump, playRun, playTakedamage } from './PlayAnimation';
const axInput = AxInput.instance;

@ccclass('Player')
export class Player extends Component {
    @property(Node) private ndAni: Node;

    // private beforeStatus: number = 0; // 之前角色状态
    private _playerStatus: number = 0; // 角色状态
    private speed: number = 0; // 移动速度
    private jump_speed:number = 0; // 跳跃速度
    private rb: RigidBody2D = null!;
    private HitCollider: Collider2D = null!; // 受击范围
    private attack1Range: Collider2D; // 攻击范围
    private display: dragonBones.ArmatureDisplay;

    public get playerStatus(): number {
        return this._playerStatus;
    }

    public set playerStatus(value: number) {
        this._playerStatus = value;
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
                playTakedamage(this.display, this.attack1Range);
                break;
            default:
                break;
            }
    }


    protected onLoad(): void {
        if (this.ndAni) {
            this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        }
        PhysicsSystem2D.instance.gravity = new Vec2(0, -600);
        let colliders = this.getComponents(Collider2D);
        
        for (let collider of colliders) {
            if (collider.tag == Constant.ColliderTag.PLAYER) {
                this.HitCollider = collider;
            } else if (collider.tag == Constant.ColliderTag.PLAYER_ATTACK1) {
                this.attack1Range = collider;
            }
        }
    }

    protected onEnable(): void {
        if (this.HitCollider) {
            this.HitCollider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.HitCollider?.on(Contact2DType.END_CONTACT, this.onEndContact, this);
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
        this.rb = this.getComponent(RigidBody2D);
        this.speed = 12;
        this.jump_speed = 10;
        let lv = this.rb!.linearVelocity;
        let gravity = PhysicsSystem2D.instance.gravity;

        // 按下按钮
        if (axInput.is_action_just_pressed(KeyCode.KEY_A) || axInput.is_action_just_pressed(KeyCode.KEY_D)){
            if (this.playerStatus == Constant.CharStatus.IDLE) {
                this.playerStatus = Constant.CharStatus.RUN;
            }
        }

        // 水平移动
        if (this.playerStatus == Constant.CharStatus.RUN || this.playerStatus == Constant.CharStatus.JUMP) {
            if (axInput.is_action_pressed(KeyCode.KEY_A)){
                lv.x -= this.speed * deltaTime;
                this.ndAni.setScale(-1, 1)
            } else if (axInput.is_action_pressed(KeyCode.KEY_D)){
                lv.x += this.speed * deltaTime;
                this.ndAni.setScale(1, 1)
            } 
        }
        

        // 松开移动按钮
        if (axInput.is_action_just_released(KeyCode.KEY_A) || axInput.is_action_just_released(KeyCode.KEY_D)){
            if (this.playerStatus == Constant.CharStatus.RUN) this.playerStatus = Constant.CharStatus.IDLE;
            lv.x = 0;
        }

        // 跳跃
        if ((axInput.is_action_just_pressed(KeyCode.KEY_W) || axInput.is_action_just_pressed(KeyCode.KEY_K)) && (this.playerStatus != Constant.CharStatus.JUMP && this.playerStatus != Constant.CharStatus.ATTACK)){
            this.playerStatus = Constant.CharStatus.JUMP;
            lv.y = this.jump_speed * -Math.sign(gravity.y);
        }

        this.rb!.linearVelocity = lv;

        // 按下攻击键
        if (axInput.is_action_just_pressed(KeyCode.KEY_J) && this.playerStatus != Constant.CharStatus.ATTACK && this.playerStatus != Constant.CharStatus.TAKEDAMAGE){
            this.playerStatus = Constant.CharStatus.ATTACK;
        }
    }

    // 攻击状态
    playAttack() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Attack1';
        display.playAnimation('Attack1', 1);

        const callback = this.scheduleOnce(() => {
            this.updateColliderPosition(this.attack1Range, 14);
            this.attack1Range.enabled = true;
        }, 0.3)
        

        display.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            this.playerStatus = Constant.CharStatus.IDLE;
            this.attack1Range.enabled = false;
            this.unschedule(callback);
        }, this);

        
    }

    updateColliderPosition =(collider: Collider2D, offset: number) => {
        collider.offset.x = this.ndAni.scale.x * offset;
        collider.node.worldPosition = this.node.worldPosition;
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if (self && other) {
            if (other.group === Constant.ColliderGroup.WALL && self.tag == Constant.ColliderTag.PLAYER) {
                if (this.playerStatus == Constant.CharStatus.JUMP) {
                    if (axInput.is_action_pressed(KeyCode.KEY_A) || axInput.is_action_pressed(KeyCode.KEY_D)) {
                        this.playerStatus = Constant.CharStatus.RUN;
                    } else {
                        this.playerStatus = Constant.CharStatus.IDLE;
                    }
                }
            } else if (other.group === Constant.ColliderGroup.ENEMY && self.tag == Constant.ColliderTag.PLAYER) {
                switch(other.tag) {
                    case Constant.ColliderTag.ENEMY_ATTACK1:
                        if (this.playerStatus !== Constant.CharStatus.DEATH) {
                            this.playerStatus = Constant.CharStatus.TAKEDAMAGE;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        
    }

    onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        if (other.group === Constant.ColliderGroup.ENEMY && self.tag == Constant.ColliderTag.PLAYER) {
            switch(other.tag) {
                case Constant.ColliderTag.ENEMY_ATTACK1:
                    if (this.playerStatus == Constant.CharStatus.TAKEDAMAGE) {
                        this.playerStatus = Constant.CharStatus.IDLE;
                    }
                    break;
                default:
                    break
            }
        }
    }
}


