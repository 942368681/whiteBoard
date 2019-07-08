import '../src/white-board';
window.oCanvas = window.WhiteBoard({
    "el": ".box",
    "maxPage": 5,
    // "pageHeight": 100,
    "rubberRange": 10,
    "addBtn": true,
    "zIndexInfo": [{
        "inputType": "fountain-pen", // rubber, fountain-pen, fluorescent-pen
        "disabled": false,
        "update": false,
        "color": "#FF9500",
        "page": 1,
        "size": 5,
        "zIndex": 2,
        "content": [
            {
                "path": [{
                    "currentMidX": 272,
                    "currentMidY": 92,
                    "oldX": 272,
                    "oldY": 92,
                    "oldMidX": 272,
                    "oldMidY": 92
                }, {
                    "currentMidX": 271,
                    "currentMidY": 95,
                    "oldX": 272,
                    "oldY": 93,
                    "oldMidX": 272,
                    "oldMidY": 92
                }, {
                    "currentMidX": 271,
                    "currentMidY": 99,
                    "oldX": 271,
                    "oldY": 97,
                    "oldMidX": 271,
                    "oldMidY": 95
                }, {
                    "currentMidX": 270,
                    "currentMidY": 104,
                    "oldX": 271,
                    "oldY": 101,
                    "oldMidX": 271,
                    "oldMidY": 99
                }, {
                    "currentMidX": 269,
                    "currentMidY": 110,
                    "oldX": 270,
                    "oldY": 107,
                    "oldMidX": 270,
                    "oldMidY": 104
                }, {
                    "currentMidX": 268,
                    "currentMidY": 117,
                    "oldX": 268,
                    "oldY": 114,
                    "oldMidX": 269,
                    "oldMidY": 110
                }, {
                    "currentMidX": 270,
                    "currentMidY": 124,
                    "oldX": 268,
                    "oldY": 120,
                    "oldMidX": 268,
                    "oldMidY": 117
                }, {
                    "currentMidX": 276,
                    "currentMidY": 132,
                    "oldX": 273,
                    "oldY": 129,
                    "oldMidX": 270,
                    "oldMidY": 124
                }, {
                    "currentMidX": 284,
                    "currentMidY": 136,
                    "oldX": 280,
                    "oldY": 135,
                    "oldMidX": 276,
                    "oldMidY": 132
                }],
                "canvasSettings": {
                    "strokeStyle": "#FF9500",
                    "lineWidth": 2,
                    "lineCap": "round",
                    "inputType": 'fountain-pen'
                }
            },
            {"path":[{"currentMidX":447,"currentMidY":117,"oldX":447,"oldY":117,"oldMidX":447,"oldMidY":117},{"currentMidX":447,"currentMidY":117,"oldX":447,"oldY":117,"oldMidX":447,"oldMidY":117},{"currentMidX":444,"currentMidY":125,"oldX":447,"oldY":118,"oldMidX":447,"oldMidY":117},{"currentMidX":438,"currentMidY":148,"oldX":442,"oldY":133,"oldMidX":444,"oldMidY":125},{"currentMidX":432,"currentMidY":180,"oldX":435,"oldY":163,"oldMidX":438,"oldMidY":148},{"currentMidX":430,"currentMidY":215,"oldX":429,"oldY":198,"oldMidX":432,"oldMidY":180},{"currentMidX":438,"currentMidY":244,"oldX":431,"oldY":232,"oldMidX":430,"oldMidY":215},{"currentMidX":456,"currentMidY":262,"oldX":445,"oldY":257,"oldMidX":438,"oldMidY":244},{"currentMidX":483,"currentMidY":265,"oldX":468,"oldY":267,"oldMidX":456,"oldMidY":262},{"currentMidX":518,"currentMidY":254,"oldX":498,"oldY":263,"oldMidX":483,"oldMidY":265},{"currentMidX":552,"currentMidY":233,"oldX":538,"oldY":245,"oldMidX":518,"oldMidY":254},{"currentMidX":571,"currentMidY":208,"oldX":566,"oldY":221,"oldMidX":552,"oldMidY":233},{"currentMidX":577,"currentMidY":182,"oldX":577,"oldY":195,"oldMidX":571,"oldMidY":208},{"currentMidX":573,"currentMidY":157,"oldX":578,"oldY":169,"oldMidX":577,"oldMidY":182},{"currentMidX":564,"currentMidY":137,"oldX":569,"oldY":145,"oldMidX":573,"oldMidY":157},{"currentMidX":555,"currentMidY":125,"oldX":559,"oldY":129,"oldMidX":564,"oldMidY":137},{"currentMidX":549,"currentMidY":122,"oldX":551,"oldY":122,"oldMidX":555,"oldMidY":125},{"currentMidX":546,"currentMidY":124,"oldX":547,"oldY":122,"oldMidX":549,"oldMidY":122},{"currentMidX":545,"currentMidY":138,"oldX":545,"oldY":127,"oldMidX":546,"oldMidY":124},{"currentMidX":553,"currentMidY":167,"oldX":546,"oldY":149,"oldMidX":545,"oldMidY":138},{"currentMidX":569,"currentMidY":200,"oldX":560,"oldY":186,"oldMidX":553,"oldMidY":167},{"currentMidX":594,"currentMidY":229,"oldX":579,"oldY":214,"oldMidX":569,"oldMidY":200},{"currentMidX":625,"currentMidY":252,"oldX":609,"oldY":244,"oldMidX":594,"oldMidY":229},{"currentMidX":656,"currentMidY":263,"oldX":642,"oldY":260,"oldMidX":625,"oldMidY":252},{"currentMidX":684,"currentMidY":266,"oldX":671,"oldY":267,"oldMidX":656,"oldMidY":263}],"canvasSettings":{"strokeStyle":"#FF9500","lineWidth":5,"lineCap":"round","inputType":"fountain-pen"}}
        ],
        "other": {
            img: [
                /* {
                    type: "img",
                    zIndex: 1,
                    info: {
                        width: "120px",
                        height: "120px",
                        left: "302px",
                        top: "125px",
                        rotate: "rotate(90deg)",
                        url: "https://s.gravatar.com/avatar/7d228fb734bde96e1bae224107cc48cb"
                    }
                } */
            ],
            audio: [],
            video: [],
            N2: []
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