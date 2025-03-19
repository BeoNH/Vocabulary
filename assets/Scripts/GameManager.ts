import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // chủ đề xắp xếp đúng thứ tự như ngoài menu
    public static Toppic = [`Animals`, `Fruits`, `Vehicle`, `Food`];
    
    // data mẫu
    // public static data = {
    //     'Animals': ['Cat', 'Dog', 'Cow', 'Pig', 'Sheep', 'Horse', 'Chicken', 'Duck', 'Rabbit', 'Goat', 'Lion', 'Tiger', 'Wolf', 'Fox', 'Deer', 'Monkey', 'Elephant', 'Giraffe', 'Zebra', 'Fish', 'Bird', 'Mouse'],
    //     'Fruits': ['Apple', 'Banana', 'Orange', 'Grape', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon', 'Lemon', 'Cherry', 'Peach', 'Pear', 'Melon', 'Plum', 'Coconut', 'Blueberry', 'Raspberry', 'Blackberry', 'Grapefruit', 'Lychee', 'Papaya', 'Passionfruit'],
    //     'Vehicle': ['Car', 'Bus', 'Truck', 'Bicycle', 'Motorcycle', 'Scooter', 'Van', 'Taxi', 'Train', 'Airplane', 'Boat', 'Ship', 'Submarine', 'Canoe', 'Yacht', 'Ferry', 'Tram', 'Metro', 'Tractor', 'Ambulance', 'Fire truck', 'Police car']
    // };

    public static defuseScore = 1000; // Điểm mặc định 2 vòng cuối
    public static defuseTime = 15; // Thời gian mặc định 1 câu hỏi

    public static plusScore: number = 100; // điểm trả lời đúng
    public static wrongScore: number = -50; // Trả lời sai
    public static openHint: number = -10; // Mở gợi ý

}


