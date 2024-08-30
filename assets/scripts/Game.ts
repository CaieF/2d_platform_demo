import { _decorator, Component, Node, TiledMap } from 'cc';
import { Util } from './Util';
import { GameContext } from './GameContext';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node) ndPlayerParents: Node;
    @property(TiledMap) Map: TiledMap;

    protected onLoad() {
        GameContext.ndPlayerParents = this.ndPlayerParents;
        GameContext.ndPlayer = this.ndPlayerParents.getChildByName('Player1');
        GameContext.player = GameContext.ndPlayer.getComponent(Player);
    }
    start() {
        if (this.Map){
            Util.setWall(this.Map);
        }
    }

    update(deltaTime: number) {
        
    }
}


