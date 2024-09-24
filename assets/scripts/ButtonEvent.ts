import { NormalButton } from "./NormalButton";
import { director, Node } from "cc";
import { Util } from "./Util";
import { GameContext } from "./GameContext";
import { Constant } from "./Constant";
import { SoundBar } from "./SoundBar";
import { AudioManager } from "./AudioManager";

export class ButtonEvent {
  // 设置按钮点击事件
  static setButtonEvent(ndButton: Node, buttonType: String, ndSettingPanel?: Node, ndSoundBar?: Node) {
    ndButton.getComponent(NormalButton).onClick(() => {
      switch (buttonType) {
        case "Setting":
          // 设置按钮 
          if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
          Util.applyPause();
          ndSettingPanel.active = !ndSettingPanel.active;
          break;
        case 'OK':
          // 取消按钮
          Util.applyResume();
          ndSettingPanel.active = !ndSettingPanel.active;  
          break;
        case 'Home':
          // 返回按钮
          Util.applyResume();
          if (GameContext.GameScene === Constant.GameScene.Game) {
            director.loadScene(Constant.GameScene.Prepare)
            AudioManager.Instance.playMusic('sounds/Load', GameContext.GameSound)
          } else if (GameContext.GameScene === Constant.GameScene.Prepare) {
            director.loadScene(Constant.GameScene.Start);
          }
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