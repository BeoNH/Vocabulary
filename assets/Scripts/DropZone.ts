import { _decorator, CCString, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DropZone')
export class DropZone extends Component {

    @property({type: Node,tooltip: "Vùng kết nối" })
    public zoneWPos: Node = null; 

    @property({tooltip: "Tên vùng được thả" })
    public zoneId: string = ''; 

    public doneZone: boolean = false;

}


