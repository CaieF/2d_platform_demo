import { _decorator, Component, EventTouch, Label, Node, UITransform, Vec3 } from 'cc';
import { ProgressBar } from './ProgressBar';
import { GameContext } from './GameContext';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SoundBar')
export class SoundBar extends Component {
    @property (Label) ndLabel: Label = null;
    // isSound: boolean = true; // 是否开启声音

    static readonly Event = {
        NOSOUND: 0,
        SOUND: 1
    }
    private _onEvent: Function;
    private _target: any;

    protected onEnable(): void {
        if (GameContext.isSound) {
            this.updateVolumeLabel(GameContext.GameSound);
        } else {
            this.updateVolumeLabel(0);
        }

        

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
    onTouchStart(event: EventTouch) {
        this.updateVolume(event);
    }
    onTouchMove(event: EventTouch) {
        
        this.updateVolume(event);
    }
    onTouchEnd() {
    }
    onTouchCancel() {
    }

    private updateVolume(event: EventTouch) {
        // const v2 = event.getUIStartLocation();
        const v2 = event.getUILocation();
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2.x, v2.y));

        if (pos.x < -43 || pos.x > 43) {
            return;
        } else {
            let sound = (pos.x + 40) / 80;
            if (sound > 1) {
                sound = 1
            } else if (sound < 0) {
                sound = 0
            }
            this.updateVolumeLabel(sound);
        }
    }

    updateVolumeLabel(value: number) {
        if (value > 0) {
            GameContext.isSound = true;
            this._onEvent && this._onEvent.apply(this._target, [SoundBar.Event.SOUND])
        } else if (value === 0) {
            GameContext.isSound = false;
            this._onEvent && this._onEvent.apply(this._target, [SoundBar.Event.NOSOUND])
        }
        this.node.getComponent(ProgressBar).setProgress(value);
        this.ndLabel.string = '音量：  ' + (value * 100).toFixed(0) + '%';
        // GameContext.AudioSource.volume = value;
        AudioManager.Instance.musicVolume = value;
        if (value !== 0) GameContext.GameSound = value;
    }

    // 注册角色事件
    onSoundEvent(onEvent: Function, target?: any) {
        this._onEvent = onEvent;
        this._target = target;
    }
}


