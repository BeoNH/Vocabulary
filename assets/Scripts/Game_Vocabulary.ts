import { _decorator, Animation, Button, Color, Component, EventTouch, instantiate, Label, Node, Prefab, resources, Sprite, SpriteFrame, tween, Tween, v3, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { DropZone } from './DropZone';
import { DragItem } from './DragItem';
import { LoadingScreen } from './LoadingScreen';
const { ccclass, property } = _decorator;

@ccclass('Game_Vocabulary')
export class Game_Vocabulary extends Component {
    public static Instance: Game_Vocabulary;


    @property({ readonly: true, editorOnly: true, serializable: false })
    private TOP: string = "========== TOP =========="
    @property({ type: Label, tooltip: "Vòng hiện tại đang ở" })
    public labelPhase: Label = null;
    @property({ type: Label, tooltip: "Hướng dẫn chơi" })
    public labelGuild: Label = null;
    @property({ type: Node, tooltip: "Quản lý các hoạt ảnh" })
    public animControler: Node = null;
    @property({ type: Node, tooltip: "Màn cha đợi chạy xong animation" })
    public maskWaitAnimRun: Node = null;

    @property({ readonly: true, editorOnly: true, serializable: false })
    private PHASE_1: string = "========== PHASE 1 =========="
    @property({ type: Node, tooltip: "Màn hình vòng 1" })
    public scenePhase1: Node = null;
    @property({ type: Node, tooltip: "Node cha chứa các vùng được fill" })
    public dropZonesParent: Node = null;
    @property({ type: Node, tooltip: "Node chứa các text kéo thả" })
    public dragZonesParent: Node = null;
    @property({ type: Prefab, tooltip: "Prefab item (bảng game)" })
    public itemPrefab: Prefab = null;

    @property({ readonly: true, editorOnly: true, serializable: false })
    private PHASE_2: string = "========== PHASE 2 =========="
    @property({ type: Node, tooltip: "Màn hình vòng 2" })
    public scenePhase2: Node = null;
    @property({ type: Node, tooltip: "Ảnh các đáp án" })
    public imageAnswer: Node = null;
    @property({ type: Label, tooltip: "Câu trả lời đúng" })
    public labelResults: Label = null;
    @property({ type: Node, tooltip: "Node các câu trả lời" })
    public listAnswer: Node = null;

    @property({ readonly: true, editorOnly: true, serializable: false })
    private PHASE_3: string = "========== PHASE 3 =========="
    @property({ type: Node, tooltip: "Màn hình vòng 3" })
    public scenePhase3: Node = null;
    @property({ type: Node, tooltip: "Node các hint che đi đáp án" })
    public listHint: Node = null;

    private spriteFrameData: SpriteFrame[] = []; // hình ảnh từng ván chơi

    private imageAnswerID: string[] = []; // Hình ảnh đáp án
    private firstTouch: boolean = true; // kiểm tra lần chạm đầu tiên mỗi Phase

    onLoad() {
        Game_Vocabulary.Instance = this;

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    start(): void {

    }

    update(deltaTime: number) {

    }

    onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }



    //=============== kHỞI TẠO ĐẦU GAME ===============//

    // Khởi tạo dữ liệu đầu game
    initGame() {
        this.clearScene();
        this.clearPhase1();
        LoadingScreen.Instance.loadResourceAsync('data/Color', SpriteFrame)
            .then((assets: SpriteFrame[]) => {
                console.log('Loaded assets:', assets);

                this.spriteFrameData = assets;

                this.generatePhase1();
            })
            .catch((error) => {
                console.error('Error while loading assets:', error);
            });
    }

    // Khởi tạo lại về dữ liệu mặc định theo từ Phase
    private clearPhase1() {
        this.dropZonesParent.removeAllChildren();
        this.dragZonesParent.removeAllChildren();
    }
    private clearPhase2() {
        this.listAnswer.children.forEach(node => {
            node.active = true;
        })
    }


    // Sinh ra các prefab theo cụm data
    private generatePhase1() {
        this.scenePhase1.active = true;
        this.labelPhase.string = `Phase 1: Sort`;
        this.labelGuild.string = `Ghép từ đúng với hình ảnh`;
        this.firstTouch = true;
        this.playAnimation(`Phase1`);

        const pair = this.randomPairs(GameManager.data);
        if (!pair) return;

        pair.forEach((e, i) => {
            let itemZone = instantiate(this.itemPrefab);
            itemZone.parent = this.dropZonesParent;
            itemZone.position = v3(i % 2 !== 0 ? 400 : -400, 0, 0);

            // Cấu hình vị trí so le nhau
            if (i % 2 !== 0) {
                this.mirrorPosition(itemZone, 'DropZone');
                this.mirrorPosition(itemZone, 'DragItem');
                this.mirrorPosition(itemZone, 'CheckBox');
            }

            let dragItem = itemZone.getChildByPath(`DragItem`).getComponent(DragItem);
            dragItem.correctZoneId = e.word;
            dragItem.dragZone = this.dragZonesParent;
            dragItem.dropZones = this.dropZonesParent;

            itemZone.getComponent(DropZone).zoneId = e.key;
            let image = this.spriteFrameData.find(frame => frame.name.toLowerCase() === e.key.toLowerCase());
            itemZone.getChildByPath(`Image`).getComponent(Sprite).spriteFrame = image;
        });

    }

    // Sinh ra các cụm từ khoá
    private generatePhase2() {
        this.scenePhase2.active = true;
        this.labelPhase.string = `Phase 2: Chosse`;
        this.labelGuild.string = `Ghép từ đúng với hình ảnh`;
        this.firstTouch = true;
        this.scenePhase3.active ? this.playAnimation(`Phase3`) : this.playAnimation(`Phase2`);

        const pair = this.randomPairs(GameManager.data);
        if (!pair) return;

        pair.forEach((e, i) => {
            this.listAnswer.children[i].getComponent(Button).clickEvents[0].customEventData = e.word;
            this.listAnswer.children[i].getChildByName(`Label`).getComponent(Label).string = e.word;
        })

        this.imageAnswerID = this.shuffleArray(GameManager.data);
        let image = this.spriteFrameData.find(frame => frame.name.toLowerCase() === this.imageAnswerID[0].toLowerCase());
        this.imageAnswer.getComponent(Sprite).spriteFrame = image;
    }

    // Sinh ra các mask che đi từ khoá
    private generatePhase3() {
        this.scenePhase3.active = true;
        this.generatePhase2();
        this.labelPhase.string = `Phase 3: Guess`;
        this.labelGuild.string = `Mở từng phẩn của ảnh để đoán từ`;
        this.listHint.children.forEach(node => { node.active = true })
    }

    // làm sạch lại các dữ liệu màn chơi
    private clearScene() {
        this.maskWaitAnimRun.active = false;
        this.scenePhase1.active = false;
        this.scenePhase2.active = false;
        this.scenePhase3.active = false;
        this.labelPhase.string = `Phase ?: ?`;
        this.labelGuild.string = `?????`;
        this.labelResults.string = `. . . . .`;

        this.spriteFrameData = [];
        this.imageAnswerID = [];
    }




    //=============== XỬ LÝ LOGIC GAME ===============//

    // Xử lý khi bấm màn hình
    private onTouchStart(): void {
        if (this.firstTouch) {
            console.log("Chạm")
            this.firstTouch = false;
            this.stopAnimation();
        }

    }

    // Xắp xếp so le các đáp án
    private mirrorPosition(item: Node, path: string) {
        let obj = item.getChildByPath(path);
        if (obj) {
            let pos = obj.position.clone();
            obj.position = v3(-pos.x, pos.y, pos.z);
        }
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



    //=============== XỬ LÝ ANIMATION ===============//

    // Xử lý hiệu ứng hình động
    playAnimation(chil: string) {
        let node = this.animControler.getChildByPath(chil);
        node.active = true;

        const anim = node.getComponent(Animation);
        if (anim) {
            anim.play();
        }
    }
    stopAnimation(): void {
        this.animControler.children.forEach(child => {
            child.active = false;
            const anim = child.getComponent(Animation);
            if (anim) {
                anim.stop();
                if (anim.defaultClip) {
                    anim.play(anim.defaultClip.name);
                    anim.pause();
                }
            }
        });
    }

    // Chạy text khi chọn đúng đáp án
    private currentTween: Tween<Node> = null;
    private correctAnswer(txt: string, cb: Function) {
        if (!this.labelResults) return;

        let labelNode = this.labelResults.node;
        this.labelResults.string = txt;

        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }

        let originalScale = labelNode.scale.clone();
        let originalColor = this.labelResults.color.clone();

        // Tạo tween mới
        this.maskWaitAnimRun.active = true;
        this.currentTween = tween(labelNode)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1) })
            .call(() => this.shakeEffect(labelNode))
            .to(0.8, { scale: originalScale })
            .call(() => this.blinkEffect(this.labelResults))
            .call(() => {
                this.labelResults.color = originalColor;
                this.currentTween = null;
                this.labelResults.string = `. . . . .`;
                this.maskWaitAnimRun.active = false;
                cb();
            })
            .start();
    }

    // Hiệu ứng rung lắc
    private shakeEffect(node: Node) {
        tween(node)
            .sequence(
                tween().by(0.15, { eulerAngles: new Vec3(0, 0, -10) }),
                tween().by(0.15, { eulerAngles: new Vec3(0, 0, 20) }),
                tween().by(0.15, { eulerAngles: new Vec3(0, 0, -15) }),
                tween().by(0.15, { eulerAngles: new Vec3(0, 0, 10) }),
                tween().to(0.15, { eulerAngles: new Vec3(0, 0, 0) })
            )
            .start();
    }

    // Hiệu ứng nhấp nháy
    private blinkEffect(label: Label) {
        tween(label)
            .repeat(4, // Lặp lại 4 lần
                tween()
                    .to(0.1, { color: new Color(0, 0, 0, 50) })
                    .to(0.1, { color: new Color(0, 0, 0, 255) })
            )
            .start();
    }






    //=============== TƯƠNG TÁC NGOÀI EDITER ===============//

    // Kiểm tra các từ Phase 1 đã được sắp xếp đúng chưa
    checkCorrectPhase1() {
        let done = true;
        this.dropZonesParent.children.forEach(drop => {
            const dropZone = drop.getComponent(DropZone);
            const dragItem = drop.getChildByPath("DragItem").getComponent(DragItem);
            if (dropZone.zoneId == dragItem.correctZoneId) {
                drop.getComponent(DropZone).validDrop();
            } else {
                done = false;
            }
        })

        if (done) {
            console.log("Hoàn thanh Phase 1");

            this.clearPhase1();
            this.generatePhase2();
        }
    }

    onAnswerClick(e: EventTouch, txt: string) {
        this.onTouchStart();
        if (this.imageAnswerID.length > 0 && txt === this.imageAnswerID[0]) {
            this.imageAnswerID.shift();
            e.currentTarget.active = false;


            this.listHint.children.forEach(node => { node.active = false })
            this.scheduleOnce(() => {
                this.listHint.children.forEach(node => { node.active = true })
            }, 1)

            this.correctAnswer(txt, () => {
                if (this.imageAnswerID.length > 0) {
                    let image = this.spriteFrameData.find(frame => frame.name.toLowerCase() === this.imageAnswerID[0].toLowerCase());
                    this.imageAnswer.getComponent(Sprite).spriteFrame = image;
                } else if (this.scenePhase3.active) {
                    console.log("Hoàn thanh Phase 3");
                } else {
                    console.log("Hoàn thanh Phase 2");

                    this.clearPhase2();
                    this.generatePhase3();
                }
            })
        }
    }

    // Mở ngẫu nhiên 1 ô gợi ý khỏi ảnh
    onOpenRandomHint() {
        this.onTouchStart();
        const activeChildren = this.listHint.children.filter(child => child.active);

        if (activeChildren.length === 0) {
            console.log("Đã mở hết Hint");
            return;
        }

        const randomIndex = Math.floor(Math.random() * activeChildren.length);
        activeChildren[randomIndex].active = false;
    }
}


