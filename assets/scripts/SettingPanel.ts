import { _decorator, Component, director, EventTouch, Label, Node, UITransform, Vec3 } from 'cc';
import { ButtonEvent } from './ButtonEvent';
import { SoundBar } from './SoundBar';
import { Util } from './Util';
import { GameContext } from './GameContext';
import { Constant } from './Constant';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SettingPanel')
export class SettingPanel extends Component {
    // @property(Node) ndButton: Node;
    @property(Node) ndSoundBar: Node=null; // 音量条
    @property(Node) ndCancelButton: Node=null; // 取消按钮
    @property(Node) ndOKButton: Node=null; // 确定按钮
    @property(Node) ndHomeButton: Node=null; // 返回按钮
    @property(Node) ndReloadButton: Node=null; // 重新开始按钮
    @property(Node) ndNoSoundButton: Node=null; // 关闭音效按钮
    @property(Node) ndMaxSoundButton: Node=null; // 开启音效按钮
    @property(Node) ndTimer: Node=null; // 计时器
    @property(Node) ndNextButton: Node=null; // 下一步按钮
    Timer: number = 0;
    SetTimer: number = 30;
    timerInterval = null; // 定时器

    protected onLoad(): void {
        this.SetTimer = 30;
        this.Timer = 0;
    }

    protected onEnable(): void {
        if (this.node.active === true && this.ndNextButton) {
            this.ndNextButton.active = GameContext.selectedLevelId < GameContext.levels.length - 1;
        }

        ButtonEvent.setButtonEvent(this.ndNextButton, 'Next', null, null); // 下一步按钮点击事件
        ButtonEvent.setButtonEvent(this.ndOKButton, 'OK', this.node); // 确定按钮点击事件
        ButtonEvent.setButtonEvent(this.ndCancelButton, 'OK', this.node); // 取消按钮点击事件
        ButtonEvent.setButtonEvent(this.ndHomeButton, 'Home', null, null); // 返回按钮点击事件
        ButtonEvent.setButtonEvent(this.ndReloadButton, 'Reload', null, null); // 重新开始按钮点击事件
        ButtonEvent.setButtonEvent(this.ndNoSoundButton, 'noSound',null, this.ndSoundBar); // 关闭音效按钮点击事件
        ButtonEvent.setButtonEvent(this.ndMaxSoundButton, 'maxSound',null, this.ndSoundBar); // 开启音效按钮点击事件

        if (this.ndSoundBar) {
            this.ndSoundBar.getComponent(SoundBar).onSoundEvent((event: number) => {
                switch (event) {
                    case SoundBar.Event.SOUND:
                        this.ndMaxSoundButton.active = true;
                        this.ndNoSoundButton.active = false;
                        break;
                    case SoundBar.Event.NOSOUND:
                        this.ndMaxSoundButton.active = false;
                        this.ndNoSoundButton.active = true;
                        break;
                    default:
                        break;
                }
                
            })
        }
        

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }

    protected onDisable(): void {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }
    start() {

    }

    update(deltaTime: number) {
        
    }


    onTouchStart(event: EventTouch) {
        const v2 = event.getUIStartLocation();
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2.x, v2.y));

        if (pos.x < -62.5 || pos.x > 62.5) {
            return;
            // this.node.active = false;
        }
    }
    onTouchEnd() {
    }
    onTouchCancel() {
    }

    public onPlayerDeath() {
        if (this.ndTimer) {
            this.SetTimer = 30;
            this.Timer = 0;
            this.startTime();
        }
    }

    private startTime() {
        if (this.ndTimer) {
            const label =  this.ndTimer.getComponent(Label);
            label.string = this.SetTimer.toString() + 's';

            this.timerInterval = setInterval(() => {
                this.Timer += 1; // 每秒增加 Timer
    
                if (this.SetTimer > 0) {
                    this.SetTimer -= 1; // 减少 SetTimer
                    const label = this.ndTimer.getComponent(Label);
                    label.string = this.SetTimer.toString() + 's';
                }
    
                // 如果时间到了，处理超时逻辑
                if (this.SetTimer <= 0) {
                    clearInterval(this.timerInterval);
                    ButtonEvent.getHome();
                }
            }, 1000); // 每秒执行一次
        }
    }
}


