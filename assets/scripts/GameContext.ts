import { Node } from "cc";
import { Player } from "./Player";

export class GameContext {
  static ndPlayerParents: Node;
  static ndPlayer: Node;
  static ndTextParent: Node;
  static player: Player;
  static selectedPlayerId: number = 0;
  static ndEnemyParents: Node;
  static ndWeaponParent: Node;
  static ndWeaponParent0: Node;
}