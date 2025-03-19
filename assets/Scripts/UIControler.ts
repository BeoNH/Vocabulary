import { _decorator, Component, Label, Node } from 'cc';
import { PopupRank } from './PopupRank';
import { PopupHistory } from './PopupHistory';
const { ccclass, property } = _decorator;

@ccclass('UIControler')
export class UIControler extends Component {
    public static instance: UIControler = null;

    @property({ type: Node, tooltip: "Luật chơi" })
    private popupInfo: Node = null;
    @property({ type: Node, tooltip: "Bảng xếp hạng" })
    private popupRank: Node = null;
    @property({ type: Node, tooltip: "Lịch sử" })
    private popupHistory: Node = null;

    @property({ type: Node, tooltip: "Sang Phase 2" })
    private popupNextPhase2: Node = null;
    @property({ type: Node, tooltip: "Sang Phase 3" })
    private popupNextPhase3: Node = null;
    @property({ type: Node, tooltip: "Xong game" })
    private popupGameOver: Node = null;
    @property({ type: Node, tooltip: "Thoát game" })
    private popupOutGame: Node = null;;

    @property({ type: Node, tooltip: "UI Mẫ lỗi Login" })
    private alertError: Node = null;

    private isCallBack: Function = null;

    protected onLoad(): void {
        UIControler.instance = this;
        this.onClose();
    }

    onOpen(e: any, str: string, cb?: () => void, num?: number) {
        if (num !== undefined) {
            this.calculateRound(str, num);
        }

        switch (str) {
            case `info`:
                this.popupInfo.active = true;
                break;
            case `rank`:
                this.popupRank.active = true;
                this.popupRank.getComponent(PopupRank).initRankingList();
                break;
            case `history`:
                this.popupHistory.active = true;
                this.popupHistory.getComponent(PopupHistory).initHistoryList();
                break;
            case `nextP2`:
                this.popupNextPhase2.active = true;
                this.isCallBack = cb;
                break;
            case `nextP3`:
                this.popupNextPhase3.active = true;
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
        this.popupInfo.active = false;
        this.popupRank.active = false;
        this.popupHistory.active = false;
        this.popupNextPhase2.active = false;
        this.popupNextPhase3.active = false;
        this.popupGameOver.active = false;
        this.popupOutGame.active = false;
    }

    onTrue() {
        if (this.isCallBack) {
            this.isCallBack();
            this.isCallBack = null;
        }
    }

    private calculateRound(txt: string, num: number) {
        let scoreLabel: Label = null;
        switch (txt) {
            case 'nextP3':
                scoreLabel = this.popupNextPhase3.getChildByPath('content/Score/numScore')?.getComponent(Label);
                break;
            case 'over':
                scoreLabel = this.popupGameOver.getChildByPath('content/Score/numScore')?.getComponent(Label);
                break;
        }
        if (scoreLabel) {
            scoreLabel.string = num.toString();
        }
    }

    onMess(txt: string) {
        this.alertError.active = true;
        this.alertError.getChildByPath(`txt`).getComponent(Label).string = txt;
        this.scheduleOnce(() => {
            this.alertError.active = false;
        }, 1.5)
    }
}


