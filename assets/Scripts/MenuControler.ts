import { _decorator, Component, Label, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('MenuControler')
export class MenuControler extends Component {
    @property({ type: Label, tooltip: "Tên Chủ đề" })
    public labelToppic: Label = null;
    @property({ type: Node, tooltip: "Ảnh theo chủ đề" })
    public listImageToppic: Node = null;

    private numToppic: number = 0; // chỉ số chủ đề đang được hiển thị

    protected onLoad(): void {
        this.updateTopicDisplay();
    }

    // Chuyển vòng các chủ đề
    onNextToppic(e, txt: string) {
        switch (txt) {
            case "Right":
                this.numToppic += 1;
                break;
            case "Left":
                this.numToppic -= 1;
                break;
        }


        const topicsLength = GameManager.Toppic.length;
        if (this.numToppic >= topicsLength) {
            this.numToppic = 0;
        } else if (this.numToppic < 0) {
            this.numToppic = topicsLength - 1;
        }

        this.updateTopicDisplay();
    }

    // Hàm cập nhật giao diện chủ đề và hình ảnh
    private updateTopicDisplay() {
        this.labelToppic.string = GameManager.Toppic[this.numToppic];
        this.listImageToppic.children.forEach((child, index) => {
            child.active = (index === this.numToppic);
        });
    }
}


