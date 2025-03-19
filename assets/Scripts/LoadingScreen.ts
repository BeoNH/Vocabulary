import { _decorator, Asset, Component, director, Label, Node, resources, SpriteFrame } from 'cc';
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

    loadResourceAsync(paths: string[], type: typeof Asset): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.loadScene.active = true;
            const loadedAssets: any[] = [];
            let completedLoads = 0;

            // Cập nhật label progress
            this.progressLabel.string = `Loading: . . .`;

            // Load từng resource một
            paths.forEach((path, index) => {
                resources.load(path, type, (err, asset) => {
                    completedLoads++;

                    if (err) {
                        console.error(`Failed to load ${path}:`, err);
                    } else {
                        loadedAssets.push(asset);
                    }

                    // Kiểm tra đã load xong tất cả chưa
                    if (completedLoads === paths.length) {
                        // trễ lại 1 nhịp
                        this.scheduleOnce(() => {
                            this.loadScene.active = false;
                        }, 0.5)
                        if (loadedAssets.length > 0) {
                            resolve(loadedAssets);
                        } else {
                            reject(new Error('No assets were loaded successfully'));
                        }
                    }
                });
            });
        });
    }
}


