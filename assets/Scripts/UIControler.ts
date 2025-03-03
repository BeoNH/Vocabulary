import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIControler')
export class UIControler extends Component {
    public static instance: UIControler = null;

    @property({ type: Node, tooltip: "Sang Phase mới" })
    private popupNextPhase: Node = null;
    @property({ type: Node, tooltip: "Xong game" })
    private popupGameOver: Node = null;
    @property({ type: Node, tooltip: "Thoát game" })
    private popupOutGame: Node = null;;

    // @property({ type: Node, tooltip: "UI Mẫ lỗi Login" })
    // private popupErroLogin: Node = null;

    private isCallBack: Function = null;

    protected onLoad(): void {
        UIControler.instance = this;
        this.onClose();
    }

    onOpen(e, str: string, cb?: Function) {
        switch (str) {
            case `next`:
                this.popupNextPhase.active = true;
                this.isCallBack = cb;
                break;
            case `over`:
                this.popupGameOver.active = true;
                break;
            case `out`:
                this.popupOutGame.active = true;
                break;
        }
    }

    onClose() {
        this.popupNextPhase.active = false;
        this.popupGameOver.active = false;
        this.popupOutGame.active = false;
    }

    onTrue() {
        if(this.isCallBack){
            this.isCallBack();
            this.isCallBack = null;
        }
    }

    // onMess(txt: string) {
    //     this.popupErroLogin.active = true;
    //     this.popupErroLogin.getChildByPath(`txt`).getComponent(Label).string = txt;
    //     this.scheduleOnce(() => {
    //         this.popupErroLogin.active = false;
    //     }, 2)
    // }
}


