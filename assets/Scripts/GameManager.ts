import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // data mẫu
    public static data = [`Red`, `Black`, `Yellow`,`Brown`,`Green`,`Pink`]
}


