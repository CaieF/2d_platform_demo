import { _decorator, Component, EventTouch, Label, Node, UITransform, Vec3 } from 'cc';
import { ProgressBar } from './ProgressBar';
const { ccclass, property } = _decorator;

@ccclass('SoundBar')
export class SoundBar extends Component {
    @property (Label) ndLabel: Label = null;
    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
    onTouchStart(event: EventTouch) {
        this.updateVolume(event);
    }
    onTouchMove(event: EventTouch) {
        console.log('move', );
        
        this.updateVolume(event);
    }
    onTouchEnd() {
    }
    onTouchCancel() {
    }

    private updateVolume(event: EventTouch) {
        // const v2 = event.getUIStartLocation();
        const v2 = event.getUILocation();
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2.x, v2.y));

        if (pos.x < -40 || pos.x > 40) {
            return;
        } else {
            // this.node.getComponent(ProgressBar).setProgress((pos.x + 40) / 80);
            this.updateVolumeLabel((pos.x + 40) / 80 );
            // this.ndLabel.string = '音量：  ' + ((pos.x + 40) / 80 * 100).toFixed(2) + '%';
        }
    }

    updateVolumeLabel(value: number) {
        this.node.getComponent(ProgressBar).setProgress(value);
        this.ndLabel.string = '音量：  ' + (value * 100).toFixed(2) + '%';
    }
}


