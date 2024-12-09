import { Label, Node } from "cc";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { PetCat } from "./PetCat";
import { CharData } from "./CharData";
import { StorageManager } from "./StorageManager";

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
  static EnemyNowNumbers: number = 0; // 怪物波数
  static EnemyAllNumbers: number = 0; // 怪物总波数
  static isSound: boolean = true; // 是否开启声音
  static Money: number = parseInt(StorageManager.get('Money')) || 1000; // 游戏金币
  static Goods:object = StorageManager.get('Goods') || { // 游戏道具
    [CharData.GoodsId.Good1]: 0, // 红色补血药
    [CharData.GoodsId.Good2]: 0, // 蓝色补血药
  };
  // 游戏角色等级
  static playerLevel: object =  StorageManager.get('playerLevel') || {
    [CharData.PlayersId.Player1]: {level: 1, exp: 1},
    [CharData.PlayersId.Player2]: {level: 1, exp: 0},
    [CharData.PlayersId.Player3]: {level: 1, exp: 0},
    [CharData.PlayersId.Player4]: {level: 1, exp: 0},
    [CharData.PlayersId.Player5]: {level: 1, exp: 0},
  }; 

  游戏宠物等级
  static petLevel: object =  StorageManager.get('petLevel') || {
    [CharData.PetsId.Pet1]: {level: 1, exp: 0},
    [CharData.PetsId.Pet2]: {level: 1, exp: 0},
    [CharData.PetsId.Pet3]: {level: 1, exp: 0},
    [CharData.PetsId.Pet4]: {level: 1, exp: 0},
    [CharData.PetsId.Pet5]: {level: 1, exp: 0},
  }
  // static playerConfigData: Object;
}