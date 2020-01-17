import '../src/white-board';

const t1 = new Date().getTime();

window.oCanvas = window.WhiteBoard({
    "el": ".box",
    "maxPage": 1,
    // "pageHeight": 100,
    "rubberRange": 10,
    "addBtn": false,
    "zIndexInfo": [{
        "update": true,
        "inputType": "fountain-pen",
        "color": "#9100FF",
        "page": 1,
        "size": 3,
        "zIndex": 1,
        "content": [],
        "other": {
            "img": [],
            "audio": [],
            "video": [],
            "N2": []
        }
    }],
    "watcher": {
        wait: 2000,
        cb: () => console.log('异步执行回调')
    },
    "writeCallBack": {
        type: "once",
        cb: () => console.log('同步执行回调')
    },
    "addCallBack": () => console.log('加纸')
});

const t2 = new Date().getTime();
console.log('白板初始化时间：' + (t2 - t1) / 1000 + 's');