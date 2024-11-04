import { _decorator, Component, Node } from 'cc';
import { Util } from './Util';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('SwordQi')
export class SwordQi extends Component {
    attack: number = 10;
    speed: number = 5;
    isMoveLeft: boolean = false;
    isMoving: boolean = true;
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
        }

        if (this.isMoving) this._distance += this.speed;
        else this._distance += this.speed * 0.4;
        if (this._distance > 200) {
            Globals.putNode(this.node);
        }
    }
}


