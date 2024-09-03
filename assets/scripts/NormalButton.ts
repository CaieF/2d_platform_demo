import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NormalButton')
export class NormalButton extends Component {
    private _cb: Function;
    private _target: any;

    private _isActivated: boolean = true; // 是否激活

    public get isActivated(): boolean {
        return this._isActivated;
    }

    public set isActivated(value: boolean) {
        this._isActivated = value;

        this.node.getComponentsInChildren(Sprite).forEach((s: Sprite) => {
            s.grayscale = !value;
        })
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.MOUSE_DOWN, this.onTouchStart, this);
        this.node.on(Node.EventType.MOUSE_UP, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.MOUSE_DOWN, this.onTouchStart, this);
        this.node.off(Node.EventType.MOUSE_UP, this.onTouchEnd, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    onTouchStart() {
        if (!this.isActivated) return;

        this.node.setScale(0.98, 0.98);
    }

    onTouchEnd() {
        if (!this.isActivated) return;

        this.node.setScale(1, 1);
        this._cb && this._cb.apply(this._target)
    }

    // 注册点击事件
    onClick(cb: Function, target?: any) {
        this._cb = cb;
        this._target = target;
    }
}


