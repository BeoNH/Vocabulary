import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // data mẫu
    public static Toppic = [`Animals`,`Fruits`,`Vehicle`];
    
    public static data = [`Red`, `Black`, `Yellow`,`Brown`,`Green`,`Pink`];

    public static defuseScore = 1000; // Điểm mặc định 2 vòng cuối
    public static defuseTime = 15; // Thời gian mặc định 1 câu hỏi

    public static plusScore: number = 100;
    public static wrongScore: number = -50;
    public static openHint: number = -10;

}


