import { _decorator, Component, Node, TiledMap } from 'cc';
import { Util } from './Util';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node) ndPlayer: Node;
    @property(TiledMap) Map: TiledMap;

    start() {
        if (this.Map){
            Util.setWall(this.Map);
        }
    }

    update(deltaTime: number) {
        
    }
}


