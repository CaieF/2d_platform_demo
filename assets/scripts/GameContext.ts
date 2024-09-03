import { Node } from "cc";
import { Player } from "./Player";

export class GameContext {
  static ndPlayerParents: Node;
  static ndPlayer: Node;
  static ndTextParent: Node;
  static player: Player;
  static selectedPlayerId: number = 0;
  static player1Attack1Offset: number = 14;
  static player2Attack1Offset: number = 21;
  static ndEnemyParents: Node;
}