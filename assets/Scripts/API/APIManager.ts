import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum SERVICE_ASSETS {
    BATTA = 'batta',
    ELSA = 'elsa',
}

@ccclass('APIManager')
export class APIManager extends Component {

    public static service = SERVICE_ASSETS.ELSA;

    public static urlAPI: string = "https://api-tele.gamebatta.com";// batta
    public static urlBATTA: string = "https://apiwordpuzzle-tele.gamebatta.com";// sever game batta
    public static urlELSA: string = "https://apiwordpuzzle-mytel.elsapro.net";// sever game elsa

    // public static sessionID;
    public static userDATA: {
        id?: number;
        username?: string;
        [key: string]: any; // Cho phép thêm thuộc tính động nếu cần
    } = {};

    public static requestData(method: string, key: string, data: any, callBack: (response: any) => void) {
        const urlMapping: { [key in SERVICE_ASSETS]: string } = {
            [SERVICE_ASSETS.BATTA]: APIManager.urlBATTA,
            [SERVICE_ASSETS.ELSA]: APIManager.urlELSA,
        };
        const url = urlMapping[APIManager.service] + key;

        APIManager.CallRequest(method, data, url, (response) => {
            callBack(response);
        }, (xhr) => {
            // xhr.setRequestHeader('Authorization', 'Bearer ' + APIManager.urlParam(`token`));
            xhr.setRequestHeader("Content-type", "application/json");
        });
    }

    public static CallRequest(method, data, url, callback, callbackHeader) {
        let param = this;
        var xhr = new XMLHttpRequest();

        xhr.onerror = () => {
        };

        xhr.ontimeout = () => {
        }

        xhr.onabort = () => {
        }

        xhr.onloadend = () => {
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.responseText) {
                const response = JSON.parse(xhr.responseText);
                if (xhr.status === 200 || xhr.status === 201) {
                    console.log(`Call.${method}=>`, url, "\n", response);
                    callback(response);
                } else {
                    callback(null);
                }
            } else {
                callback(null);
            }
        };
        xhr.open(method, url, true);
        callbackHeader(xhr);
        let body
        if (data != null)
            body = JSON.stringify(data);
        else
            body = data
        // console.log(method, "body: ", body)
        xhr.send(body);
    }

    public static Challenge(name: string, score: number) {
        APIManager.requestData(`POST`, `/api/updateEventChallenge`, {
            "username": APIManager.userDATA?.username,
            "name": name,
            "score": score
            // [name]: score,
        }, res => { })
    }


    public static urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.search);
        return (results !== null) ? results[1] || 0 : false;
    }
}