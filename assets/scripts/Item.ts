import { _decorator, Component, Node } from 'cc';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {

    isUsed: boolean = false; // 是否使用过
    existTimer: number = 0;
    existTime:number = 4;
    start() {

    }

    protected onEnable(): void {
        this.existTimer = 0;
        this.isUsed = false;
    }

    update(deltaTime: number) {
        this.existTimer += deltaTime;
        if (this.existTimer > this.existTime) {
            Globals.putNode(this.node)
        }
        if (this.isUsed) {
            Globals.putNode(this.node);
        }
    }
}


