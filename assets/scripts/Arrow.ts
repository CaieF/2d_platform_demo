import { _decorator, Component, Node } from 'cc';
import { Util } from './Util';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('Arrow')
export class Arrow extends Component {
    speed: number = 5;
    isMoveLeft: boolean = false;
    isMoving: boolean = true;
    isSkill: boolean = false;// 是否是技能,技能可穿透
    isHit: boolean = false; // 是否击中敌人

    private _distance: number = 0;
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
        }
        // 普通攻击击中敌人就移除
        if (!this.isSkill && this.isHit) {
            Globals.putNode(this.node);
        }
        
        if (this._distance > 500 && !this.isHit) {
            Globals.putNode(this.node);
        }
    }
}


