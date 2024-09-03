import { _decorator, clamp01, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProgressBar')
export class ProgressBar extends Component {
    @property(Node) ndBg: Node;
    @property(Node) ndFill: Node;
    @property(Label) ndLabel: Node;
    start() {

    }

    update(deltaTime: number) {
        
    }

    setProgress(progress: number) {
        progress = clamp01(progress);
        
        this.ndFill.getComponent(Sprite).fillStart = 1-progress;

    }

    setLabel(number: number, maxNumber: number) {
        this.ndLabel.getComponent(Label).string = `${number} / ${maxNumber}`;
    }
}


