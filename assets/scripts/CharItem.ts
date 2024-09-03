import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CharItem')
export class CharItem extends Component {
    @property(Node) ndAni: Node;
    @property(Node) ndName: Node;
    @property(Node) ndDetail: Node;

    start() {
        
    }

    update(deltaTime: number) {
        
    }
}


