import { random } from "cc";
import { Constant } from "./Constant";

export class CharData {

  // 玩家id
  static readonly PlayersId = {
    Player1: 0,
    Player2: 1,
    Player3: 2,
    Player4: 3,
    Player5: 4,
  }


  // 总数据汇总
  static readonly playerConfig = {
    [this.PlayersId.Player1]: {
        prefabUrl: Constant.PrefabUrl.PLAYER1,  // 预制体地址
        avatarUrl: Constant.PrefabUrl.PLAYER1_AVATAR,  // 头像地址
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR1,  // 技能条地址
        hp: 150,  // 血量
        speed: 12,  // 移动速度
        jump_speed: 10, // 跳跃速度
        atk1Offset: 14, // 攻击距离
        sk0Cd: 2,  // 技能0冷却时间
        sk1Cd: 3,  // 技能1冷却时间
        sk2Cd: 1,  // 技能2冷却时间
        sk3Cd: 1,  // 技能3冷却时间
    },
    [this.PlayersId.Player2]: {
        prefabUrl: Constant.PrefabUrl.PLAYER2,
        avatarUrl: Constant.PrefabUrl.PLAYER2_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR2,
        hp: 200,
        speed: 10,
        jump_speed: 9,
        atk1Offset: 21,
        sk0Cd: 2,
        sk1Cd: 2,
        sk2Cd: 1,
        sk3Cd: 1,
    },
    [this.PlayersId.Player3]: {
        prefabUrl: Constant.PrefabUrl.PLAYER3,
        avatarUrl: Constant.PrefabUrl.PLAYER3_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR3,
        hp: 100,
        speed: 14,
        jump_speed: 11,
        sk0Cd: 2,
        sk1Cd: 3,
        sk2Cd: 1,
        sk3Cd: 1,
    },
    [this.PlayersId.Player4]: {
        prefabUrl: Constant.PrefabUrl.PLAYER4,
        avatarUrl: Constant.PrefabUrl.PLAYER4_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR4,
        hp: 120,
        speed: 11,
        jump_speed: 32,
        sk0Cd: 1,
        sk1Cd: 1,
        sk2Cd: 1,
        sk3Cd: 1,
        atk1Offset: 32,
    },
    [this.PlayersId.Player5]: {
        prefabUrl: Constant.PrefabUrl.PLAYER5,
        avatarUrl: Constant.PrefabUrl.PLAYER5_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR5,
        hp: 100,
        speed: 8,
        jump_speed: 9,
        sk0Cd: 1,
        sk1Cd: 1,
        sk2Cd: 1,
        sk3Cd: 1,
        atk1Offset: 7.5
    },
  };

  // 怪物id
  static readonly EnemysId = {
    Enemy1: 1,
    Enemy2: 2,
    Enemy3: 3,
    Boss1: 101,
    Boss2: 102,
  }


  static readonly enemyConfig = {
    [this.EnemysId.Enemy1]: {
        prefabUrl: Constant.PrefabUrl.SKELETON,  // 预制体
        enemyId: 1, // 怪物id
        name: '骷髅怪',  // 怪物名称
        hp: 100,  // 血量
        minSpeed: 8,  // 移动速度
        maxSpeed: 12, // 移动速度
        chaseDistance: 200,  // 追击距离
        attackRange: 70,  // 攻击距离
        exp: 10,  // 经验值
        ap: 5,  // 攻击力
        attackNumber: 1,  // 攻击方式数
        isBoss: false,    // 是否是boss
        HitColliderOffsetX: 8.5  // 碰撞体偏移量
    },
    [this.EnemysId.Enemy2]: {
        prefabUrl: Constant.PrefabUrl.SKELETON2,
        enemyId: 2,
        name: '黑骷髅怪',
        hp: 150,
        minSpeed: 8,
        maxSpeed: 12,
        chaseDistance: 300,
        attackRange: 70,
        exp: 20,
        ap: 10,
        attackNumber: 1,
        isBoss: false,
        HitColliderOffsetX: 3
     },
     [this.EnemysId.Enemy3]: {
        prefabUrl: Constant.PrefabUrl.SKELETON3,
        enemyId: 3,
        name: '绿骷髅',
        hp: 120,
        minSpeed: 14,
        maxSpeed: 16,
        chaseDistance: 300,
        attackRange: 70,
        exp: 30,
        ap: 15,
        attackNumber: 1,
        isBoss: false,
        HitColliderOffsetX: 0
      },
    [this.EnemysId.Boss1]: {
        prefabUrl: Constant.PrefabUrl.BOSS1,
        enemyId: 101,
        name: '女巨人',
        hp: 500,
        minSpeed: 14,
        maxSpeed: 16,
        chaseDistance: 400,
        attackRange: 200,
        exp: 50,
        ap: 30,
        attackNumber: 3,
        isBoss: true,
        HitColliderOffsetX: 0
    },
    [this.EnemysId.Boss2]: {
        prefabUrl: Constant.PrefabUrl.BOSS2,
        enemyId: 102,
        name: '凯之巨人',
        hp: 600,
        minSpeed: 10,
        maxSpeed: 12,
        chaseDistance: 400,
        attackRange: 200,
        exp: 50,
        ap: 30,
        attackNumber: 3,
        isBoss: true,
        HitColliderOffsetX: 0
    }
  }
}