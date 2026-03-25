import { _decorator, Component, director, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends Component {

    @property(Label)
    lbProgress: Label = null;

    start() {
        this.lbProgress.string = `Loading...`;

        let p = 0;
        director.preloadScene("GamePlay", (c, t, i) => {
            p = Math.max(p, c / t);
            this.lbProgress.string = `Loading... ${Math.round(p * 100)}%`;
        }, (err, scene) => {
            director.loadScene("GamePlay");
        });
    }
}


