import { _decorator, Component, director, Node, Prefab, SpriteFrame, warn } from 'cc';
import { PoolManager } from './PoolManager';
import { Constant } from './Constant';
import { ResUtil } from './ResUtil';
const { ccclass, property } = _decorator;

@ccclass('Globas')
export class Globals extends Component {
    static prefabs: Record<string, Prefab> = {}
    static skillSpriteFrames: Record<string, SpriteFrame> = {};

    protected onLoad(): void {
        director.addPersistRootNode(this.node);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    static init () {
        const keys = Object.keys(Constant.PrefabUrl);
        const promise: Promise<any>[] = []; 
        keys.forEach(key => {
            const url = Constant.PrefabUrl[key];
            const p = ResUtil.loadPrefab(url).then((pf:Prefab) => {
                Globals.prefabs[url] = pf;
            });
            promise.push(p);
        });

        // promise[promise.length] = ResUtil.loadSpriteFrameDir('skills/').then((frames: SpriteFrame[]) => {
        //     for (let i = 0; i < frames.length; i++) {
        //         const sf = frames[i];
        //         this.skillSpriteFrames[sf.name] = sf;
        //     }
        // });

        return Promise.all(promise);
    }

    static getNode(name: string, parent: Node) {
        
        const node = PoolManager.instance.get(this.prefabs[name]);
        node.parent = parent;
        return node;
    }

    static putNode(node: Node) {
        PoolManager.instance.put(node);
    }

    // static getSkillSpriteFrame(skillID: number) {
    //     const frame = this.skillSpriteFrames[skillID];
    //     if (!frame) {
    //         warn(`${skillID} is not key of sprites`);
    //     }
    //     return frame;
    // }
}


