import { Node } from "cc";
import { Player } from "./Player";

export class GameContext {
  static GameStatus: number = 0; // 游戏状态
  static isFirstLoad: boolean = true; // 是否第一次加载
  static ndPlayerParents: Node;
  static ndPlayer: Node;
  static ndTextParent: Node;
  static player: Player;
  static selectedPlayerId: number = 0;
  static ndEnemyParents: Node;
  static ndWeaponParent: Node;
  static ndWeaponParent0: Node;
}