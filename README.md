# white-board-pro
基于canvas的web画写板控件。

## 功能
- 支持多层级画板叠加
- 支持画笔样式选择及擦除等画板基础绘图功能
- 支持多媒体组件的展示（目前仅限于图片）及基本操作，如拖拽等

## 下载

使用npm:

```bash
$ npm install -S white-board-pro
```

## 引入

```bash
// index.js

import 'canvas-board';
```

## 使用

基本使用:

```bash
var myboard = window.WhiteBoard({
    "el": ".box",
    "maxPage": 5,
    "zIndexInfo": [{
        "inputType": "fountain-pen",
        "disabled": false,
        "update": false,
        "color": "#FF9500",
        "page": 1,
        "size": 5,
        "zIndex": 1,
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
                    "globalCompositeOperation": 'source-over',
                    "inputType": 'fountain-pen'
                }
            }
        ],
        "other": {
            "img": [
                {
                    "type": "img",
                    "zIndex": 1,
                    "info": {
                        "width": "120px",
                        "height": "120px",
                        "left": "302px",
                        "top": "125px",
                        "rotate": "rotate(90deg)",
                        "url": "https://s.gravatar.com/avatar/7d228fb734bde96e1bae224107cc48cb"
                    }
                }
            ],
            "audio": [],
            "video": [],
            "N2": []
        }
    }],
    "watcher": {
        "wait": 2000,
        "cb": () => console.log('异步执行回调')
    },
    "writeCallBack": {
        "type": "once",
        "cb": () => console.log('同步执行回调')
    },
    "addCallBack": () => console.log('加纸')
});
```

## 初始化控件的配置项说明

```bash
    el: 画板容器元素,支持id选择符,类选择符和元素选择符 | String
    maxPage: 画板最大页数 | Number
    zIndexInfo: 画板初始化层级以及每层画布的初始参数(详情见zIndexInfo说明)，支持多级画布 | Array
    watcher: 画板进行操作后的异步回调 | Object
    writeCallBack： 画板进行操作时同步执行的回调 | Object
    addCallBack： 画板加页后的回调 | Object
```

## zIndexInfo配置属性说明
        
> inputType: 输入类型 | String
- fountain-pen: 钢笔
- fluorescent-pen: 荧光笔
- rubber: 橡皮
- N2: N2笔（暂不支持）
- text: 文本（暂不支持）
- camera： 相机/相册，输出图片

> disabled: 该层画板是否可书写 | Boolean
- true（默认）: 可书写
- false: 禁用

> update: 该层画板是否有更新 | Boolean
- true: 有更新
- false: 无更新

> color: 该层画板初始画笔颜色 | String

> page: 该层画板初始页数 | Number

> size: 该层画板初始画笔粗细 | Number

> zIndex: 该层画板在父级容器中的层级 | Number

> content: 该层画板的笔记轨迹数据和每条笔记的画笔设置信息 | Array
```bash
    "content": [
        {
            // 轨迹数据
            "path": [],
            // 此轨迹的画笔设置信息
            "canvasSettings": {
                "strokeStyle": "#FF9500",
                "lineWidth": 2,
                "lineCap": "round",
                "globalCompositeOperation": 'source-over',
                "inputType": 'fountain-pen'
            }
        }
    ]
```

> other: 该层画板的多媒体组件信息 | Object
```bash
    "other": {
        "img": [], // 图片组件
        "audio": [], // 音频组件
        "video": [], // 视频组件
        "N2": [] // N2笔图片组件
    }
```


## API

以创建好的myBoard实例为例:

#### 当前层画板加页

```bash
    myBoard.addPage();
```

#### 当前层画板添加多媒体组件

```bash
    myBoard.createMediaDom(type, url, initDrag);
    /*
        type: 多媒体组件类型（img/audio/video/N2）
        url: 数据（图片地址，音视频播放地址）
        initDrag： 是否初始化拖拽
    */

    // 以添加图片组件为例
    myBoard.createMediaDom('img', 'https://s.gravatar.com/avatar/7d228fb734bde96e1bae224107cc48cb', true);
```

#### 设置当前层画板输入类型及画笔样式

```bash
    myBoard.canvasObj[0].setUp({
        strokeStyle: "#000", // 画笔颜色
        lineWidth: 2, // 画笔粗细
        inputType: "fountain-pen" // 输入类型
    });
```
