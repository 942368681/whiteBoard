import '../src/white-board';

const t1 = new Date().getTime();

window.oCanvas = window.WhiteBoard({
    "el": ".box",
    "maxPage": 5,
    // "pageHeight": 100,
    "rubberRange": 10,
    "addBtn": true,
    "zIndexInfo": [{
        "update": true,
        "inputType": "fountain-pen",
        "color": "#9100FF",
        "page": 2,
        "size": 3,
        "zIndex": 1,
        "content": [{"path":[{"x":0.5641526442307693,"y":0.22746196546052633,"pressure":1},{"x":0.5641526442307693,"y":0.22746196546052633,"pressure":0.9},{"x":0.5641526442307693,"y":0.22746196546052633,"pressure":0.8},{"x":0.5641526442307693,"y":0.22746196546052633,"pressure":0.7},{"x":0.5641526442307693,"y":0.23482216282894736,"pressure":0.6},{"x":0.5641526442307693,"y":0.26296772203947366,"pressure":0.5},{"x":0.5641526442307693,"y":0.3554944490131579,"pressure":0.4},{"x":0.5641526442307693,"y":0.46749074835526316,"pressure":0.3},{"x":0.5609036959134616,"y":0.5995579769736842,"pressure":0.2},{"x":0.5609036959134616,"y":0.6956311677631579,"pressure":0.1},{"x":0.5609036959134616,"y":0.7511461759868421,"pressure":0.1}],"canvasSettings":{"strokeStyle":"#9100FF","lineWidth":3,"lineCap":"round","inputType":"fountain-pen"},"rectArea":[0.5448780548878205,0.5801782852564104,0.21430407072368424,0.7643040707236842]},{"path":[{"x":0.8117800981570513,"y":0.21844161184210525,"pressure":1},{"x":0.8117800981570513,"y":0.21844161184210525,"pressure":1},{"x":0.8117800981570513,"y":0.22191097861842105,"pressure":1},{"x":0.8102150941506411,"y":0.24084087171052632,"pressure":1},{"x":0.7446789863782052,"y":0.33574732730263157,"pressure":1},{"x":0.6960699619391025,"y":0.4252672697368421,"pressure":1},{"x":0.6921136318108975,"y":0.4447471217105263,"pressure":1}],"canvasSettings":{"strokeStyle":"#9100FF","lineWidth":3,"lineCap":"round","inputType":"fountain-pen"},"rectArea":[0.6760879907852564,0.8278057391826923,0.20528371710526316,0.4579050164473684]}],
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