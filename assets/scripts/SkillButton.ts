import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Label, Node, Sprite } from 'cc';
import { GameContext } from './GameContext';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

@ccclass('SkillButton')
export class SkillButton extends Component {
    @property(Node) ndText: Node; // 冷却时间文本
    @property(Node) ndIcon: Node; // 技能按钮
    @property(Node) ndBG: Node; // 技能面板
    @property(Node) ndLabel: Node; // 技能按键名

    private _isAvaliable: boolean = true; // 是否灰度渲染
    private _coldDownTime: number = 3; // 冷却时间
    private _isColding: boolean = false; // 是否在冷却中
    private _currentColdTime: number = 0; // 当前冷却时间
    private _listener: Function;
    private _target: any;
    private _Skill0Cb: Function;
    private _KeyTarget: any;
    private _Skill1Cb: Function;
    private _Skill2Cb: Function;
    private _Skill3Cb: Function;

    public get coldDownTime(): number {
        return this._coldDownTime;
    }

    public set coldDownTime(value: number) {
        value = value >= 0 ? value : 0;
        this._coldDownTime = value;
    }

    public set isAvaliable(value: boolean) {
        this._isAvaliable = value;
        this.node.getComponentsInChildren(Sprite).forEach(sprite => {
            sprite.grayscale = !value; // 灰度渲染
        })
    }

    public get isAvaliable(): boolean {
        return this._isAvaliable;
    }

    protected onEnable(): void {
        this.ndBG.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.ndBG.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        // this.ndBG.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        this.ndBG.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.ndBG.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }

    update(deltaTime: number) {
        if (this._isColding) {
            this._currentColdTime -= deltaTime;

            this.ndText.getComponent(Label).string = `${this._currentColdTime.toFixed(1)}`;

            if (this._currentColdTime <= 0) {
                this._currentColdTime = 0;
                this._isColding = false;
                this.isAvaliable = true;
                this.ndText.active = false;
            }
        }
    }

    onClick(listener: Function, target?: any){
        this._listener = listener;
        this._target = target;
    }

    onTouchStart() {
        if (!this._isAvaliable) { return; }
        this._listener && this._listener.apply(this._target);
    }
    onTouchEnd() {
        if (!this._isAvaliable) { return; }
        this.StartColdDown();
    }

    onKeyDown(event: EventKeyboard) {
        if (GameContext.GameStatus === Constant.GameStatus.PAUSE) { return; }
        if (GameContext.player.playerStatus !== Constant.CharStatus.IDLE && GameContext.player.playerStatus !== Constant.CharStatus.RUN &&  GameContext.player.playerStatus !== Constant.CharStatus.JUMP) return;
        if (!this.isAvaliable) { return; }
        switch (event.keyCode) {
            case KeyCode.KEY_U:
                this._Skill0Cb && this._Skill0Cb.apply(this._KeyTarget);
                if (this._Skill0Cb) {
                    this.StartColdDown();
                }
                break;
            case KeyCode.KEY_I:
                this._Skill1Cb && this._Skill1Cb.apply(this._KeyTarget);
                if (this._Skill1Cb) {
                    this.StartColdDown();
                }
                break;
            case KeyCode.KEY_O:
                this._Skill2Cb && this._Skill2Cb.apply(this._KeyTarget);
                if (this._Skill2Cb) {
                    this.StartColdDown();
                }
                break;
            case KeyCode.KEY_L:
                this._Skill3Cb && this._Skill3Cb.apply(this._KeyTarget);
                if (this._Skill3Cb) {
                    this.StartColdDown();
                }
                break;
            default:
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (!this.isAvaliable) { return; }
        switch (event.keyCode) {
            case KeyCode.KEY_U:
                
                break;
            default:
                break;
        }
    }

    // 注册键盘事件
    onKeyU(cb: Function, target?: any) {
        this._Skill0Cb = cb;
        this._KeyTarget = target;
    }

    onKeyI(cb: Function, target?: any) {
        this._Skill1Cb = cb;
        this._KeyTarget = target;
    }

    onKeyO(cb: Function, target?: any) {
        this._Skill2Cb = cb;
        this._KeyTarget = target;
    }

    onKeyL(cb: Function, target?: any) {
        this._Skill3Cb = cb;
        this._KeyTarget = target;
    }


    StartColdDown() {
        this._currentColdTime = this._coldDownTime;
        if (this._coldDownTime > 0) {
            this._isColding = true;
            this.isAvaliable = false;
            this.ndText.active = true;
            this.ndText.getComponent(Label).string = `${this._currentColdTime.toFixed(1)}`;
        } else {
            this._isColding = false;
            this.isAvaliable = true;
            this.ndText.active = false;
        }
    }
}


