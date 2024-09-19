import { Vec3 } from "cc";
import { Constant } from "./Constant";
import { Globals } from "./Globals";
import { SwordQi } from "./SwordQi";
import { GameContext } from "./GameContext";
import { Hole } from "./Hole";
import { Arrow } from "./Arrow";
import { Explosion } from "./Explosion";

export class UseSkill{

  // 发送剑气
  static shootSwordQi(position: Vec3, scaleX: number) {
        
    const ndPlayer1Skill0 = Globals.getNode(Constant.PrefabUrl.PLAYER1_SKILL0, GameContext.ndWeaponParent);
    ndPlayer1Skill0.worldPosition = position;
    ndPlayer1Skill0.scale = (new Vec3(scaleX * 0.2, 0.2, 0));
    // ndPlayer1Skill0.setScale(this.ndAni.scale);aaaa
    const pk0 = ndPlayer1Skill0.getComponent(SwordQi);
    pk0.isMoving = true;
    pk0.isMoveLeft = scaleX < 0 ? true : false;
  }

  // 发送乱剑
  static shootSwordGroup(position: Vec3, scaleX: number) {
    const ndPlayer1Skill1 = Globals.getNode(Constant.PrefabUrl.PLAYER1_SKILL1, GameContext.ndWeaponParent);
    ndPlayer1Skill1.worldPosition = position
    ndPlayer1Skill1.scale = (new Vec3(scaleX * 0.3, 0.3, 0));
    const pk1 = ndPlayer1Skill1.getComponent(SwordQi);
    pk1.isMoving = false;
  }

  // 释放黑洞
  static shootHole(position: Vec3) {
    const ndPlayer2Skill1 = Globals.getNode(Constant.PrefabUrl.PLAYER2_SKILL1, GameContext.ndWeaponParent);
    ndPlayer2Skill1.worldPosition = position;
  }

  // 扔石头
  static throwStone(position: Vec3, scaleX: number) {
    const ndPlayer2Skill0 = Globals.getNode(Constant.PrefabUrl.PLAYER2_SKILL0, GameContext.ndWeaponParent);
    ndPlayer2Skill0.worldPosition = position;
    const pk = ndPlayer2Skill0.getComponent(Hole);
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.isMoving = true;
    pk.attractionForce = 150;
    pk.attractionRange = 80;
  }

  // 射箭
  static shootArrow(position: Vec3, scaleX: number) {
    const ndArrow = Globals.getNode(Constant.PrefabUrl.ARROW, GameContext.ndWeaponParent);
    ndArrow.worldPosition = position;
    ndArrow.scale = (new Vec3(scaleX, 1, 0));
    const pk = ndArrow.getComponent(Arrow);
    pk.isMoving = true;
    pk.speed = 10;
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.isSkill = false;
    pk.isHit = false;
  }

  // 发送闪电箭
  static shootElectorArrow(position: Vec3, scaleX: number) {
    const ndPlayer3Skill0 = Globals.getNode(Constant.PrefabUrl.PLAYER3_SKILL0, GameContext.ndWeaponParent);
    ndPlayer3Skill0.worldPosition = position;
    ndPlayer3Skill0.scale = (new Vec3(scaleX * 2.5, 2.5, 0));
    const pk = ndPlayer3Skill0.getComponent(Arrow);
    pk.isMoving = true;
    pk.speed = 10;
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.isSkill = true;
    pk.isHit = false;
  }

  // 发送闪电
  static shootThunderStrike(position: Vec3) {
    const ndThunderStrike = Globals.getNode(Constant.PrefabUrl.THUNDER_STRIKE, GameContext.ndWeaponParent0);
    ndThunderStrike.worldPosition = position;
    ndThunderStrike.getComponent(Explosion).playThunderStrike();
  }

  static shootThunderSplash(position: Vec3, scaleX: number) {
    const ndThunderStrike = Globals.getNode(Constant.PrefabUrl.PLAYER3_SKILL1, GameContext.ndWeaponParent);
    ndThunderStrike.worldPosition = position;
    ndThunderStrike.scale = (new Vec3(scaleX * 2, 2, 0));
    ndThunderStrike.getComponent(Explosion).playThunderSplash();
  }

  // 发送火焰球
  static shootFireBall(position: Vec3, scaleX: number) {
    console.log("shootFireBall", position);
    
    const ndFireBall = Globals.getNode(Constant.PrefabUrl.FIRE_BALL, GameContext.ndWeaponParent);
    console.log("ndFireBall", ndFireBall);
    
    ndFireBall.worldPosition = position;
    ndFireBall.scale = (new Vec3(scaleX * 4, 4, 0));
    const pk = ndFireBall.getComponent(Arrow);
    pk.isMoving = true;
    pk.isSkill = false;
    pk.isMoveLeft = scaleX < 0 ? true : false;
    pk.speed = 6;
    pk.isHit = false;
    pk.isFireBall = true;
  }

  static redExplosion(position: Vec3, scale: number) {
    const ndRedExplosion = Globals.getNode(Constant.PrefabUrl.RED_EXPLOSION, GameContext.ndWeaponParent0);
    ndRedExplosion.worldPosition = position;
    ndRedExplosion.scale = (new Vec3(scale, scale, 0));
    ndRedExplosion.getComponent(Explosion).playRedExplosion();
  }
}