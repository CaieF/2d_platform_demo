import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node, Sprite } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('NormalButton')
export class NormalButton extends Component {
    private _cb: Function;
    private _target: any;

    private _isActivated: boolean = true; // 是否激活
    private _KeyTarget: any;
    private _LeftCb: Function;
    private _RightCb: Function;
    private _SpaceCb: Function;
    private _EscCb: Function;

    public get isActivated(): boolean {
        return this._isActivated;
    }

    public set isActivated(value: boolean) {
        this._isActivated = value;

        // this.node.getComponentsInChildren(Sprite).forEach((s: Sprite) => {
        //     s.grayscale = !value;
        // })
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMousDown, this);
        this.node.on(Node.EventType.MOUSE_UP, this.onMouseUp, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.MOUSE_DOWN, this.onMousDown, this);
        this.node.off(Node.EventType.MOUSE_UP, this.onMouseUp, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    onMousDown() {
        if (!this.isActivated) return;
        // AudioManager.Instance.playSound('sounds/drop', 1);
        this.node.setScale(0.95, 0.95);
    }

    onMouseUp() {
        if (!this.isActivated) return;

        this.node.setScale(1, 1);
        this._cb && this._cb.apply(this._target)
    }

    onKeyDown(event: EventKeyboard) {
        if (!this.isActivated) return;
        // event.propagationStopped = true;
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                // AudioManager.Instance.playSound('sounds/drop', 1);
                this._LeftCb && this.node.setScale(0.95, 0.95);
                break;
            case KeyCode.KEY_D:
                // AudioManager.Instance.playSound('sounds/drop', 1);
                this._RightCb && this.node.setScale(0.95, 0.95);
                break;
            case KeyCode.SPACE:
                // AudioManager.Instance.playSound('sounds/drop', 1);
                this._SpaceCb && this.node.setScale(0.95, 0.95);
                break;
            case KeyCode.ESCAPE:
                // AudioManager.Instance.playSound('sounds/drop', 1);
                this._EscCb && this.node.setScale(0.95, 0.95);
                break;
            default:
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (!this.isActivated) return;
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.node.setScale(1, 1);
                this._LeftCb && this._LeftCb.apply(this._KeyTarget);
                break;
            case KeyCode.KEY_D:
                this.node.setScale(1, 1);
                this._RightCb && this._RightCb.apply(this._KeyTarget);
                break;
            case KeyCode.SPACE:
                this.node.setScale(1, 1);
                this._SpaceCb && this._SpaceCb.apply(this._KeyTarget);
                break;
            case KeyCode.ESCAPE:
                this.node.setScale(1, 1);
                this._EscCb && this._EscCb.apply(this._KeyTarget);
            default:
                break;
        }
    }

    // 注册点击事件
    onClick(cb: Function, target?: any) {
        this._cb = cb;
        this._target = target;
    }
    // 注册键盘事件

    // a键
    onKeyLeft(cb: Function, target?: any) {
        this._LeftCb = cb;
        this._KeyTarget = target;
    }

    // d键
    onKeyRight(cb: Function, target?: any) {
        this._RightCb = cb;
        this._KeyTarget = target;
    }

    // 空格键
    onKeySpace(cb: Function, target?: any) {
        this._SpaceCb = cb;
        this._KeyTarget = target;
    }

    // esc键
    onKeyEsc(cb: Function, target?: any) {
        this._EscCb = cb;
        this._KeyTarget = target;
    }

}


