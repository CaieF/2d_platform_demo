import { _decorator, Collider2D, Component, dragonBones, Node, NodePool, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PetCat')
export class PetCat extends Component {
    @property(Node) private ndAni: Node;

    private _petStatus: number = 0; // 宠物状态
    private display: dragonBones.ArmatureDisplay; // 骨骼动画
    private rb: RigidBody2D = null!; // 刚体
    private HitCollider: Collider2D = null!; // 受击范围
    private randomMoveTimer: number = 0; // 随机移动计时器
    private randomMoveTime: number = 0.5; // 随机移动时间
    speed: number = 10;
    hp:number = 100;
    fllowDistance: number = 200; // 跟随距离
    chaseDistance:number = 100; // 追击距离
    attackRange: number = 70; // 攻击距离

    protected onLoad(): void {
        
    }

    protected onEnable(): void {
        
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


