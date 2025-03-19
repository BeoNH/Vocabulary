import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    start() {
        speechSynthesis.getVoices()
    }

    update(deltaTime: number) {

    }

    // Dùng API Google để đọc text
    onReadWord(e, txt: number) {
        if (window.speechSynthesis) {
            const msg = new SpeechSynthesisUtterance(`Elephant`);
            msg.voice = speechSynthesis.getVoices()[txt]; // Giọng đọc
            msg.lang = 'en-US'; // Ngôn ngữ tiếng Anh
            msg.volume = 1; // Âm lượng (0-1)
            msg.rate = 0.8; // Tốc độ đọc (0.1-10)
            msg.pitch = 1; // Độ cao giọng (0-2)
            window.speechSynthesis.speak(msg);
        } else {
            console.error("SpeechSynthesis không được hỗ trợ trên nền tảng này!");
        }
    }
}


