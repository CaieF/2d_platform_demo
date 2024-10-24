import { _decorator, AudioSource, Component, director, Game, Node, Prefab, SpriteFrame, warn } from 'cc';
import { PoolManager } from './PoolManager';
import { Constant } from './Constant';
import { ResUtil } from './ResUtil';
import { GameContext } from './GameContext';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Globas')
export class Globals extends Component {
    static prefabs: Record<string, Prefab> = {}
    static skillSpriteFrames: Record<string, SpriteFrame> = {};

    protected onLoad(): void {
        director.addPersistRootNode(this.node);
        // GameContext.AudioSource = this.node.getComponent(AudioSource);
        
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

        // 加载关卡数据
        ResUtil.loadJson('levels').then((data) => {
            GameContext.levels = data.json;
            // console.log('加载关卡数据成功！');
            // this.loadLevel(1);
        }).catch((err) => {
            console.error('加载关卡数据失败！');
        })
        
        AudioManager.Instance.init();
        AudioManager.Instance.musicVolume = GameContext.GameSound;
        AudioManager.Instance.soundVolume = Math.min(GameContext.GameSound *2, 1);
        AudioManager.Instance.playMusic('sounds/Load', 1);
        
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


