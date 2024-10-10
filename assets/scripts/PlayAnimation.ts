import { Collider2D, dragonBones } from "cc";
import { Constant } from "./Constant";


// 待机
export function playIdle(display: dragonBones.ArmatureDisplay) {
  display.armatureName = 'Idle';
  display.playAnimation('Idle', 0);
}

// 跑步
export function playRun(display: dragonBones.ArmatureDisplay) {
  display.armatureName = 'Run';
  display.playAnimation('Run', 0);
}

// 跳跃
export function playJump(display: dragonBones.ArmatureDisplay) {
  display.armatureName = 'Jump';
  display.playAnimation('Jump', 0);
}

// 受击
export function playTakedamage(display: dragonBones.ArmatureDisplay, charStatus: number) {
  display.armatureName = 'TakeDamage';
  display.playAnimation('TakeDamage', 1);
  display.addEventListener(dragonBones.EventObject.COMPLETE, () => {
    charStatus = Constant.CharStatus.IDLE;
}, this);
}

// 死亡
export function playDeath(display: dragonBones.ArmatureDisplay) {
  display.armatureName = 'Death';
  display.playAnimation('Death', 1);
}

// 翻滚
export function playDodge(display: dragonBones.ArmatureDisplay) {
  display.armatureName = 'Dodge';
  display.playAnimation('Dodge', 1);
}
