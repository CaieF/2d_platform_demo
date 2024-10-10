import { Node } from "cc";
import { Player } from "./Player";
import { Enemy } from "./Enemy";

export class GameContext {
  static GameStatus: number = 0; // 游戏状态
  static GameScene: string; // 游戏场景
  // static AudioSource: AudioSource; // 游戏声音
  static GameSound: number = 0.25; // 游戏声音大小
  static isFirstLoad: boolean = true; // 是否第一次加载
  static selectedPlayerId: number = 0; // 选择角色id
  static selectedLevelId: number = 0; // 选择关卡id 
  static ndCamera: Node;
  static ndPlayerParents: Node;
  static ndPlayer: Node;
  static ndTextParent: Node;
  static player: Player;
  static ndEnemyParents: Node;
  static ndBoss: Node;
  static boss: Enemy;
  static ndWeaponParent: Node;
  static ndWeaponParent0: Node;
  static levels: any[] = [];
  static isSound: boolean = true; // 是否开启声音
  // static playerConfigData: Object;
}