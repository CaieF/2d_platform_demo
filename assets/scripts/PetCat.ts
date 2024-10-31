import { _decorator, Collider2D, Component,Contact2DType, IPhysics2DContact, dragonBones, Node, NodePool, RigidBody2D, Vec2 } from 'cc';
import { Util } from './Util';
import { Constant } from './Constant';
import { playIdle, playRun } from './PlayAnimation';
import { GameContext } from './GameContext';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('PetCat')
export class PetCat extends Component {
    @property(Node) private ndAni: Node;

    private _petStatus: number = 0; // 宠物状态
    private display: dragonBones.ArmatureDisplay; // 骨骼动画
    private rb: RigidBody2D = null!; // 刚体
    private HitCollider: Collider2D = null!; // 受击范围
    private AttackCollider: Collider2D = null!; // 攻击范围
    private randomMoveTimer: number = 0; // 随机移动计时器
    private randomMoveTime: number = 0.5; // 随机移动时间
    private attackTimer: number = 0; // 攻击计时器
    private attackTime: number = 0.35; // 攻击时间
    
    speed: number = 7;
    hp:number = 10;
    fllowDistance: number = 100; // 跟随距离
    // chaseDistance:number = 100; // 追击距离
    attackRange: number = 30; // 攻击距离
    HitColliderOffsetX: number = 0;

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
        this,this.randomMoveTimer = 0;
        this.hp = 10;
        this.display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        this.petStatus = Constant.CharStatus.IDLE;
        const colliders = this.node.getComponents(Collider2D);
        
        for (let collider of colliders) {
            
            if (collider.tag === Constant.ColliderTag.PLAYER) {
                this.HitCollider = collider;
            } else if (collider.tag === Constant.ColliderTag.PLAYER_ATTACK1) {
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
        const playerPosition = Util.getPlayerPosition(); // 玩家位置
        const distanceToPlayer = Vec2.distance(playerPosition, this.node.worldPosition);

        // console.log(Util.getNearbyEnemies(GameContext.ndPlayer, 100));


        this.randomMoveTimer += deltaTime;
        this.attackTimer += deltaTime;
        if (this.randomMoveTimer > this.randomMoveTime) {
            this.randomMoveTimer = 0;
            lv.x = (Math.random() * 2 - 1) / 10;
        }

        // 获取玩家一定范围内的最近敌人
        let chaseEnemy: Node = Util.getClosestEnemy(this.node, 500)
        // 敌人存在追击敌人
        if (chaseEnemy && this.attackTimer >= this.attackTime) {
            // console.log(chaseEnemy);
            const enemyPosition = chaseEnemy.worldPosition;
            const distanceToEnemy = Vec2.distance(this.node.worldPosition, enemyPosition)
            // if (distanceToEnemy < this.chaseDistance) {
            if (this.petStatus === Constant.CharStatus.IDLE) {
                this.petStatus = Constant.CharStatus.RUN;
            }
            // }

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
                this.petStatus = Constant.CharStatus.ATTACK;
                lv.x = 0;
            }
        } else {
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

    hurt(damage: number) {
        this.hp -= damage;
        Util.showText(`${damage}`, '#FF1493', this.node.worldPosition, GameContext.ndTextParent);
        if (this.hp <= 0) {
            this.hp = 0;
            this.petStatus = Constant.CharStatus.DEATH;
        }

        if (this.hp > 0) {
            if (this.petStatus !== Constant.CharStatus.TAKEDAMAGE && 
                this.petStatus !== Constant.CharStatus.ATTACK) {
                this.petStatus = Constant.CharStatus.TAKEDAMAGE;
            }
        }
    }

    playAttack() {
        this.display.armatureName = 'Attack1';
        this.display.playAnimation('Attack1', 1);
        this.updateColliderPosition(this.AttackCollider, 8.6);
        this.AttackCollider.enabled = true;

        const onComplete = () => {
            if (this.hp > 0) this.petStatus = Constant.CharStatus.IDLE;
            this.attackTimer = 0;
            this.display.off(dragonBones.EventObject.COMPLETE, onComplete, this);
        }
        this.display.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
    }

    playTakedamage() {
        this.display.armatureName = 'Takedamage';
        this.display.playAnimation('Takedamage', 1);
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
}


    // Util.rangeMove(deltaTime, this.randomMoveTimer, this.randomMoveTime, lv);
                