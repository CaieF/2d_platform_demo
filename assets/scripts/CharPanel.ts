import { _decorator, clamp, Component, KeyCode, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
import { NormalButton } from './NormalButton';
import { Constant } from './Constant';
import { AxInput } from './AxInput';
import { GameContext } from './GameContext';
const { ccclass, property } = _decorator;
const axInput = AxInput.instance;

@ccclass('CharPanel')
export class CharPanel extends Component {
    @property(Node) ndBtnLeft: Node;
    @property(Node) ndBtnRight: Node;
    @property(Node) ndChars: Node;
    @property(Number) MoveDistance: number;
    private _currIndex: number = 0; // 当前选择索引
    private _opacity: number = 0;
    public get currIndex(): number {
        return this._currIndex;
    }


    protected onEnable(): void {
        this.ndBtnLeft.getComponent(NormalButton).isActivated = true;
        this.ndBtnRight.getComponent(NormalButton).isActivated = true;

        this.ndBtnLeft.getComponent(NormalButton).onClick(() => {
            if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
            this.moveLeft();
            this.updateCharItemState();
        });

        this.ndBtnLeft.getComponent(NormalButton).onKeyLeft(() => {
            if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
            this.moveLeft();
            this.updateCharItemState();
        })

        this.ndBtnRight.getComponent(NormalButton).onClick(() => {
            if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
            this.moveRight();
            this.updateCharItemState();
        });

        this.ndBtnRight.getComponent(NormalButton).onKeyRight(() => {
            if (GameContext.GameStatus === Constant.GameStatus.PAUSE) return;
            this.moveRight();
            this.updateCharItemState();
        })

        if (GameContext.GameScene === Constant.GameScene.Start) {
            this._opacity = 80;
            this.gotoIndex(GameContext.selectedPlayerId);
        } else if (GameContext.GameScene === Constant.GameScene.Prepare) {
            this._opacity = 0;
            this.gotoIndex(0);
        }
        this.updateCharItemState();
    }
    start() {

    }

    update(deltaTime: number) {
        // if (axInput.is_action_just_pressed(KeyCode.KEY_W) || axInput.is_action_just_pressed) {}
    }

    gotoIndex(index: number) {
        index = clamp(index, 0, this.ndChars.children.length - 1);
        this._currIndex = index;
        
        const pos = new Vec3();
        for (let i = 0; i < this.ndChars.children.length; i++) {
            const child = this.ndChars.children[i];
            child.getPosition(pos);
            if (i < index) {
                pos.x = -this.MoveDistance * (index - i);
            } else if (i > index) {
                pos.x = this.MoveDistance * (i - index);
            } else {
                pos.x = 0;
            }
            this.ndChars.children[i].setPosition(pos);
        }

        this.updateCharItemState();
    }

    updateCharItemState(){
        for (let i = 0; i < this.ndChars.children.length; i++) {
            this.ndChars.children[i].getComponent(UIOpacity).opacity = i === this._currIndex ? 255 : this._opacity;
        }

        this.ndBtnLeft.active = this._currIndex > 0;
        this.ndBtnRight.active = this._currIndex < this.ndChars.children.length - 1;
    }

    moveNext(isNext: boolean) {
        const len = this.ndChars.children.length;
        isNext ? this._currIndex++ : this._currIndex--;
        if (this._currIndex >= len) {
            this._currIndex = len - 1;
            return;
        } else if (this._currIndex < 0) {
            this._currIndex = 0;
            return;
        }

        this.ndBtnLeft.getComponent(NormalButton).isActivated = false;
        this.ndBtnRight.getComponent(NormalButton).isActivated = false;

        const actions: Promise<any>[] = [];
        for (let i = 0; i < len; i++) {
            const child = this.ndChars.children[i];
            const pos = child.getPosition();
            actions.push(new Promise((resolve) => {
                tween(child)
                .to(0.3, { position: pos.add3f(isNext?-this.MoveDistance:this.MoveDistance, 0, 0) }, { easing: 'expoOut' })
                .call(() => {
                    resolve(0);
                })
                .start();
            }));
        }

        Promise.all(actions).then(() => {
            this.ndBtnLeft.getComponent(NormalButton).isActivated = true;
            this.ndBtnRight.getComponent(NormalButton).isActivated = true;
        })
    }

    moveRight() {
        this.moveNext(true);
    }

    moveLeft() {
        this.moveNext(false);
    }
}


