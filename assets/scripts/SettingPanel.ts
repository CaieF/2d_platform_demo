import { _decorator, Component, EventTouch, Node, UITransform, Vec3 } from 'cc';
import { Util } from './Util';
import { ButtonEvent } from './ButtonEvent';
import { SoundBar } from './SoundBar';
const { ccclass, property } = _decorator;

@ccclass('SettingPanel')
export class SettingPanel extends Component {
    // @property(Node) ndButton: Node;
    @property(Node) ndSoundBar: Node; // 音量条
    @property(Node) ndCancelButton: Node=null; // 取消按钮
    @property(Node) ndOKButton: Node=null; // 确定按钮
    @property(Node) ndHomeButton: Node; // 返回按钮
    @property(Node) ndReloadButton: Node; // 重新开始按钮
    @property(Node) ndNoSoundButton: Node; // 关闭音效按钮
    @property(Node) ndMaxSoundButton: Node; // 开启音效按钮

    protected onEnable(): void {
        ButtonEvent.setButtonEvent(this.ndOKButton, 'OK', this.node); // 确定按钮点击事件
        ButtonEvent.setButtonEvent(this.ndCancelButton, 'OK', this.node); // 取消按钮点击事件
        ButtonEvent.setButtonEvent(this.ndHomeButton, 'Home'); // 返回按钮点击事件
        ButtonEvent.setButtonEvent(this.ndReloadButton, 'Reload'); // 重新开始按钮点击事件
        ButtonEvent.setButtonEvent(this.ndNoSoundButton, 'noSound',null, this.ndSoundBar); // 关闭音效按钮点击事件
        ButtonEvent.setButtonEvent(this.ndMaxSoundButton, 'maxSound',null, this.ndSoundBar); // 开启音效按钮点击事件


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

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }

    protected onDisable(): void {
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
}


