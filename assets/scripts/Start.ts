import { _decorator, Component, director, Label, Node, tween } from 'cc';
import { Globals } from './Globals';
import { ProgressBar } from './ProgressBar';
import { NormalButton } from './NormalButton';
import { CharPanel } from './CharPanel';
import { GameContext } from './GameContext';
import { Constant } from './Constant';
import { ButtonEvent } from './ButtonEvent';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {
    @property(Node) ndButtonStartGame: Node;
    @property(Node) ndBar: Node;
    @property(Node) ndCharPanel: Node;
    @property(Node) ndListPanel: Node;
    @property(Node) ndBtnList: Node;
    @property(Label) ndTips: Label;
    // @property(Node) ndPlayerMessage: Node; // 角色相关信息
    // private isFirstLoad: boolean = true; // 是否是第一次加载
    protected onEnable(): void {
        
        GameContext.GameScene = Constant.GameScene.Start;

        ButtonEvent.setButtonEvent(this.ndBtnList, 'Setting', this.ndListPanel); // 设置按钮点击事件
        
    }

    start() {
        // console.log(this.isFirstLoad);
        
        if (GameContext.isFirstLoad) {
            GameContext.isFirstLoad = false;
            this.ndTips.string = '请等待游戏加载...';
        
            Globals.init().then(() => {
                this.scheduleOnce(() => {
                    // AudioManager.Instance.musicVolume = GameContext.GameSound;
                    this.ndButtonStartGame.active = true;
                    this.ndCharPanel.active = true;
                    this.ndBtnList.active = true;
                    this.ndBar.active = false;
                    this.ndTips.string = '按下A/D键切换角色，空格键开始游戏';

                    this.ndButtonStartGame.getComponent(NormalButton).onClick(() => {
                        this.startGame();
                    })

                    this.ndButtonStartGame.getComponent(NormalButton).onKeySpace(() => {
                        this.startGame();
                    })

                }, 1.1);
                // const ndBar = this.node.getChildByName('LoadingBar');
                let prgs = 0;
                this.ndBar.getComponent(ProgressBar).setProgress(prgs);
                let ac = tween(this.ndBar)
                    .delay(0.1)
                    .call(() => {
                        prgs += 0.1;
                        this.ndBar.getComponent(ProgressBar).setProgress(prgs);
                    });
                tween(this.ndBar).repeat(10, ac).start();
            })
        } else {
            // AudioManager.Instance.musicVolume = GameContext.GameSound;
            this.ndButtonStartGame.active = true;
            this.ndCharPanel.active = true;
            this.ndBtnList.active = true;
            this.ndBar.active = false;
            this.ndTips.string = '按下A/D键切换角色，空格键开始游戏';
            this.ndButtonStartGame.getComponent(NormalButton).onClick(() => {
                this.startGame();
            })
            this.ndButtonStartGame.getComponent(NormalButton).onKeySpace(() => {
                this.startGame();
                // this.choiceLevel();
            })
        }
        
    }

    update(deltaTime: number) {
        
    }


    private startGame () {
        if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
        AudioManager.Instance.playSound('sounds/open', 1);
        GameContext.selectedPlayerId = this.ndCharPanel.getComponent(CharPanel).currIndex;
        director.loadScene('Prepare');
        // director.loadScene('Game')
    }
}


