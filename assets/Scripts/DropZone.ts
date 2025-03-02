import { _decorator, CCString, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DropZone')
export class DropZone extends Component {

    @property({type: Node,tooltip: "Vùng kết nối" })
    public zoneWPos: Node = null;
    
    @property({type: Node,tooltip: "Hình ảnh đung sai" })
    public checkBox: Node = null; 

    @property({tooltip: "Tên vùng được thả" })
    public zoneId: string = ''; 

    public isCorrectDrop: boolean = false;

    public validDrop(){
        this.isCorrectDrop = true;
        this.checkBox.getChildByPath(`true`).active = this.isCorrectDrop;
        this.checkBox.getChildByPath(`false`).active = !this.isCorrectDrop;
    }
}


