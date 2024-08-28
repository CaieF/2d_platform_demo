import { _decorator, clamp, Collider2D, Component, Contact2DType, dragonBones, KeyCode, macro, Node, PhysicsSystem2D, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
import { AxInput } from './AxInput';
import { Util } from './Util';
import { Constant } from './Constant';
const axInput = AxInput.instance;

@ccclass('Player')
export class Player extends Component {
    @property(Node) private ndAni: Node;

    private playerStatus: number = 0; // 角色状态
    private _isMoving: boolean = false;
    private speed:number = 0; // 速度
    private jump_speed:number = 0; // 跳跃速度
    private rb: RigidBody2D = null!;
    private _canJump = true; // 能否跳跃

    public get isMoving(): boolean {
        return this._isMoving;
    }

    public set isMoving(value: boolean) {
        this._isMoving = value;
        this._isMoving ? this.playRun() : this.playIdle();
    }

    public get canJump(): boolean {
        return this._canJump;
    }

    public set canJump(value: boolean) {
        this._canJump = value;
        !this._canJump && this.playJump();
    }

    protected onLoad(): void {
        PhysicsSystem2D.instance.gravity = new Vec2(0, -600);
        let collider = this.getComponent(Collider2D);

        collider?.on(Contact2DType.BEGIN_CONTACT, () => {
            this.canJump = true;
        }, this)

    }

    start() {
        this.playerStatus = Constant.PlayerStatus.IDLE;
        this.isMoving = false;
    }

    
    update(deltaTime: number) {
        this.rb = this.getComponent(RigidBody2D);
        this.speed = 12;
        this.jump_speed = 10;
        let lv = this.rb!.linearVelocity;
        let gravity = PhysicsSystem2D.instance.gravity;

        // 按下按钮
        if (axInput.is_action_just_pressed(KeyCode.KEY_A) || axInput.is_action_just_pressed(KeyCode.KEY_D)){
            this.isMoving = true;
        }

        // 水平移动
        if (this.isMoving) {
            if (axInput.is_action_pressed(KeyCode.KEY_A)){
                lv.x -= this.speed * deltaTime;
                this.ndAni.setScale(-1, 1)
            } else if (axInput.is_action_pressed(KeyCode.KEY_D)){
                lv.x += this.speed * deltaTime;
                this.ndAni.setScale(1, 1)
            } else {
                lv = new Vec2(0, lv.y)
                // this.playIdle();
            }
        }
        

        // 松开按钮
        if (axInput.is_action_just_released(KeyCode.KEY_A) || axInput.is_action_just_released(KeyCode.KEY_D)){
            this.isMoving = false;
        }

        // 跳跃
        if ((axInput.is_action_just_pressed(KeyCode.KEY_W) || axInput.is_action_just_pressed(KeyCode.SPACE)) && this.canJump){
            this.canJump = false;
            lv.y = this.jump_speed * -Math.sign(gravity.y);
        }

        this.rb!.linearVelocity = lv;
    }

    // 静止状态
    playIdle() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Idle';
        display.playAnimation('Idle', 0);
    }

    // 移动状态
    playRun() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Run';
        display.playAnimation('Run', 0);
    }

    // 翻滚状态
    playDodge() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Dodge';
        display.playAnimation('Dodge', 1);
    }

    // 跳跃状态
    playJump() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Jump';
        display.playAnimation('Jump', 0);
    }
}


