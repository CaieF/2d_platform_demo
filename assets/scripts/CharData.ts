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
}