import { _decorator, clamp, Component, Node } from 'cc';
import { GameContext } from './GameContext';
const { ccclass, property } = _decorator;

@ccclass('Camera')
export class Camera extends Component {
    @property(Node) ndView: Node;
    start() {

    }

    update(deltaTime: number) {
        if (!GameContext.ndPlayer || !GameContext.ndPlayer.isValid) return;

        // this.node.worldPosition.set(GameContext.ndPlayer.worldPosition.x, this.node.worldPosition.y )
        // console.log('世界坐标',this.node.worldPosition);
        // console.log('相对坐标1',this.node.position);
        this.node.worldPosition = GameContext.ndPlayer.worldPosition;
        this.ndView.worldPosition = GameContext.ndPlayer.worldPosition;
        const x = clamp(this.node.position.x, 0, 2304);
        this.node.setPosition(x, 0);
        this.ndView.setPosition(x/2, 0);
        // console.log('相对坐标2', this.node.position);
        
    }
}


