import { _decorator, Component, Label, Node, resources, SpriteFrame } from 'cc';
import { Game_Vocabulary } from './Game_Vocabulary';
import { GameManager } from './GameManager';
import { MenuControler } from './MenuControler';
import { APIManager } from './API/APIManager';
import { UIControler } from './UIControler';
import { DEBUG } from 'cc/env';
const { ccclass, property } = _decorator;

if (!DEBUG) {
    console.log = function() {};
}


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

        this.loginBatta();
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
        this.remainTurn();
    }

    openGame() {
        if (this.numTurn <= 0) {
            UIControler.instance.onMess(`No turns remaining. \nPlease purchase extra turns to proceed.`);
            return;
        }

        const toppic = GameManager.Toppic[MenuControler.Instance.numToppic];

        const url = `/imageToWord/getQuestion`;
        const data = {
            "type": toppic,
        };
        APIManager.requestData(`POST`, url, data, res => {
            if (!res) {
                UIControler.instance.onMess(`Error: ${url} => ${res}`);
                return;
            }

            this.sceneMenu.active = false;
            this.scenePlay.active = true;
            Game_Vocabulary.Instance.initGame(toppic, res.data);
        });
    }

    // Đăng nhập Batta lấy thông tin
    private loginBatta() {
        const url = `/imageToWord/login`;
        const data = {
            "token": APIManager.urlParam(`token`),
            // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4IiwidXNlcm5hbWUiOiJiZW9uaDEyMyIsImVtYWlsIjoiaG9hbmduZ3V5ZW5oYnNAZ21haWwuY29tIiwiaXNDcmVhdG9ycyI6ZmFsc2UsInJhbmsiOiJCcm9uemUiLCJpYXQiOjE3NDEzMTMyMDIsImV4cCI6MTc0MTMyNDAwMn0.SSoMEmjcDZAN39dBiSLTWXp1jb5mUSPjqOZE95R7agI",
        };
        APIManager.requestData(`POST`, url, data, res => {
            console.log("Login_info: ", res)
            if (!res) {
                UIControler.instance.onMess(`Error: ${url} => ${res}`);
                return;
            }
            APIManager.userDATA = res;
            this.remainTurn();
        });
    }

    // Cập nhật thông tin số lượt
    private remainTurn(callback?: (remainTurn: number) => void): void {
        const url = `/imageToWord/getTurn`;
        const data = {
            "username": APIManager.userDATA?.username,
        };
        APIManager.requestData(`POST`, url, data, res => {
            if (!res) {
                UIControler.instance.onMess(`Error: ${url} => ${res}`);
                return;
            }
            this.numTurn = res.remain_turn;
            if (callback) {
                callback(this.numTurn);
            }
        });
    }
}


