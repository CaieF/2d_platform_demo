import { _decorator, Component, Label, Node } from 'cc';
import { GameContext } from './GameContext';
import { CharData } from './CharData';
import { AudioManager } from './AudioManager';
import { NormalButton } from './NormalButton';
import { Util } from './Util';
import { StorageManager } from './StorageManager';
const { ccclass, property } = _decorator;

@ccclass('ShopPanel')
export class ShopPanel extends Component {

    @property(Node) GoodsList: Node = null;  // 商品列表
    @property(Node) ndBtnBuy: Node = null;  // 购买按钮
    @property(Label) GoodName: Label = null;  // 商品名称
    @property(Label) GoodEffect: Label = null;  // 商品效果
    @property(Label) Price: Label = null;  // 余额
    private _selectGoodId: number = -1; // 选择商品id

    protected onEnable(): void {
        this.resetSelect();
        let price = ('00000' +  `${GameContext.Money.toString()}`).slice(-5);
        this.setLabel('欢迎来到商店', '请选择要购买的物品', '你的钱币: ' + price);
        
        // 点击购买按钮
        this.ndBtnBuy.getComponent(NormalButton).onClick(() => {
            
            if (GameContext.Money >= CharData.GoodsConfig[this._selectGoodId].price) {
                AudioManager.Instance.playSound('ItemSounds/costCoin');
                Util.changeMoney(-CharData.GoodsConfig[this._selectGoodId].price)
                GameContext.Goods[this._selectGoodId] += 1;
                StorageManager.save('Goods', GameContext.Goods);
                // console.log(GameContext.Goods);
                let price = ('00000' +  `${GameContext.Money.toString()}`).slice(-5);
                this.setLabel('恭喜你购买成功', '点击重新选择', '你的钱币: ' + price);
                this.resetSelect();
            } else {
                AudioManager.Instance.playSound('sounds/drop');
                this.setLabel('你的钱币不足', '请重新选择');
                this.resetSelect();
            }
        })
    }

    clickItem(event: Event, index: string){
        const ind = parseInt(index);
        AudioManager.Instance.playSound('sounds/drop')
        if (ind === this._selectGoodId) return;
        if (this._selectGoodId !== -1) {
            this.GoodsList.children[this._selectGoodId].getChildByName('Select').active = false; // 取消上一个选中
        }
        this._selectGoodId = ind;
        this.GoodsList.children[ind].getChildByName('Select').active = true;
        const goodData = CharData.GoodsConfig[ind];
        this.setLabel('商品名称: ' + goodData.name, '商品效果: ' + goodData.effect);
        this.ndBtnBuy.active = true;
    }

    private resetSelect() {
        if (this._selectGoodId !== -1) this.GoodsList.children[this._selectGoodId].getChildByName('Select').active = false;
        this._selectGoodId = -1;
        this.ndBtnBuy.active = false;
    }

    private setLabel(Label1: string, Label2: string, Label3?: string) {
        this.GoodName.string = Label1;
        this.GoodEffect.string = Label2;
        if (Label3) this.Price.string = Label3;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


