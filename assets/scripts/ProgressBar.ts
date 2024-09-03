import { _decorator, clamp01, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProgressBar')
export class ProgressBar extends Component {
    @property(Node) ndBg: Node;
    @property(Node) ndFill: Node;
    start() {

    }

    update(deltaTime: number) {
        
    }

    setProgress(progress: number) {
        progress = clamp01(progress);
        
        this.ndFill.getComponent(Sprite).fillStart = 1-progress;

    }
}


