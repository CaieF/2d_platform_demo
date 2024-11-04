import { _decorator, Component, Node } from 'cc';
import { Util } from './Util';
import { Globals } from './Globals';
import { UseSkill } from './UseSkill';
const { ccclass, property } = _decorator;

@ccclass('Arrow')
export class Arrow extends Component {

    static readonly bulletType = {
        ARROW: 1,
        ELECTOR_ARROW: 2,
        FIRE_BALL: 3,
        PEA: 4,
    }

    speed: number = 5;
    isMoveLeft: boolean = false;
    isMoving: boolean = true;
    type: number = 1;
    isSkill: boolean = false;// 是否是技能,技能可穿透
    isHit: boolean = false; // 是否击中敌人
    // isFireBall: boolean = false; // 是否是火球
    // isPea: boolean = false; // 是否是豌豆

    private _distance: number = 0;
    protected onEnable(): void {
        this._distance = 0;
        this.isHit = false;
        // this.isFireBall = false;
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
        }
        // 普通攻击击中敌人就移除
        if (this.isHit && !this.isSkill) {
            if (this.type === Arrow.bulletType.FIRE_BALL) {
                UseSkill.redExplosion(this.node.worldPosition, 1);
            } else if (this.type === Arrow.bulletType.PEA) {
                UseSkill.peaExplosion(this.node.worldPosition, 1);
            }

            Globals.putNode(this.node);
        }
        
        // 超过一定距离就移除
        if (this._distance > 500 && !this.isHit) {
            Globals.putNode(this.node);
        }
    }
}


