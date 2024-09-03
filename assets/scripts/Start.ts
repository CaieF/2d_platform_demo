import { _decorator, Component, director, Node, tween } from 'cc';
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

    start() {
        Globals.init().then(() => {
            this.scheduleOnce(() => {
                this.ndButtonStartGame.active = true;
                this.ndCharPanel.active = true;
                this.ndBar.active = false;
                
                
                this.ndButtonStartGame.getComponent(NormalButton).onClick(() => {
                    GameContext.selectedPlayerId = this.ndCharPanel.getComponent(CharPanel).currIndex;
                console.log('当前选择角色id为', GameContext.selectedPlayerId);
                    director.loadScene('Game');
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
}


