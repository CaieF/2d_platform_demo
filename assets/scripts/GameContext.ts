import { Label, Node } from "cc";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { PetCat } from "./PetCat";

export class GameContext {
  static GameStatus: number = 0; // 游戏状态
  static GameScene: string; // 游戏场景
  // static AudioSource: AudioSource; // 游戏声音
  static GameSound: number = 0.5; // 游戏声音大小
  static isFirstLoad: boolean = true; // 是否第一次加载
  static selectedPlayerId: number = 0; // 选择角色id
  static selectedLevelId: number = 0; // 选择关卡id 
  static selectedPetId: number = -1; // 选择宠物id
  static ndCamera: Node;
  static ndPlayerParents: Node;
  static ndPlayer: Node;
  static ndTextParent: Node;
  static player: Player;
  static ndPet: Node;
  static pet: PetCat;
  static ndEnemyParents: Node;
  static ndBoss: Node;
  static boss: Enemy;
  static ndWeaponParent: Node;
  static ndWeaponParent0: Node;
  static prepareMoneyLabel: Label;
  static gameMoneyLabel: Label;
  static levels: any[] = [];
  static isSound: boolean = true; // 是否开启声音
  static Money: number = 1000; // 游戏金币
  // static playerConfigData: Object;
}