import { _decorator, Component, director, Label, Node } from 'cc';
import { Util } from './Util';
import { ButtonEvent } from './ButtonEvent';
import { GameContext } from './GameContext';
import { Constant } from './Constant';
import { NormalButton } from './NormalButton';
import { CharPanel } from './CharPanel';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Prepare')
export class Prepare extends Component {
    @property(Node) ndPlayerMessage: Node;
    @property(Node) ndBtnSettingButton: Node; // 设置按钮
    @property(Node) ndBtnShopButton: Node; // 商店按钮
    @property(Node) ndBtnBack: Node; // 返回按钮
    @property(Node) ndSettingPanel: Node; // 设置面板
    @property(Node) ndShopPanel: Node; // 商店面板
    @property(Node) ndLevelPanel: Node; // 关卡选择
    @property(Node) ndBtnStartGame: Node; // 开始按钮
    @property(Node) ndPetButton: Node; // 宠物选择按钮
    @property(Node) ndPetPanel: Node; // 宠物选择面板
    @property(Label) prepareMoneyLabel: Label; // 准备页面的金钱标签
    @property(Label) LevelLabel: Label; // 等级标签

    protected onLoad(): void {
        GameContext.prepareMoneyLabel = this.prepareMoneyLabel;
    }

    protected onEnable(): void {
        GameContext.GameScene = Constant.GameScene.Prepare;
        Util.changeMoney(0);
        this.LevelLabel.string = 'Lv: ' + GameContext.playerLevel[GameContext.selectedPlayerId].level;

        ButtonEvent.setButtonEvent(this.ndBtnSettingButton, 'Setting', this.ndSettingPanel); // 设置按钮点击事件
        ButtonEvent.setButtonKeyEvent(this.ndBtnSettingButton, 'Setting', this.ndSettingPanel); // 商店按钮点击事件
        ButtonEvent.setButtonEvent(this.ndBtnShopButton, 'Pet', this.ndShopPanel); // 商店按钮点击事件
        ButtonEvent.setButtonEvent(this.ndBtnBack, 'Back'); // 返回按钮点击事件
        ButtonEvent.setButtonEvent(this.ndPetButton, 'Pet', this.ndPetPanel); // 宠物选择按钮点击事件
    }
    start() {
        Util.loadPlayerAvatar(this.ndPlayerMessage);
        this.ndBtnStartGame.getComponent(NormalButton).onClick(() => {
            if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
            AudioManager.Instance.playSound('sounds/open', 1);
            this.startGame();
        })

        this.ndBtnStartGame.getComponent(NormalButton).onKeySpace(() => {
            if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
            AudioManager.Instance.playSound('sounds/open', 1);
            this.startGame();
        })
    }

    update(deltaTime: number) {
        
    }

    private startGame() {
        GameContext.selectedLevelId = this.ndLevelPanel.getComponent(CharPanel).currIndex;
        // AudioManager.Instance.stopMusic();
        director.loadScene(Constant.GameScene.Game)
    }
}


