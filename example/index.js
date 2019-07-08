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
        "content": [],
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