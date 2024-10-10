import { _decorator, clamp, Component, Node, randomRangeInt } from 'cc';
import { GameContext } from './GameContext';
const { ccclass, property } = _decorator;

@ccclass('Camera')
export class Camera extends Component {
    @property(Node) ndView: Node;

    private _isShaking: boolean = false; // 是否震动
    private _duration: number = 0.2; // 震动时间
    private _shakeLevel: number = 5; // 震动幅度
    private _timer:number = 0; // 震动时间计时器
    start() {

    }

    update(deltaTime: number) {
        if (!GameContext.ndPlayer || !GameContext.ndPlayer.isValid) return;

        if (this._isShaking) {
            this._timer += deltaTime;
            if (this._timer >= this._duration) {
                this._isShaking = false;
                this._timer = 0;
            } else {
                // 震动
                let shakeX = randomRangeInt(-this._shakeLevel, this._shakeLevel);
                let shakeY = randomRangeInt(-this._shakeLevel, this._shakeLevel);
                this.node.setWorldPosition(
                    GameContext.ndPlayer.worldPosition.x + shakeX,
                    GameContext.ndPlayer.worldPosition.y + shakeY,
                    this.node.worldPosition.z
                )
            }
        } else {
            this.node.worldPosition = GameContext.ndPlayer.worldPosition;
        }

        
        this.ndView.worldPosition = GameContext.ndPlayer.worldPosition;
        const x = clamp(this.node.position.x, 0, 2304);
        this.node.setPosition(x, 0);
        this.ndView.setPosition(x/2, 0);
        
    }

    shake() {
        this._isShaking = true;
        this._timer = 0;
    }
}


