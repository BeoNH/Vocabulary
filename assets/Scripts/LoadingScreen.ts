import { _decorator, Component, director, Label, Node, resources, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingScreen')
export class LoadingScreen extends Component {
    public static Instance: LoadingScreen;

    @property({ type: Node, tooltip: "Hiển thị loading" })
    loadScene: Node = null;

    @property({ type: Label, tooltip: "Hiển thị tiến độ loading" })
    progressLabel: Label = null;

    protected onLoad(): void {
        LoadingScreen.Instance = this;
        this.loadScene.active = false;
    }

    loadResourceAsync(path: string, type: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.loadScene.active = true;
            resources.loadDir(path, type, (completedCount, totalCount, item) => {
                const progress = totalCount > 0 ? completedCount / totalCount : 0;
                if (this.progressLabel) {
                    this.progressLabel.string = `Loading: ${Math.floor(progress * 100)}%`;
                }
            }, (err, assets) => {
                // trễ lại 1 nhịp
                this.scheduleOnce(()=>{
                    this.loadScene.active = false;
                },0.5)

                if (err) {
                    reject(err);
                } else {
                    resolve(assets);
                }
            });
        });
    }
}


