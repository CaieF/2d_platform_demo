import { _decorator, Collider2D, Component, dragonBones, math, Node, RigidBody2D } from 'cc';
import { Util } from './Util';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

@ccclass('WaterBlast')
export class WaterBlast extends Component {
    attractionForce: number = 500; // 吸引力
    attractionRange: number = 200; // 吸引力范围
    rotationSpeed: number = 50; // 旋转速度
    speed: number = 5; // 移动速度
    isMoving: boolean = false; // 是否移动
    isMoveLeft: boolean = false; // 是否向左移动
    isAbstract: boolean = false; // 是否吸引
    isRatation: boolean = false; // 是否旋转
    skillType: number = 0; // 技能类型
    private _distance: number = 0; // 距离
    private timer: number = 0; // 计时器
    existTimer: number = 3; // 存在时间
    private _status: number = 0; // 状态
    private display: dragonBones.ArmatureDisplay;

    public set status(status: number) {
        this._status = status;
        switch (status) {
            case WaterBlast.Status.START:
                this.timer = 0;
                this.playStart(this.display)
                break;
            case WaterBlast.Status.INFINITE:
                this.playInfinite(this.display);
                break;
            case WaterBlast.Status.END:
                this.playEnd(this.display);
                break;
        }
    }

    public get status(): number {
        return this._status;
    }

    // 角色事件
    static readonly Status = {
        START: 0, // 开始
        INFINITE: 1, // 运行
        END: 2, // 结束
    }

    protected onEnable(): void {
        // this._distance = 0;
        this.display = this.getComponent(dragonBones.ArmatureDisplay);
        this.status = WaterBlast.Status.START;
        this.timer = 0;
    }

    start() {

    }

    update(deltaTime: number) {
        if (this.isMoving) {
            
            if (this.isMoveLeft) {
                Util.moveNode(this.node, -1, this.speed);
            } else {
                Util.moveNode(this.node, 1, this.speed);
            }
            // this._distance += this.speed;
        }
        if (this.isRatation) { this.ratation(deltaTime); }
        if (this.status === WaterBlast.Status.INFINITE) {
            if (this.isAbstract) { this.attractEnemies(); }
            this.timer += deltaTime;
            if (this.timer > this.existTimer) {
                this.status = WaterBlast.Status.END;
            }

        }

    }

    playStart(display: dragonBones.ArmatureDisplay) {
        display.armatureName = 'Start';
        display.playAnimation('Start', 1);
        const onComplete = () => {
            this.status = WaterBlast.Status.INFINITE;
            display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete,this);
        }
        display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    playInfinite(display: dragonBones.ArmatureDisplay) {
        display.armatureName = 'Infinite';
        display.playAnimation('Infinite', 0);
    }

    playEnd(display: dragonBones.ArmatureDisplay) {
        display.armatureName = 'End';
        display.playAnimation('End', 1);
        const onComplete = () => {
            this.node.destroy();
            display.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
     }

     // 旋转
    private ratation(deltaTime: number) {
        const rotationAmount = this.rotationSpeed * deltaTime;
        const quaternion = new math.Quat(); // 创建一个四元数
        math.Quat.fromEuler(quaternion, 0, 0, rotationAmount); // 创建Z轴旋转的四元数

        // 更新节点的旋转
        const currentRotation = this.node.rotation; // 获取当前旋转
        math.Quat.multiply(currentRotation, currentRotation, quaternion); // 将新的旋转应用到当前旋转
        this.node.rotation = currentRotation; // 更新节点的旋转
    }

    // 吸引附近敌人
    private attractEnemies() {
        const enemies = this.getNearbyEnemyColliders();
        for (const enemy of enemies) {
            this.applyAttraction(enemy);
        }
    }


    // 获取被吸引的敌人的碰撞体
    private getNearbyEnemyColliders(): Collider2D[] {
        const nearbyEnemyColliders = [];
        const nearbyEnemies = Util.getNearbyEnemies(this.node, this.attractionRange); // 获取吸引力范围内的敌人
        for (let enemy of nearbyEnemies) {
            const colliders = enemy.getComponents(Collider2D)// 获取敌人的碰撞体
            for (let collider of colliders) {
                if (collider.tag === Constant.ColliderTag.ENEMY)
                    nearbyEnemyColliders.push(collider);
            }
        }
        return nearbyEnemyColliders;
    }


    private applyAttraction(enemy: Collider2D) {
        const attractionDirection = this.node.worldPosition.clone().subtract(enemy.node.worldPosition).normalize();
        const attractionDirection2D = new math.Vec2(attractionDirection.x, attractionDirection.y);
        enemy.getComponent(RigidBody2D)?.applyForceToCenter(attractionDirection2D.multiplyScalar(this.attractionForce), true);
    }

}


