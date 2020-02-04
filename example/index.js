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
        "content": [{"path":[{"x":246,"y":296},{"x":246,"y":296},{"x":246,"y":296},{"x":246,"y":296},{"x":249,"y":293},{"x":261,"y":288},{"x":283,"y":280},{"x":291,"y":280},{"x":308,"y":280},{"x":313,"y":294},{"x":313,"y":319},{"x":310,"y":339}],"canvasSettings":{"strokeStyle":"#9100FF","lineWidth":3,"lineCap":"round","inputType":"fountain-pen"},"rectArea":[245.98542274052477,313.01457725947523,279.98933901918974,339.01066098081026]},{"path":[{"x":248,"y":450},{"x":248,"y":450},{"x":248,"y":451},{"x":248,"y":462},{"x":248,"y":490},{"x":261,"y":500},{"x":341,"y":505},{"x":469,"y":440},{"x":625,"y":284},{"x":665,"y":228}],"canvasSettings":{"strokeStyle":"#9100FF","lineWidth":3,"lineCap":"round","inputType":"fountain-pen"},"rectArea":[247.98542274052477,665.0145772594752,227.98933901918977,505.01066098081026]}],
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