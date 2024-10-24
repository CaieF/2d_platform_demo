import { _decorator, Component, Node, TiledMap, TiledMapAsset, UITransform, Vec3 } from 'cc';
import { GameContext } from './GameContext';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {
    ndMap: TiledMap;
    map: TiledMap;
    levels: any[] = []; // 存储关卡信息
    protected onLoad(): void {
        this.levels = GameContext.levels;
    }
    protected onEnable(): void {
        
    }
    start() {
        // Util.setWall(this.map);
        
    }

    

    update(deltaTime: number) {
        
    }
}


