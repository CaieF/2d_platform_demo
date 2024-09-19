import { _decorator, Component, dragonBones, Node } from 'cc';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('Explosion')
export class Explosion extends Component {

    protected onEnable(): void {
        const dis = this.node.getComponent(dragonBones.ArmatureDisplay);
        dis.on(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }

    protected onDisable(): void {
        const dis = this.node.getComponent(dragonBones.ArmatureDisplay);
        dis.off(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    onComplete() {
        Globals.putNode(this.node);
    }

    playRedExplosion() {
        const dis = this.node.getComponent(dragonBones.ArmatureDisplay);
        dis.playAnimation('RedExplosion', 1);
    }

    playThunderStrike() {
        const dis = this.node.getComponent(dragonBones.ArmatureDisplay);
        dis.playAnimation('ThunderStrike', 1);
    }

    playThunderSplash() {
        const dis = this.node.getComponent(dragonBones.ArmatureDisplay);
        dis.playAnimation('ThunderSplash', 1);
    }
}


