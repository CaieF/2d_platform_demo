import { NormalButton } from "./NormalButton";
import { director, Node } from "cc";
import { Util } from "./Util";
import { GameContext } from "./GameContext";
import { Constant } from "./Constant";
import { SoundBar } from "./SoundBar";
import { AudioManager } from "./AudioManager";

export class ButtonEvent {

  static getHome() {
    Util.applyResume();
    if (GameContext.GameScene === Constant.GameScene.Game) {
      director.loadScene(Constant.GameScene.Prepare)
      AudioManager.Instance.playMusic('sounds/Load', 1)
    } else if (GameContext.GameScene === Constant.GameScene.Prepare) {
      director.loadScene(Constant.GameScene.Start);
    }
  }
  // 设置按钮点击事件
  static setButtonEvent(ndButton: Node, buttonType: String, ndSettingPanel?: Node, ndSoundBar?: Node) {
    if (ndButton == null) return;

    ndButton.getComponent(NormalButton).onClick(() => {
      switch (buttonType) {
        case "Setting":
          // 设置按钮 
          if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
          // AudioManager.Instance.playMusic('sounds/Requiem', GameContext.GameSound)
          if (GameContext.GameScene !== Constant.GameScene.Start) {
            Util.applyPause();
          }
          GameContext.GameStatus = Constant.GameStatus.PAUSE;
          ndSettingPanel.active = !ndSettingPanel.active;
          break;
        case 'OK':
          // 取消按钮
          Util.applyResume();
          ndSettingPanel.active = !ndSettingPanel.active;
          break;
        case 'Home':
          // 返回按钮
          this.getHome();
          // director.loadScene('Start');
          break;
        case 'Reload':
          // 重新开始
          Util.applyResume();
          director.loadScene(GameContext.GameScene);
          break;
        case 'noSound':
          ndSoundBar.getComponent(SoundBar).updateVolumeLabel(GameContext.GameSound);
          break;
        case 'maxSound':
          ndSoundBar.getComponent(SoundBar).updateVolumeLabel(0);
          break;
        case 'Back':
          // 设置按钮 
          if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
          if (GameContext.GameScene === Constant.GameScene.Game) {
            director.loadScene(Constant.GameScene.Prepare)
            AudioManager.Instance.playMusic('sounds/Load', 1)
          } else if (GameContext.GameScene === Constant.GameScene.Prepare) {
            director.loadScene(Constant.GameScene.Start);
          }
          break;
        case 'Next':
          // 下一关
          if (GameContext.selectedLevelId < GameContext.levels.length - 1) {
            GameContext.selectedLevelId += 1;
          }
          Util.applyResume();
          director.loadScene(GameContext.GameScene);
          break;
        default:
          break;
      }
    })
  }

  static setButtonKeyEvent(ndButton: Node, buttonType: String, ndPanel?: Node) {
    switch (buttonType) {
      case 'Setting':
        ndButton.getComponent(NormalButton).onKeyEsc(() => {
          if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
          Util.applyPause();
          ndPanel.active = !ndPanel.active;
        });
        break;
      default:
        break;
    }
  }
}