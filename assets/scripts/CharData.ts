import { random } from "cc";
import { Constant } from "./Constant";

export class CharData {
  // 骑士喵相关数值
  static readonly Player1 = {
    playerId: 0, // 角色id
    hp: 150, // 血量
    speed: 12, // 速度
    jump_speed: 10, // 跳跃速度
    atk1Offset: 14, // 攻击1偏移量
    sk0Cd: 2, // 技能0冷却时间
    sk1Cd: 3, // 技能1冷却时间
    sk2Cd: 1, // 技能2冷却时间
    sk3Cd: 1, // 技能3冷却时间
  }

  // 国王喵相关数值
  static readonly Player2 = {
    playerId: 1, // 角色id
    hp: 200, // 血量
    speed: 10, // 速度
    jump_speed: 9, // 跳跃速度
    atk1Offset: 21, // 攻击1偏移量
    sk0Cd: 2, // 技能0冷却时间
    sk1Cd: 3, // 技能1冷却时间
    sk2Cd: 1, // 技能2冷却时间
    sk3Cd: 1, // 技能3冷却时间
  }

  // 猎人喵相关数值
  static readonly Player3 = {
    playerId: 2, // 角色id
    hp: 100, // 血量
    speed: 14, // 速度
    jump_speed: 11, // 跳跃速度
    sk0Cd: 2, // 技能0冷却时间
    sk1Cd: 3, // 技能1冷却时间
    sk2Cd: 1, // 技能2冷却时间
    sk3Cd: 1, // 技能3冷却时间
  }

  // 法师喵相关数值
  static readonly Player4 = {
    playerId: 3, // 角色id
    hp: 120, // 血量
    speed: 11, // 速度
    jump_speed: 11, // 跳跃速度
    atk1Offset: 32, // 攻击1偏移量
    sk0Cd: 1, // 技能0冷却时间
    sk1Cd: 1, // 技能1冷却时间
    sk2Cd: 1, // 技能2冷却时间
    sk3Cd: 1, // 技能3冷却时间
  }

  // 小喵娘相关数值
  static readonly Player5 = {
    playerId: 4, // 角色id
    hp: 100, // 血量
    speed: 8, // 速度
    jump_speed: 9, // 跳跃速度
    atk1Offset: 7.5, // 攻击1偏移量
    sk0Cd: 1, // 技能0冷却时间
    sk1Cd: 1, // 技能1冷却时间
    sk2Cd: 1, // 技能2冷却时间
    sk3Cd: 1, // 技能3冷却时间
  }


  // 总数据汇总
  static readonly playerConfig = {
    [CharData.Player1.playerId]: {
        prefabUrl: Constant.PrefabUrl.PLAYER1,
        avatarUrl: Constant.PrefabUrl.PLAYER1_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR1,
        hp: CharData.Player1.hp,
        speed: CharData.Player1.speed,
        jump_speed: CharData.Player1.jump_speed,
    },
    [CharData.Player2.playerId]: {
        prefabUrl: Constant.PrefabUrl.PLAYER2,
        avatarUrl: Constant.PrefabUrl.PLAYER2_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR2,
        hp: CharData.Player2.hp,
        speed: CharData.Player2.speed,
        jump_speed: CharData.Player2.jump_speed,
    },
    [CharData.Player3.playerId]: {
        prefabUrl: Constant.PrefabUrl.PLAYER3,
        avatarUrl: Constant.PrefabUrl.PLAYER3_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR3,
        hp: CharData.Player3.hp,
        speed: CharData.Player3.speed,
        jump_speed: CharData.Player3.jump_speed,
    },
    [CharData.Player4.playerId]: {
        prefabUrl: Constant.PrefabUrl.PLAYER4,
        avatarUrl: Constant.PrefabUrl.PLAYER4_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR4,
        hp: CharData.Player4.hp,
        speed: CharData.Player4.speed,
        jump_speed: CharData.Player4.jump_speed,
    },
    [CharData.Player5.playerId]: {
        prefabUrl: Constant.PrefabUrl.PLAYER5,
        avatarUrl: Constant.PrefabUrl.PLAYER5_AVATAR,
        skillBarUrl: Constant.PrefabUrl.SKILL_BAR5,
        hp: CharData.Player5.hp,
        speed: CharData.Player5.speed,
        jump_speed: CharData.Player5.jump_speed,
    },
  };

  static readonly Enemy1 = {
    name: '骷髅怪',
    enemyId: 1,
    isBoss: false, // 是否是boss
    hp: 100, // 血量
    minSpeed: 8, // 最小速度
    maxSpeed: 12, // 最大速度
    chaseDistance: 200, // 追击距离
    attackRange: 70, // 攻击距离
    exp: 10, // 经验值
    ap: 5, // 攻击力
    attackNumber: 1, // 攻击方式数
    HitColliderOffsetX: -8.5, // 受击范围偏移量x
  }

  static readonly Enemy2 = {
    name: '黑骷髅怪',
    enemyId: 2,
    isBoss: false, // 是否是boss
    hp: 150, // 血量
    minSpeed: 8, // 最小速度
    maxSpeed: 12, // 最大速度
    chaseDistance: 300, // 追击距离
    attackRange: 70, // 攻击距离
    exp: 20, // 经验值
    ap: 10,
    attackNumber: 1, // 攻击方式数
    HitColliderOffsetX: -3, // 受击范围偏移量x
  }

  static readonly Boss1 = {
    name: '女巨人',
    enemyId: 101,
    isBoss: true, // 是否是boss
    hp: 500, // 血量
    minSpeed: 14,
    maxSpeed: 16,
    chaseDistance: 400, // 追击距离
    attackRange: 200,
    exp: 50,
    ap: 30, // 攻击力
    attackNumber: 3, // 攻击方式数
    HitColliderOffsetX: 0, // 受击范围偏移量x
  }

  static readonly enemyConfig = {
    [CharData.Enemy1.enemyId]: {
        prefabUrl: Constant.PrefabUrl.SKELETON,
        enemyId: CharData.Enemy1.enemyId,
        name: CharData.Enemy1.name,
        hp: CharData.Enemy1.hp,
        minSpeed: CharData.Enemy1.minSpeed,
        maxSpeed: CharData.Enemy1.maxSpeed,
        chaseDistance: CharData.Enemy1.chaseDistance,
        attackRange: CharData.Enemy1.attackRange,
        exp: CharData.Enemy1.exp,
        ap: CharData.Enemy1.ap,
        attackNumber: CharData.Enemy1.attackNumber,
        isBoss: CharData.Enemy1.isBoss,
        HitColliderOffsetX: CharData.Enemy1.HitColliderOffsetX
    },
    [CharData.Enemy2.enemyId]: {
        prefabUrl: Constant.PrefabUrl.SKELETON2,
        enemyId: CharData.Enemy2.enemyId,
        name: CharData.Enemy2.name,
        hp: CharData.Enemy2.hp,
        minSpeed: CharData.Enemy2.minSpeed,
        maxSpeed: CharData.Enemy2.maxSpeed,
        chaseDistance: CharData.Enemy2.chaseDistance,
        attackRange: CharData.Enemy2.attackRange,
        exp: CharData.Enemy2.exp,
        ap: CharData.Enemy2.ap,
        attackNumber: CharData.Enemy2.attackNumber,
        isBoss: CharData.Enemy2.isBoss,
        HitColliderOffsetX: CharData.Enemy2.HitColliderOffsetX
     },    
    [CharData.Boss1.enemyId]: {
        prefabUrl: Constant.PrefabUrl.BOSS1,
        enemyId: CharData.Boss1.enemyId,
        name: CharData.Boss1.name,
        hp: CharData.Boss1.hp,
        minSpeed: CharData.Boss1.minSpeed,
        maxSpeed: CharData.Boss1.maxSpeed,
        chaseDistance: CharData.Boss1.chaseDistance,
        attackRange: CharData.Boss1.attackRange,
        exp: CharData.Boss1.exp,
        ap: CharData.Boss1.ap,
        attackNumber: CharData.Boss1.attackNumber,
        isBoss: CharData.Boss1.isBoss,
        HitColliderOffsetX: CharData.Boss1.HitColliderOffsetX
    }
  }
}