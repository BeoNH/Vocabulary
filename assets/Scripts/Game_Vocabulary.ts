import { _decorator, Button, Component, EventTouch, instantiate, Label, Node, Prefab, resources, Sprite, SpriteFrame } from 'cc';
import { GameManager } from './GameManager';
import { DropZone } from './DropZone';
import { DragItem } from './DragItem';
import { LoadingScreen } from './LoadingScreen';
const { ccclass, property } = _decorator;

@ccclass('Game_Vocabulary')
export class Game_Vocabulary extends Component {
    public static Instance: Game_Vocabulary;

    @property({ type: Node, tooltip: "Node cha chứa các vùng được fill" })
    public dropZonesParent: Node = null;
    @property({ type: Node, tooltip: "Node chứa các text kéo thả" })
    public dragZonesParent: Node = null;
    @property({ type: Prefab, tooltip: "Prefab item (bảng game)" })
    public itemPrefab: Prefab = null;

    @property({ type: Node, tooltip: "Ảnh các đáp án" })
    public imageAnswer: Node = null;
    @property({ type: Node, tooltip: "Node các câu trả lời" })
    public listAnswer: Node = null;

    private spriteFrameData: SpriteFrame[] = [];

    private imageAnswerID: string[] = []; // đáp án hiển thị màn hình

    onLoad() {
        Game_Vocabulary.Instance = this;
    }

    start(): void {

    }

    update(deltaTime: number) {

    }

    // Khởi tạo dữ liệu đầu game
    initGame() {
        this.clearData();
        LoadingScreen.Instance.loadResourceAsync('data/Color', SpriteFrame)
            .then((assets: SpriteFrame[]) => {
                console.log('Loaded assets:', assets);

                this.spriteFrameData = assets;

                // this.generatePhase1();
                this.generatePhase2();
            })
            .catch((error) => {
                console.error('Error while loading assets:', error);
            });
    }

    // Khởi tạo lại về dữ liệu mặc định
    private clearData() {
        this.spriteFrameData = [];
        this.dropZonesParent.removeAllChildren();
        this.dragZonesParent.removeAllChildren();

        this.listAnswer.active = false;
    }


    // Sinh ra các prefab theo cụm data
    private generatePhase1() {
        const pair = this.randomPairs(GameManager.data);
        if (!pair) return;

        pair.forEach(e => {
            let itemZone = instantiate(this.itemPrefab);
            itemZone.parent = this.dropZonesParent;

            itemZone.getComponent(DropZone).zoneId = e.key;
            itemZone.getChildByPath(`DragItem`).getComponent(DragItem).correctZoneId = e.word;
            itemZone.getChildByPath(`DragItem`).getComponent(DragItem).dragZone = this.dragZonesParent;
            itemZone.getChildByPath(`DragItem`).getComponent(DragItem).dropZones = this.dropZonesParent;

            let image = this.spriteFrameData.find(frame => frame.name.toLowerCase() === e.key.toLowerCase());
            itemZone.getChildByPath(`Image`).getComponent(Sprite).spriteFrame = image;
        });

    }

    // Sinh ra các cụm từ khoá
    private generatePhase2() {
        const pair = this.randomPairs(GameManager.data);
        if (!pair) return;

        this.listAnswer.active = true;
        pair.forEach((e, i) => {
            this.listAnswer.children[i].getComponent(Button).clickEvents[0].customEventData = e.word;
            this.listAnswer.children[i].getChildByName(`Label`).getComponent(Label).string = e.word;
        })

        this.imageAnswerID = this.shuffleArray(GameManager.data);
        let image = this.spriteFrameData.find(frame => frame.name.toLowerCase() === this.imageAnswerID[0].toLowerCase());
        this.imageAnswer.getComponent(Sprite).spriteFrame = image;
    }

    // Xáo trộn không có vị trí nào trùng
    private randomPairs(data: string[]) {
        if (data.length < 2) {
            throw new Error("Cần ít nhất 2 phần tử để tạo derangement!");
        }

        const shuffled = this.shuffleArray(data);

        return data.map((c, i) => ({
            key: c,
            word: shuffled[i],
        }));
    }

    // Xáo trộn mảng khác với mảng gốc
    private shuffleArray(array) {
        const arr = [...array];
        // Áp dụng thuật toán Sattolo: Hoán vị
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Kiểm tra các từ Phase 1 đã được sắp xếp đúng chưa
    checkCorrectPhase1() {
        let done = true;
        this.dropZonesParent.children.forEach(drop => {
            const dropZone = drop.getComponent(DropZone);
            const dragItem = drop.getChildByPath("DragItem").getComponent(DragItem);
            if (dropZone.zoneId == dragItem.correctZoneId) {
                drop.getComponent(DropZone).doneZone = true;
            } else {
                done = false;
            }
        })

        if (done) {
            console.log("Hoàn thanh Phase 1");
        }
    }

    onAnswerClick(e: EventTouch, txt: string) {
        if (this.imageAnswerID.length > 0 && txt === this.imageAnswerID[0]) {
            this.imageAnswerID.shift();
            console.log(e)
            e.currentTarget.active = false;

            let image = this.spriteFrameData.find(frame => frame.name.toLowerCase() === this.imageAnswerID[0].toLowerCase());
            this.imageAnswer.getComponent(Sprite).spriteFrame = image;
        }
    }
}


