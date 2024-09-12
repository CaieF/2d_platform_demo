import { _decorator, Component, director, Label, Node, tween } from 'cc';
import { Globals } from './Globals';
import { ProgressBar } from './ProgressBar';
import { NormalButton } from './NormalButton';
import { CharPanel } from './CharPanel';
import { GameContext } from './GameContext';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {
    @property(Node) ndButtonStartGame: Node;
    @property(Node) ndBar: Node;
    @property(Node) ndCharPanel: Node;
    @property(Label) ndTips: Label;

    start() {
        this.ndTips.string = '请等待游戏加载...';
        
        Globals.init().then(() => {
            this.scheduleOnce(() => {
                this.ndButtonStartGame.active = true;
                this.ndCharPanel.active = true;
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
    }

    update(deltaTime: number) {
        
    }

    private startGame () {
        GameContext.selectedPlayerId = this.ndCharPanel.getComponent(CharPanel).currIndex;
        director.loadScene('Game');
    }
}


