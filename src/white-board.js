/**
 * version: 2.3.9
 */
import './white-board.css';
import '../lib/font/font';
import '../lib/icon/iconfont.css';
import { Image } from './components/image/image';
import { Audio } from './components/audio/audio';
import { N2SVG } from './components/n2svg/n2svg';

if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    };
}

(function () {
    'use strict';

    var vendors = ['webkit', 'moz', 'ms', 'o'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        ||
        !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function (callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () {
                    callback(lastTime = nextTime);
                },
                nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

(function (w, d) {

    var WhiteBoard = function (o) {
        return new WhiteBoard.prototype.fn(o);
    };
    
    WhiteBoard.prototype.fn = function (o) {
        // 初始化层级排序
        o.zIndexInfo.sort(function (prev, next) { return next.zIndex - prev.zIndex });
        // 初始参数赋值
        this.options = o;
        // 父级容器dom
        this.wrapDom = this.getWrapDom(o.el);
        // 一张纸的默认高度
        this.pageHeight = o.pageHeight || this.wrapDom.getBoundingClientRect().height;
        // 总层级(画板层级数和多媒体控件数的总和)
        this.zIndexTotal = this.getAllZindex(o.zIndexInfo),
        // 画板各层级cavas对象实例
        this.canvasObj = [];
        // 初始化布局
        this.initLayout();
    };
    
    WhiteBoard.prototype.fn.prototype = {
        constructor: WhiteBoard.prototype.fn,

        // 获取父级盒子
        getWrapDom: function (el) {
            var dom = null;
            if (typeof el === 'string') {
                switch (el[0]) {
                    case "#":
                        dom = d.getElementById(el.substr(1));
                        break;
                    case ".":
                        dom = d.getElementsByClassName(el.substr(1))[0];
                        break;
                    default:
                        dom = d.getElementsByTagName(el)[0];
                        break;
                }
            } else if (typeof el === 'object') {
                dom = el;
            }
            return dom;
        },

        // 初始化获取白板控件中的层级总数
        getAllZindex: function (zIndexInfo) {
            var num = zIndexInfo.length;
            for (var i = 0, len = zIndexInfo.length; i < len; i++) {
                num = num + (zIndexInfo[i].other.img ? zIndexInfo[i].other.img.length : 0);
                num = num + (zIndexInfo[i].other.audio ? zIndexInfo[i].other.audio.length : 0);
                num = num + (zIndexInfo[i].other.video ? zIndexInfo[i].other.video.length : 0);
                num = num + (zIndexInfo[i].other.N2 ? zIndexInfo[i].other.N2.length : 0);
            }
            // console.log('层级总数: ' + num);
            return num;
        },

        // 初始化画布布局
        initLayout: function () {
            var maxPage = Math.max.apply(Math, this.options.zIndexInfo.map(function(e) { return (e.page || 1) }));
            console.log('最大页数: ' + maxPage);
            this.wrapDom.style.height = maxPage*this.pageHeight + 'px';
            this.wrapDom.style.position = 'relative';

            // 清理dom和已挂载到canvasObj的canvas实例和其他元素
            this.clearWrapDom(this.wrapDom);

            for (var i = 0, len = this.options.zIndexInfo.length; i < len; i++) {
                var item = this.options.zIndexInfo[i];
                this.createCanvas(item);
            }

            // 加纸按钮
            if (this.options.addBtn !== false) this.initAddBtn();

            // 测试多媒体控件dom接入
            /* var testBtn = document.createElement('button');
            testBtn.innerText = "img";
            testBtn.style.position = 'absolute';
            testBtn.style.left=200+'px';
            testBtn.style.zIndex = 999;
            this.wrapDom.appendChild(testBtn);
            var _self = this;
            testBtn.onclick = function () {
                // _self.createMediaDom('N2', _self.options.zIndexInfo[0].content, true);
                _self.createMediaDom('img', 'https://s.gravatar.com/avatar/7d228fb734bde96e1bae224107cc48cb', true);
            }; */

            // 测试多媒体控件dom接入（音频）
            /* var testBtn = document.createElement('button');
            testBtn.innerText = "audio";
            testBtn.style.position = 'absolute';
            testBtn.style.zIndex = 999;
            this.wrapDom.appendChild(testBtn);
            var _self = this;
            testBtn.onclick = function () {
                _self.createMediaDom('audio', "", true);
            }; */

            // 测试橡皮擦 && 画笔
            /* var testBtn = document.createElement('button');
            testBtn.innerText = "橡皮";
            testBtn.style.position = 'absolute';
            testBtn.style.zIndex = 999;
            this.wrapDom.appendChild(testBtn);
            var _self = this;
            testBtn.onclick = function () {
                // _self.canvasObj[0].setUp({ inputType: 'fluorescent-pen', strokeStyle: '#FFF4DA' });
                _self.canvasObj[0].setUp({ inputType: 'rubber'});
            };
            var testBtn = document.createElement('button');
            testBtn.innerText = "画笔";
            testBtn.style.position = 'absolute';
            testBtn.style.left=100+'px';
            testBtn.style.zIndex = 999;
            this.wrapDom.appendChild(testBtn);
            var _self = this;
            testBtn.onclick = function () {
                // _self.canvasObj[0].setUp({ inputType: 'fluorescent-pen', strokeStyle: '#FFF4DA' });
                _self.canvasObj[0].setUp({ inputType: 'fountain-pen', strokeStyle: '#FF9500' });
            }; */

            // 测试禁用
            /* var testBtn = document.createElement('button');
            testBtn.innerText = "disable";
            testBtn.style.position = 'absolute';
            testBtn.style.zIndex = 999;
            this.wrapDom.appendChild(testBtn);
            var _self = this;
            testBtn.onclick = function () {
                _self.disableBoard(true);
            }; */
        },

        initAddBtn: function () {
            var addPageBtn = d.createElement('button');
            var addBtnCLass = '';
            if (this.options.zIndexInfo[0].page === this.options.maxPage) {
                addBtnCLass = 'boardIcon board-icon-jia board-add-page disable';
            } else {
                addBtnCLass = 'boardIcon board-icon-jia board-add-page';
            };
            addPageBtn.setAttribute('class', addBtnCLass);
            this.wrapDom.appendChild(addPageBtn);
            var _self = this;
            addPageBtn.onclick = function (ev) {
                ev.preventDefault();
                ev.cancelBubble = true;
                ev.stopPropagation();
                _self.addPage();
            }; 
        },

        clearWrapDom: function (wrapDom) {
            for (var i = 0, len = wrapDom.children.length; i < len; i++) {
                var oDom = wrapDom.children[i];
                if (oDom.classList.contains('board-box') || oDom.classList.contains('board-add-page')) {
                    wrapDom.removeChild(oDom);
                    oDom = null;
                    i--;
                    len = wrapDom.children.length;
                }
            }
            this.canvasObj = [];
        },

        // 单个画布的创建
        createCanvas: function (obj) {
            var parentEl = d.createElement('div');
            parentEl.setAttribute('class', 'board-box board-box-' + obj.zIndex);
            parentEl.style.height = (obj.page || 1)*this.pageHeight + 'px';
            parentEl.style.zIndex = obj.zIndex;
            this.wrapDom.appendChild(parentEl);

            var canvas = d.createElement('canvas');
            canvas.setAttribute('id', 'board-' + obj.zIndex);
            canvas.width = parentEl.getBoundingClientRect().width;
            canvas.height = parentEl.getBoundingClientRect().height;
            parentEl.appendChild(canvas);
            
            // 初始化画板对象
            var c = new Canvas(canvas, obj, this);
            this.canvasObj.push(c);
        },

        // 当前顶层画布加页
        addPage: function () {
            if (this.options.zIndexInfo[0].page === this.options.maxPage) return;
            this.options.zIndexInfo[0].page += 1;
            this.initLayout();
            if (this.options.addCallBack && typeof this.options.addCallBack === 'function') this.options.addCallBack();
        },

        // 禁用画板
        disableBoard: function (bool) {
            this.options.zIndexInfo[0].disabled = bool;
            this.initLayout();
        },

        // 获取随机位置
        getRandomPosition: function () {
            var clientW = this.wrapDom.clientWidth;
            var clientH = this.wrapDom.clientHeight;
            var xRange = [clientW * 0.2, clientW * 0.5];
            var yRange = [clientH * 0.2, clientH * 0.5];
            return {
                x: Math.round(Math.random() * (xRange[1] - xRange[0]) + xRange[0]),
                y: Math.round(Math.random() * (yRange[1] - yRange[0]) + yRange[0])
            }
        },

        // 找出所有附加元素中层级最大值
        findMaxIndex: function (other) {
            var arr = [];
            var max;
            for (var key in other) {
                if (other[key].length) {
                    arr.push(Math.max.apply(null, other[key].map(function (v) {
                        return v.zIndex;
                    })));
                }
            }
            if (arr.length) {
                max = Math.max.apply(null, arr);
            } else {
                max= 0;
            }
            return max;
        },

        // 插入多媒体模块及n2笔svg图片
        createMediaDom: function (type, data, initDrag) {
            var oCanvas = this.canvasObj[0];
            var oIndexTotal = this.findMaxIndex(oCanvas.info.other);
            oIndexTotal += 1;
            var dom = null;
            var info = {
                type: type, // 类型
                zIndex: "", // 当前层级画板的层级
                info: {} // 具体信息
            };
            var coordinate = this.getRandomPosition();
            switch (type) {
                case 'img':
                    info.zIndex = oIndexTotal;
                    info.info.url = data;
                    info.info.left = coordinate.x + 'px';
                    info.info.top = coordinate.y + 'px';
                    info.info.width = '120px';
                    info.info.height = '120px';
                    dom = new Image(info, this).dom;
                    break;
                case 'video':
                    alert("暂不支持");
                    break;
                case 'audio':
                    dom = new Audio(data, coordinate, oIndexTotal, this).dom;
                    info.type = "audio";
                    info.zIndex = oIndexTotal;
                    break;
                case 'N2':
                    dom = new N2SVG(data, coordinate, oIndexTotal, this).dom;
                    info.type = "N2";
                    info.zIndex = oIndexTotal;
                    break;
                default:
                    alert("未知类型控件");
                    break;
            }
            oCanvas.info.other[type].push(info);
            oCanvas.el.parentNode.appendChild(dom);
            // 执行回调
            oCanvas.cbFunc(true, 'async');
            
            if (initDrag) new Drag(dom, oCanvas, info);
        },

        // 通知元素已被删除
        deleteElFromOtherData: function (type, zIndex, dom) {
            var oCanvas = this.canvasObj[0];
            for (var i = 0, len = oCanvas.info.other[type].length; i < len; i++) {
                if (oCanvas.info.other[type][i].zIndex === zIndex) {
                    oCanvas.info.other[type].splice(i, 1);
                    break;
                }
            }
            oCanvas.el.parentNode.removeChild(dom);
            dom = null;
            // 执行回调
            oCanvas.cbFunc(true, 'all');
        }
    };

    if(!w.WhiteBoard) w.WhiteBoard =  WhiteBoard;


    /******************************* 单个canvas画布对象 **********************************/
    var Canvas = function (el, obj, superClass) {
        this.timeout = null;
        this.superClass = superClass;
        this.el = el;
        this.info = obj;
        this.canvasSettings = {
            strokeStyle: '',
            lineWidth: '',
            lineCap: '',
            inputType: ''
        };
        this.rubberStartX = 0;
        this.rubberStartY = 0;
        this.rubberOn = false;
        this.rubberRange = Number(superClass.options.rubberRange) || 10;
        this.squareOfRubberRange = this.rubberRange*this.rubberRange;
        this.watcher = superClass.options.watcher;
        this.writeCallBack = superClass.options.writeCallBack;
        this.isDrawing = false;
        this.coords = {};
        this.coords.old = this.coords.current = this.coords.oldMid = { x: 0, y: 0 };
        // this.locus = null;
        this.curve = null;
        this.setUp(this.initSettings(obj));
        this.drawingContent(Object.assign({}, this.canvasSettings));
        this.initMediaComps(obj.other);
        if (!obj.disabled) {
            this.initDrawEvent();
        }
    };

    Canvas.prototype = {
        // 初始设置参数获取
        initSettings: function (obj) {
            return {
                strokeStyle: obj.color || '#000000',
                lineWidth: obj.size || 2,
                lineCap: "round",
                inputType: obj.inputType || 'fountain-pen'
            };
        },
        // 当前画布设置更改
        setUp: function (settings) {
            for (var key in settings) {
                this.canvasSettings[key] = settings[key];
            }
            this.initCtx();
        },
        // 初始化画板功能
        initCtx: function () {
            this.ctx = this.el.getContext("2d");
            this.ctx.strokeStyle = this.canvasSettings.strokeStyle;
            this.ctx.lineWidth = this.canvasSettings.lineWidth;
            this.ctx.lineCap = this.canvasSettings.lineCap;
            this.ctx.globalCompositeOperation = this.canvasSettings.inputType === 'fluorescent-pen' ? 'darken' : 'source-over';
        },
        // 画板事件绑定
        initDrawEvent: function () {
            var _self = this;
            // touch事件
            this.el.addEventListener('touchstart', function (e) {
                _self.touchStart.call(_self, e, _self.getInputCoords(e));
            }, { passive: false });

            w.addEventListener('touchmove', function (e) {
                _self.touchMove.call(_self, e, _self.getInputCoords(e));
            }, { passive: false });

            w.addEventListener('touchend', function (e) {
                _self.info.update = true;
                _self.touchEnd.call(_self, e);
            }, { passive: false });

            // mouse事件
            this.el.addEventListener('mousedown', function (e) {
                _self.touchStart.call(_self, e, _self.getInputCoords(e));
            });
            
            w.addEventListener('mousemove', function (e) {
                _self.touchMove.call(_self, e, _self.getInputCoords(e));
            });
            
            w.addEventListener('mouseup', function (e) {
                _self.info.update = true;
                _self.touchEnd.call(_self, e);
            });

            // 绑定回调机制
            this.bindCbFunc(this.el, this);

            if (w.requestAnimationFrame) requestAnimationFrame( this.drawing.bind(this) );
        },
        // 回调监听绑定方法
        bindCbFunc: function (el, _self) {
            // 监听输入完毕，触发异步回调
            if (_self.watcher && _self.watcher.cb && typeof _self.watcher.cb === "function") {
                el.addEventListener('touchend', _self.debounce(_self.watcher.cb, _self.watcher.wait));
                el.addEventListener('mouseup', _self.debounce(_self.watcher.cb, _self.watcher.wait));
            }

            // 监听输入开始，触发同步回调(兼容事件只执行一次)
            if (_self.writeCallBack && _self.writeCallBack.cb && typeof _self.writeCallBack.cb === "function") {
                el.addEventListener('touchstart', function fn (e) {
                    if (_self.writeCallBack.type && _self.writeCallBack.type === 'once') e.target.removeEventListener('touchstart', fn);
                    return _self.writeCallBack.cb();
                });
                el.addEventListener('mousedown', function fn (e) {
                    if (_self.writeCallBack.type && _self.writeCallBack.type === 'once') e.target.removeEventListener('mousedown', fn);
                    return _self.writeCallBack.cb();
                });
            }
        },
        // 回调方法执行
        cbFunc: function (shouldUpdate, type) {
            if (shouldUpdate) this.info.update = true;
            switch (type) {
                case 'async':
                    if (this.watcher && this.watcher.cb && typeof this.watcher.cb === "function") {
                        this.debounce(this.watcher.cb, this.watcher.wait)();
                    }
                    break;
                case 'sync':
                    if (this.writeCallBack && this.writeCallBack.cb && typeof this.writeCallBack.cb === "function") {
                        this.writeCallBack.cb();
                    }
                    break;
                case 'all':
                    if (this.watcher && this.watcher.cb && typeof this.watcher.cb === "function") {
                        this.debounce(this.watcher.cb, this.watcher.wait)();
                    }
                    if (this.writeCallBack && this.writeCallBack.cb && typeof this.writeCallBack.cb === "function") {
                        this.writeCallBack.cb();
                    }
                    break;
                default:
                    break;
            }
        },
        // 防抖
        debounce: function (func, wait) {
            var _self = this;
            return function () {
                clearTimeout(_self.timeout);
                _self.timeout = setTimeout(func, wait);
            }
        },
        // 阻止默认事件，事件冒泡
        clearEventBubble: function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        // 触摸事件开始
        touchStart: function (e, coords) {
            if (e.touches && e.touches.length > 1) {
                this.isDrawing = false;
                return;
            };

            this.isDrawing = true;

            if (this.canvasSettings.inputType === 'rubber') {
                this.rubberStart(e, coords);
            } else {
                this.coords.current = this.coords.old = coords;
                this.coords.oldMid = this.getMidInputCoords(coords);
                
                // this.locus = { path: 'M'+ this.coords.current.x +' '+ this.coords.current.y +'' };
                this.curve = {
                    path: [],
                    canvasSettings: Object.assign({}, this.canvasSettings),
                    rectArea: []
                };
    
                if (!w.requestAnimationFrame) this.drawing();
                this.clearEventBubble(e);
            }
    
        },
        // 触摸移动
        touchMove: function (e, coords) {
            if (e.touches && e.touches.length > 1) {
                this.isDrawing = false;
                return;
            };
            if(!this.isDrawing) return;

            this.coords.current = coords;

            if (this.canvasSettings.inputType === 'rubber') {
                /* var pos = {
                    x: coords.x,
                    y: coords.y
                };
                this.checkRectArea(pos); */
                this.rubberMove(e, coords);
            } else {
                // this.locus.path = this.locus.path + 'L'+ this.coords.current.x +' '+ this.coords.current.y +'';
                // this.curve.path.push([this.coords.old.x, this.coords.old.y, this.coords.oldMid.x, this.coords.oldMid.y]);
                if (!w.requestAnimationFrame) this.drawing();
                this.clearEventBubble(e);
            }

        },
        // 触摸结束
        touchEnd: function (e) {
            if (this.isDrawing && (!e.touches || e.touches.length === 0)) {
                this.isDrawing = false;
                this.clearEventBubble(e);
            }
            // this.info.content.push(this.locus);
            if (this.canvasSettings.inputType === 'rubber') {
                this.rubberUp(e);
            } else {
                if (!this.curve) return;
                this.curve.rectArea = this.getRectArea(this.curve.path);
                this.info.content.push(this.curve);
                this.curve = null;
            }
            // console.log(this.info.content);
            // console.log(JSON.stringify(this.info.content));
        },

        drawing: function () {
            if (this.isDrawing && this.canvasSettings.inputType !== 'rubber') {
                var currentMid = this.getMidInputCoords(this.coords.current);
                
                this.ctx.beginPath();
                this.ctx.moveTo(currentMid.x, currentMid.y);
                this.ctx.quadraticCurveTo(this.coords.old.x, this.coords.old.y, this.coords.oldMid.x, this.coords.oldMid.y);
                this.ctx.stroke();
                const currentCoords = this.getCurrentCoords(this.coords);
                // this.locus.path = this.locus.path + 'L'+ currentCoords.current.x +' '+ currentCoords.current.y +'';
                this.curve.path.push({
                    currentMidX: currentMid.x,
                    currentMidY: currentMid.y,
                    oldX: currentCoords.old.x,
                    oldY: currentCoords.old.y,
                    oldMidX: currentCoords.oldMid.x,
                    oldMidY: currentCoords.oldMid.y
                });
                
                this.coords.old = this.coords.current;
                this.coords.oldMid = currentMid;
            }
            if (w.requestAnimationFrame) requestAnimationFrame( this.drawing.bind(this) );
        },

        // 橡皮区域拖拽开始
        rubberStart: function (e, coords) {
            this.cbFunc(false, 'sync');
            this.clearEventBubble(e);
            this.rubberOn = true;
            this.rubberStartX = coords.x;
            this.rubberStartY = coords.y;
            var selDiv = document.createElement('div');
            selDiv.id = 'board-rubber-area';
            this.el.parentNode.appendChild(selDiv);
            selDiv.style.left = this.rubberStartX + 'px';
            selDiv.style.top = this.rubberStartY + 'px';
        },

        // 橡皮区域拖拽中
        rubberMove: function (e, coords) {
            if (!this.rubberOn) return;
            this.clearEventBubble(e);
            var _x = coords.x;
            var _y = coords.y;
            var selDiv = document.getElementById('board-rubber-area');
            selDiv.style.display = 'block';
            selDiv.style.left = Math.min(_x, this.rubberStartX) + 'px';
            selDiv.style.top = Math.min(_y, this.rubberStartY) + 'px';
            selDiv.style.width = Math.abs(_x - this.rubberStartX) + 'px';
            selDiv.style.height = Math.abs(_y - this.rubberStartY) + 'px';
        },

        // 橡皮区域抬起
        rubberUp: function (e) {
            if (!this.rubberOn) return;
            this.cbFunc(false, 'async');
            this.clearEventBubble(e);
            var selDiv = document.getElementById('board-rubber-area');
            // 获取参数
            var l = selDiv.offsetLeft;
            var t = selDiv.offsetTop;
            var w = selDiv.offsetWidth;
            var h = selDiv.offsetHeight;
            
            this.checkInnerWriting({x: l, y: t, width: w, height: h});

            this.el.parentNode.removeChild(selDiv);
            selDiv = null;
            this.rubberOn = false;
        },

        // 判断区域内部的轨迹
        checkInnerWriting: function (rect1) {
            if (!this.info.content.length) return;
            for (var i = 0, len = this.info.content.length; i < len; i++) {
                var oContent = this.info.content[i];
                if (!oContent) continue;
                var rect2 = {
                    x: oContent.rectArea[0],
                    y: oContent.rectArea[2],
                    width: oContent.rectArea[1] - oContent.rectArea[0],
                    height: oContent.rectArea[3] - oContent.rectArea[2]
                }
                var bool = this.isOverlap(rect1, rect2);
                if (bool) {
                    if (this.shouldDelete(oContent, rect1)) {
                        this.info.content.splice(i, 1);
                        i = i - 1;
                    }
                }
            }
            this.drawingContent(Object.assign({}, this.canvasSettings));
        },

        /**
         * 判断两个矩形是否有重叠
         * @param {x, y, width, height} rect1 
         * @param {x, y, width, height} rect2 
         */
        isOverlap: function (rect1, rect2) {
            var l1 = { x: rect1.x, y: rect1.y };
            var r1 = { x: rect1.x + rect1.width, y: rect1.y + rect1.height };
            var l2 = { x: rect2.x, y: rect2.y };
            var r2 = { x: rect2.x + rect2.width, y: rect2.y + rect2.height };
            if (
              l1.x > r2.x ||
              l2.x > r1.x ||
              l1.y > r2.y ||
              l2.y > r1.y
            ) return false;
            return true;
        },

        /**
         * 判断是否这个轨迹得某个点在矩形范围内
         * @param {canvasSettings, path, rectArea} oContent 
         * @param {x, y, width, height} rect 
         */
        shouldDelete: function (oContent, rect) {
            var rectArea = [
                rect.x,
                rect.x + rect.width,
                rect.y,
                rect.y + rect.height
            ];
            var pathArr = oContent.path;
            for (var i = 0, len = pathArr.length; i < len; i++) {
                var oPoint = pathArr[i];
                var coords1 = {
                    x: oPoint.currentMidX,
                    y: oPoint.currentMidY
                };
                var coords2 = {
                    x: oPoint.oldX,
                    y: oPoint.oldY
                };
                var coords3 = {
                    x: oPoint.oldMidX,
                    y: oPoint.oldMidY
                };
                if (this.isFitPath(coords1, rectArea) || this.isFitPath(coords2, rectArea) || this.isFitPath(coords3, rectArea)) {
                    return true;
                }
            }
            return false;
        },

        // 计算轨迹矩形区域
        getRectArea: function (pathArr) {
            var dis = this.rubberRange;
            var o = {xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity};
            var obj = pathArr.reduce(function (prev, cur) {
                prev.xMin = Math.min.apply(null, [prev.xMin, cur.currentMidX, cur.oldX, cur.oldMidX]);
                prev.xMax = Math.max.apply(null, [prev.xMax, cur.currentMidX, cur.oldX, cur.oldMidX]);
                prev.yMin = Math.min.apply(null, [prev.yMin, cur.currentMidY, cur.oldY, cur.oldMidY]);
                prev.yMax = Math.max.apply(null, [prev.yMax, cur.currentMidY, cur.oldY, cur.oldMidY]);
                return prev;
            }, o);
            return [
                obj.xMin - dis <= 0 ? 0 : obj.xMin - dis, 
                obj.xMax + dis >= this.el.width ? this.el.width : obj.xMax + dis, 
                obj.yMin - dis <= 0 ? 0 : obj.yMin - dis, 
                obj.yMax + dis >= this.el.height ? this.el.height : obj.yMax + dis
            ];
        },

        // 检测触发区域
        checkRectArea: function (coords) {
            if (!this.info.content.length) {
                return;
            };
            for (var i = 0, len = this.info.content.length; i < len; i++) {
                var oContent = this.info.content[i];
                if (!oContent) continue;
                if (this.isFitPath(coords, oContent.rectArea)) {
                    if (this.matchPath(coords, oContent.path)) {
                        this.info.content.splice(i, 1);
                        this.patchDrawing(oContent);
                        return;
                    }
                }
            }
        },
        patchDrawing: function (oContent) {

            var canvas = this.el;
            var context = canvas.getContext("2d");
            var x = oContent.rectArea[0];
            var y = oContent.rectArea[2];
            var disX = oContent.rectArea[1] - x;
            var disY = oContent.rectArea[3] - y;
            context.clearRect(x, y, disX, disY);

            this.ctx.save();
            context.beginPath();
            context.rect(x, y, disX, disY);
            this.ctx.clip();
            this.drawingContent(Object.assign({}, this.canvasSettings), 'patch');
            this.ctx.restore();
        },

        /**
         * 检测点在矩形区域内
         * @param {x, y} coords 
         * @param {xMin, xMax, yMin, yMax} rectArea 
         */
        isFitPath: function (coords, rectArea) {
            if (coords.x <= rectArea[0]) {
                return false;
            }
            if (coords.y >= rectArea[3]) {
                return false;
            }
            if (coords.x >= rectArea[1]) {
                return false;
            }
            if (coords.y <= rectArea[2]) {
                return false;
            }
    
            return true;
        },

        // 根据坐标点匹配选中的一条轨迹
        matchPath: function (coords, pathArr) {
            var _self = this;

            var bool = pathArr.some(function (e) {
                return _self.distanceOfPoint2Line(coords.x, coords.y, e.currentMidX, e.currentMidY, e.oldMidX, e.oldMidY) <= _self.squareOfRubberRange;
            });

            return bool;
        },

        // 计算某点到两点间线段的垂直距离
        distanceOfPoint2Line: function (x0, y0, x1, y1, x2, y2) {
            var x = x1;
            var y = y1;
            var dx = x2 - x;
            var dy = y2 - y;
            if (dx !== 0 || dy !== 0) {
                var t = ((x0 - x) * dx + (y0 - y) * dy) / (dx * dx + dy * dy);
                if (t > 1) {
                    x = x2;
                    y = y2;
                } else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }
            dx = x0 - x;
            dy = y0 - y;
            return dx * dx + dy * dy;
        },

        getCurrentCoords: function (obj) {
            var _obj = JSON.stringify(obj);
            var objClone = JSON.parse(_obj);
            return objClone;
        },

        getInputCoords: function (e) {
            e = e.originalEvent ? e.originalEvent : e;
            var
                rect = this.el.getBoundingClientRect(),
                width = this.el.width,
                height = this.el.height,
                left = rect.left,
                top = rect.top
            ;
            var x, y;
            if (e.touches && e.touches.length == 1) {
                x = e.touches[0].pageX;
                y = e.touches[0].pageY;
            } else {
                x = e.pageX;
                y = e.pageY;
            }
            x = x - left;
            y = y - top;
            x *= (width / rect.width);
            y *= (height / rect.height);
            return {
                x: Number(x.toFixed(0)),
                y: Number(y.toFixed(0))
            };
        },
    
        getMidInputCoords: function (coords) {
            return {
                x: this.coords.old.x + coords.x>>1,
                y: this.coords.old.y + coords.y>>1
            };
        },

        // 保存图片(base64)
        saveToBase64: function () {
            var image = new Image();
            image.src = this.el.toDataURL("image/png");
            console.log(image);
            return image;
        },
        // 保存图片(blob对象)
        saveToBlob: function () {
            this.el.toBlob(function (blob) {
                var url = URL.createObjectURL(blob);
                var image = new Image();
                image.onload = function() {
            　　    URL.revokeObjectURL(url)
                };
                console.log(url);
                image.src=url;
                return image;
            });
        },
        // 初始化白板内容
        drawingContent: function (canvasSettings, type) {
            if (type !== 'patch') this.clearAll();
            if (!this.info.content.length) {
                this.setUp(canvasSettings);
                return;
            }

            /* for (var i = 0, len = this.info.content.length; i < len; i++) {
                var arr = this.info.content[i].path.split('M')[1].split('L');
                for (var j = 0, length = arr.length; j < length; j++) {
                    var x = arr[j].split(' ')[0];
                    var y = arr[j].split(' ')[1];
                    if (j === 0) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y);
                    } else if (j === length - 1) {
                        this.ctx.closePath();
                    } else {
                        this.ctx.lineTo(x, y);
                        this.ctx.stroke(); 
                    }
                }
            } */

            var content = this.info.content;
            
            for (var i = 0, len = content.length; i < len; i++) {
                var oPathInfo = content[i];
                if (!oPathInfo || !oPathInfo.path.length) continue;
                var arr = oPathInfo.path;
                this.setUp(oPathInfo.canvasSettings);
                this.ctx.beginPath();
                for (var j = 0, length = arr.length; j < length; j++) {
                    var currentMidX = arr[j].currentMidX;
                    var currentMidY = arr[j].currentMidY;
                    var oldX = arr[j].oldX;
                    var oldY = arr[j].oldY;
                    var oldMidX = arr[j].oldMidX;
                    var oldMidY = arr[j].oldMidY;
                    this.ctx.moveTo(currentMidX, currentMidY);
                    this.ctx.quadraticCurveTo(oldX, oldY, oldMidX, oldMidY);
                }
                this.ctx.stroke();
            }

            // 恢复上一次的设置
            this.setUp(canvasSettings);
        },
        // 初始化其他内容（多媒体控件）
        initMediaComps: function (o) {
            for (var key in o) {
                if (o[key].length) this.drawComps(o[key], key);
            }
        },
        // 初始化多媒体控件布局
        drawComps: function (data, type) {
            switch (type) {
                case 'img':
                    for (var i = 0, len = data.length; i < len; i++) {
                        var dom = new Image(data[i], this.superClass).dom;
                        new Drag(dom, this, data[i]);
                        this.el.parentNode.appendChild(dom);
                    }
                    break;
            
                default:
                    break;
            }
        },
        // 清除画布的所有内容
        clearAll: function () {
            var canvas = this.el;
            /* var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height); */

            canvas.width = canvas.width;
        }
    };
    /*************************************************************************/
    
    /********************************* 拖拽类 *********************************/
    function Drag(dom, oCanvas, info) {
        this.oCanvas = oCanvas;
        this.wrapDom = oCanvas.el.parentNode;
        this.dom = dom;
        this.info = info;
        this.flag = false;
        var _self = this;

        _self.dom.addEventListener("mousedown", function (ev) {
            ev.preventDefault();
            ev.cancelBubble = true;
            ev.stopPropagation();
            _self.down(_self);
        }, false);
        _self.dom.addEventListener("touchstart", function (ev) {
            ev.preventDefault();
            ev.cancelBubble = true;
            ev.stopPropagation();
            _self.down(_self);
        }, false)

    }
    //按下
    Drag.prototype.down = function (_self) {
        // 执行回调
        _self.oCanvas.cbFunc(false, 'sync');

        _self.flag = true;
        var touch;
        if (event.touches) {
            touch = event.touches[0];
        } else {
            touch = event;
        }
        var offLeft = touch.clientX - _self.dom.offsetLeft; //当前点击点相对元素左边框的距离
        var offTop = touch.clientY - _self.dom.offsetTop; //当前点击点相对元素上边框的距离

        w.onmousemove = function () {
            _self.move(_self, offLeft, offTop);
        }
        w.onmouseup = function () {
            _self.end(_self);
        }
        w.addEventListener("touchmove", function () {
            _self.move(_self, offLeft, offTop);
        }, false);
        w.addEventListener("touchend", function () {
            _self.end(_self);
        }, false);
    }
    //移动
    Drag.prototype.move = function (_self, offLeft, offTop) {
        var sty = null;
        if (w.getComputedStyle) {
            sty = w.getComputedStyle(_self.dom, null); // 非IE
        } else {
            sty = _self.dom.currentStyle; // IE
        }
        var maxLeft = _self.wrapDom.clientWidth - sty.width.split('px')[0] - 20; //当前元素可移动的最大左偏移
        var maxTop = _self.wrapDom.clientHeight - sty.height.split('px')[0] - 20; //当前元素可移动的最大上偏移

        if (_self.flag) {
            var touch;
            if (event.touches) {
                touch = event.touches[0];
            } else {
                touch = event;
            }
            var endX = touch.clientX - offLeft; //元素移动后的left距离
            var endY = touch.clientY - offTop; //元素移动后的top距离
            if (endX <= 20) {
                endX = 20;
            } else if (endX >= maxLeft) {
                endX = maxLeft;
            }
            if (endY <= 20) {
                endY = 20;
            } else if (endY >= maxTop) {
                endY = maxTop;
            }

            _self.dom.style.left = endX + "px";
            _self.dom.style.top = endY + "px";
        }
    }
    //释放
    Drag.prototype.end = function (_self) {
        if (!_self.flag) return;
        w.onmousemove = null;
        w.onmouseup = null;
        _self.flag = false;

        // 执行回调
        _self.oCanvas.cbFunc(true, 'async');

        var oStyle = w.getComputedStyle(_self.dom);
        _self.info.info.left = oStyle.left;
        _self.info.info.top = oStyle.top;
    }
    /***********************************************************************************/

})(typeof window !== 'undefined' ? window : global, document);

