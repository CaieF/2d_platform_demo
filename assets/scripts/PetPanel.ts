import { _decorator, color, Component, dragonBones, JsonAsset, Label, math, Node, resources } from 'cc';
import { CharData } from './CharData';
import { ResUtil } from './ResUtil';
import { NormalButton } from './NormalButton';
import { GameContext } from './GameContext';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('PetPanel')
export class PetPanel extends Component {

    @property(Node) content: Node = null;
    // @property(Node) PetMessage: Node = null;
    @property(Label) PetName: Label = null;
    @property(Label) PetLevel: Label = null;
    @property(Node) PetAnim: Node = null;
    @property(Label) PetHp: Label = null;
    @property(Label) PetAp: Label = null;
    @property(Label) PetSpeed: Label = null;
    @property(Label) PetType: Label = null;
    @property(Node) ndBtnFight: Node = null; // 出战按钮
    @property(Node) ndBtnRest: Node = null; // 休息按钮
    private currentIndex: number = -1; // 当前点击的索引

    protected onEnable(): void {
        if (GameContext.selectedPetId !== -1) {
            this.content.children[GameContext.selectedPetId].getComponent(Label).string = CharData.petConfig[GameContext.selectedPetId].name;
            this.clickItems(null, JSON.stringify(GameContext.selectedPetId + 1))
            this.content.children[GameContext.selectedPetId].getComponent(Label).string += '(出战)';

        }


        this.ndBtnFight.getComponent(NormalButton).onClick(() => {
            AudioManager.Instance.playSound('sounds/open');
            if (GameContext.selectedPetId === this.currentIndex || this.currentIndex === -1) {
                return;
            }
            if (GameContext.selectedPetId !== -1) {
                this.content.children[GameContext.selectedPetId].getComponent(Label).string = CharData.petConfig[GameContext.selectedPetId].name;
            }

            GameContext.selectedPetId = this.currentIndex;
            
            this.content.children[this.currentIndex].getComponent(Label).string += '(出战)';
            // console.log(GameContext.selectedPetId);
            
        })

        this.ndBtnRest.getComponent(NormalButton).onClick(() => {
            AudioManager.Instance.playSound('sounds/drop');
            if (GameContext.selectedPetId === -1 || this.currentIndex === -1) {
                return;
            }
            if (GameContext.selectedPetId !== this.currentIndex) {
                return;
            }
            if (GameContext.selectedPetId === this.currentIndex) {
                this.content.children[GameContext.selectedPetId].getComponent(Label).string = CharData.petConfig[GameContext.selectedPetId].name;
            }
            
            GameContext.selectedPetId = -1;
            console.log(GameContext.selectedPetId);
        })
    }

    async clickItems(event: Event, index: string) {
        const ind = parseInt(index) - 1;
        AudioManager.Instance.playSound('sounds/drop')
        if (this.currentIndex === ind) {
            return;
        }
        this.currentIndex = ind;
        const petData = CharData.petConfig[ind];
        const display = this.PetAnim.getComponent(dragonBones.ArmatureDisplay);
        // 将所有子节点的颜色设置为黑色
        for (let i = 0; i < this.content.children.length; i++) {
            const label = this.content.children[i].getComponent(Label);
            if (label) {
                label.color = math.color(0, 0, 0, 255); // 设置为黑色
            }
        }
        console.log(petData);
        

        await ResUtil.loadJson(petData.DragonAssetPath).then((res) => {
            display.dragonAsset = res;
        }).catch((err) => {
            console.log(err);
        });
        await ResUtil.loadJson(petData.DragonAtlasAssetPath).then((res) => {
            display.dragonAtlasAsset = res;
        }).catch((err) => {
            console.log(err);
        });

        display.armatureName = 'Idle';
        display.playAnimation('Idle', 0);

        this.PetName.string = petData.name;
        this.PetLevel.string = 'lv:' + petData.lv;
        this.PetHp.string = '生命值:' + petData.hp;
        this.PetAp.string = '攻击力:' + petData.ap;
        this.PetSpeed.string = '速度:' + petData.speed;
        this.PetType.string = '宠物类型:' + petData.petType;
        let label = this.content.children[ind].getComponent(Label)
        label.color = math.color(255, 255, 255,255);
    }
    start() {
        
    }

    update(deltaTime: number) {
        
    }
}


