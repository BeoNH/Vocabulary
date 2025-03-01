import { _decorator, Component, Label, Node } from 'cc';
import { Game_Vocabulary } from './Game_Vocabulary';
const { ccclass, property } = _decorator;

@ccclass('GameControler')
export class GameControler extends Component {
    public static Instance: GameControler;

    @property({ type: Node, tooltip: "scene gamePlay" })
    private scenePlay: Node = null;
    @property({ type: Node, tooltip: "scene menu" })
    private sceneMenu: Node = null;

    // @property({ type: Label, tooltip: "hiển thị số lượt chơi" })
    // private labelTurn: Label = null;

    private numTurn: number = 0; // số lượt chơi

    onLoad() {
        GameControler.Instance = this;
        window.addEventListener("beforeunload", this.onBeforeUnload);

        this.sceneMenu.active = true;
        this.scenePlay.active = false;
    }

    onDestroy() {
        window.removeEventListener("beforeunload", this.onBeforeUnload);
    }

    // Kiểm tra đóng cửa sổ game
    private onBeforeUnload = (event: Event) => {
        console.log("Người chơi đang đóng cửa sổ hoặc làm mới trang.");
    }

    openMenu() {
        this.sceneMenu.active = true;
        this.scenePlay.active = false;
    }

    openGame() {
        this.sceneMenu.active = false;
        this.scenePlay.active = true;
        Game_Vocabulary.Instance.initGame();
    }
}


