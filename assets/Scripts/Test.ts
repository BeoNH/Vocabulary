import { _decorator, Component, Node, resources, SpriteFrame, TextAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    private csvData: { [key: string]: string[] } = {};

    start() {
        this.scheduleOnce(() => console.log(speechSynthesis.getVoices()), 2)
        speechSynthesis.getVoices();
        this.loadCSVData();
    }

    // Hàm đọc file CSV
    loadCSVData() {
        resources.load('vocabulary', (err, textAsset: TextAsset) => {
            if (err) {
                console.error('Lỗi khi đọc file CSV:', err);
                return
            }

            const csvText = textAsset.text;
            const lines = csvText.split('\n');
            
            // Lấy header (tên các cột)
            const headers = lines[0].split(',').map(header => header.trim());
            
            // Khởi tạo dữ liệu cho mỗi cột
            headers.forEach(header => {
                this.csvData[header] = [];
            });

            // Đọc dữ liệu từng dòng
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(value => value.trim());
                values.forEach((value, index) => {
                    if (value && headers[index]) {
                        this.csvData[headers[index]].push(value);
                    }
                });
            }

            // Sau khi đọc xong CSV, lấy danh sách ảnh
            this.getImagesList();
        });
    }

    update(deltaTime: number) {

    }

    // Dùng API Google để đọc text
    onReadWord(e, txt: number) {
        if (window.speechSynthesis) {
            const msg = new SpeechSynthesisUtterance(`Welcome to the world`);
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

    // Hàm lấy danh sách ảnh từ thư mục resources/data
    getImagesList() {
        const folders = ['Animals', 'Fruits', 'Food', 'Vehicle'];
        
        folders.forEach(folder => {
            const path = `data/${folder}`;
            
            resources.loadDir(path, (err, assets) => {
                if (err) {
                    console.error(`Lỗi khi load thư mục ${folder}:`, err);
                    return;
                }

                // Lấy danh sách tên ảnh
                const imageNames = assets
                    .filter(asset => asset instanceof SpriteFrame)
                    .map(asset => asset.name);

                // So sánh với dữ liệu CSV
                this.compareWithCSV(folder, imageNames);
            });
        });
    }

    // Hàm so sánh dữ liệu từ CSV với danh sách ảnh
    compareWithCSV(folder: string, imageNames: string[]) {
        const csvNames = this.csvData[folder];
        
        if (!csvNames) {
            console.error(`Không tìm thấy dữ liệu CSV cho thư mục ${folder}`);
            return;
        }

        // Tìm các tên có trong CSV nhưng không có trong thư mục
        const missingInFolder = csvNames.filter(name => imageNames.indexOf(name) === -1);
        
        // Tìm các tên có trong thư mục nhưng không có trong CSV
        const missingInCSV = imageNames.filter(name => csvNames.indexOf(name) === -1);

        console.log(`\n=== Kết quả so sánh cho ${folder} ===`);
        console.log('Các tên có trong CSV nhưng không có trong thư mục:');
        console.log(missingInFolder);
        console.log('\nCác tên có trong thư mục nhưng không có trong CSV:');
        console.log(missingInCSV);
    }
}


