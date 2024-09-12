
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
}