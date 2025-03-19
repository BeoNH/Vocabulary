import { _decorator, Component, EventTouch, find, Label, Node, UITransform, Vec3 } from 'cc';
import { DropZone } from './DropZone';
import { Game_Vocabulary } from './Game_Vocabulary';
const { ccclass, property } = _decorator;

@ccclass('DragItem')
export class DragItem extends Component {

    @property({ tooltip: "Tên xác thực với vùng được thả" })
    public correctZoneId: string = '';

    private originalPos: Vec3 = new Vec3(); // Lưu vị trí ban đầu
    private currentParent: Node = null; // Node cha mục tiêu khi swap
    private parentUI: UITransform = null; // Cấu hình toạ độ node kéo

    public dragZone: Node = null;
    public dropZones: Node = null;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected start(): void {
        this.covertLabel();
    }

    protected onDestroy(): void {
        this.doneDrag();
    }

    // Sau khi thả đúng vị trí Drop, ngừng xử lý touch events
    private doneDrag() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    // Xứ lý khi bắt đầu bấm vào để kéo
    private onTouchStart(event: EventTouch) {
        if (this.node.parent?.getComponent(DropZone).isCorrectDrop) {
            this.doneDrag();
            return;
        }
        this.currentParent = this.node.parent;
        this.originalPos = this.currentParent.getComponent(DropZone).zoneWPos.worldPosition.clone();
        this.parentUI = this.dragZone.getComponent(UITransform);
    }

    // Di chuyển node theo điểm chạm và kiểm tra va chạm để hoán đổi vị trí với node khác nếu có
    private onTouchMove(event: EventTouch) {
        if (this.dragZone && this.dragZone.children.length === 0) {
            this.node.parent = this.dragZone;
        }

        // Di chuyển Node
        if (!this.parentUI) return;
        const touchPos = event.getUILocation();
        const localPos = this.parentUI.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        this.node.setPosition(localPos);

        // Kiểm tra va chạm với các DropZone
        if (!this.dropZones) return;
        for (let zoneNode of this.dropZones.children) {
            const dropZoneComp = zoneNode.getComponent(DropZone);
            if (dropZoneComp && !dropZoneComp.isCorrectDrop && this.checkCollision(dropZoneComp.zoneWPos)) {

                const child = zoneNode.getChildByPath(`DragItem`)
                if (child && child !== this.node) {
                    child.parent = this.currentParent;
                    child.setSiblingIndex(Math.max(0, this.currentParent.children.length - 2))
                    child.worldPosition = this.originalPos.clone();

                    this.originalPos = dropZoneComp.zoneWPos.worldPosition.clone();
                }
                this.currentParent = zoneNode;
            }
        }
    }

    // Khi kết thúc kéo, thiết lập lại parent và căn chỉnh vị trí
    private onTouchEnd(event: EventTouch) {
        if (!this.currentParent) {
            this.currentParent = null;
            return;
        }

        this.node.parent = this.currentParent;
        this.node.setSiblingIndex(Math.max(0, this.currentParent.children.length - 2));

        const dropZoneComp = this.currentParent.getComponent(DropZone);
        if (!dropZoneComp) {
            this.currentParent = null;
            return;
        }

        this.node.setWorldPosition(dropZoneComp.zoneWPos.worldPosition);

        if (dropZoneComp.zoneId === this.correctZoneId) {
            this.doneDrag();
            Game_Vocabulary.Instance.onReadWord(dropZoneComp.zoneId);
            console.log(`Thả đúng zoneId = ${dropZoneComp.zoneId}`);
        } else {
            console.log('Thả sai zone');
        }

        Game_Vocabulary.Instance.checkCorrectPhase1();
        this.currentParent = null;
    }

    // Kiểm tra xem bounding box của node này có giao nhau với node truyền vào hay không
    private checkCollision(zoneNode: Node): boolean {
        const itemRect = this.node.getComponent(UITransform)?.getBoundingBoxToWorld();
        const zoneRect = zoneNode.getComponent(UITransform)?.getBoundingBoxToWorld();
        if (!itemRect || !zoneRect) return false;
        return itemRect.intersects(zoneRect);
    }

    // Cập nhật label hiển thị correctZoneId
    private covertLabel() {
        const labelNode = this.node.getChildByPath('Label');
        if (labelNode) {
            const labelComp = labelNode.getComponent(Label);
            if (labelComp) {
                labelComp.string = this.correctZoneId;
            }
        }
    }
}
