import { _decorator, Collider, Collider2D, Component, math, Node, RigidBody2D, Vec3 } from 'cc';
import { GameContext } from './GameContext';
import { Constant } from './Constant';
import { Globals } from './Globals';
import { Util } from './Util';
import { Explosion } from './Explosion';
import { UseSkill } from './UseSkill';
const { ccclass, property } = _decorator;

@ccclass('Hole')
export class Hole extends Component {

    rotationSpeed: number = 50; // 旋转速度
    attractionForce: number = 100; // 吸引力
    attractionRange: number = 500; // 吸引力范围
    speed: number = 5; // 移动速度
    isMoving: boolean = false;
    isMoveLeft: boolean = false;
    private timer: number = 0; // 计时器
    private existTimer: number = 3; // 存在时间
    private _distance: number = 0; // 距离

    protected onEnable(): void {
        this._distance = 0;
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
            this._distance += this.speed;
            if (this._distance > 200) {
                // const ndExplode = Globals.getNode(Constant.PrefabUrl.RED_EXPLOSION, GameContext.ndWeaponParent);
                // ndExplode.worldPosition = this.node.worldPosition;
                // ndExplode.getComponent(Explosion).playRedExplosion();
                UseSkill.redExplosion(this.node.worldPosition, 2);
                Globals.putNode(this.node);

            }
        } else {
            this.timer += deltaTime;
            if (this.timer > this.existTimer) {
                this.timer = 0;
                Globals.putNode(this.node); // 移除节点
            }
        }
        
        this.ratation(deltaTime);
        this.attractEnemies();
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

    // 获取吸引力范围的敌人
    private getNearbyEnemies(): Node[] {
        const enemies = GameContext.ndEnemyParents.children; // 获取所有敌人
        return enemies.filter((enemy) => {
            const distance = Vec3.distance(this.node.worldPosition, enemy.worldPosition); // 计算距离
            return distance < this.attractionRange; // 检查是否在吸引力范围内
        });
    }

    // 获取被吸引的敌人的碰撞体
    private getNearbyEnemyColliders(): Collider2D[] {
        const nearbyEnemyColliders = [];
        const nearbyEnemies = this.getNearbyEnemies(); // 获取吸引力范围内的敌人
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


