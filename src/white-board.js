/**
 *  @brief     白板组件
 *  @author    sfl
 *  @version   2.6.2
 *  @date      2019.4
 */

import './white-board.css';
import '../lib/font/font';
import '../lib/icon/iconfont.css';

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
            var now = new Date().getTime();
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
        o.zIndexInfo.sort(function (prev, next) {
            return next.zIndex - prev.zIndex
        });
        // 初始参数赋值
        this.options = o;
        // 父级容器dom
        this.wrapDom = this.getWrapDom(o.el);
        // 初始高度
        this.initHeight = this.wrapDom.getBoundingClientRect().height;
        // 一张纸的默认高度
        this.pageHeight = o.pageHeight || this.wrapDom.getBoundingClientRect().height;
        // 总层级(画板层级数和多媒体控件数的总和)
        this.zIndexTotal = this.getAllZindex(o.zIndexInfo);
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

        // 加纸时重置轨迹点Y轴比例
        resetScale: function (item, curHeight, rubberRange) {
            if (!item.content.length) return;

            var wrapH = this.wrapDom.getBoundingClientRect().height;

            for (var i = 0, len = item.content.length; i < len; i++) {
                for (var j = 0, l = item.content[i].path.length; j < l; j++) {
                    // 更新Y轴轨迹点比例
                    item.content[i].path[j].y = (item.content[i].path[j].y * curHeight) / wrapH;
                }
                // 更新轨迹矩形区域比例
                item.content[i].rectArea = this.getRectArea(item.content[i].path, rubberRange, this.wrapDom);
            }
        },

        // 计算轨迹矩形区域
        getRectArea: function (pathArr, rubberRange, el) {
            var disX = rubberRange / el.clientWidth;
            var disY = rubberRange / el.clientHeight;
            var o = {
                xMin: Infinity,
                xMax: -Infinity,
                yMin: Infinity,
                yMax: -Infinity
            };
            var obj = pathArr.reduce(function (prev, cur) {
                prev.xMin = Math.min.apply(null, [prev.xMin, cur.x]);
                prev.xMax = Math.max.apply(null, [prev.xMax, cur.x]);
                prev.yMin = Math.min.apply(null, [prev.yMin, cur.y]);
                prev.yMax = Math.max.apply(null, [prev.yMax, cur.y]);
                return prev;
            }, o);
            return [
                obj.xMin - disX <= 0 ? 0 : obj.xMin - disX,
                obj.xMax + disX >= el.clientWidth ? el.clientWidth : obj.xMax + disX,
                obj.yMin - disY <= 0 ? 0 : obj.yMin - disY,
                obj.yMax + disY >= el.clientHeight ? el.clientHeight : obj.yMax + disY
            ];
        },

        // 初始化画布布局
        initLayout: function (type) {
            var curHeight = this.wrapDom.getBoundingClientRect().height;
            var maxPage = Math.max.apply(Math, this.options.zIndexInfo.map(function (e) {
                return (e.page || 1)
            }));
            this.wrapDom.style.height = this.initHeight + ((maxPage - 1) * this.pageHeight) + 'px';
            this.wrapDom.style.position = 'relative';

            // 清理dom和已挂载到canvasObj的canvas实例和其他元素
            this.clearWrapDom(this.wrapDom);

            for (var i = 0, len = this.options.zIndexInfo.length; i < len; i++) {
                var item = this.options.zIndexInfo[i];
                if (type === 'isAddPage') this.resetScale(item, curHeight, this.options.rubberRange);
                this.createCanvas(item);
            }

            // 加纸按钮
            if (this.options.addBtn !== false) this.initAddBtn();


            /**
             * 测试
             */
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
            parentEl.style.height = this.wrapDom.getBoundingClientRect().height + 'px';
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
            this.initLayout('isAddPage');
            if (this.options.addCallBack && typeof this.options.addCallBack === 'function') this.options.addCallBack();
        },

        // 禁用画板
        disableBoard: function (bool) {
            this.options.zIndexInfo[0].disabled = bool;
            this.initLayout();
        }
    };

    if (!w.WhiteBoard) w.WhiteBoard = WhiteBoard;



    /******************************* 单个canvas画布对象 **********************************/
    /**
     * 
     * @param {*} el 当前创建的canvas实例
     * @param {*} obj 当前canvas的数据，zIndexInfo的一项
     * @param {*} superClass WhiteBoard对象
     */
    var Canvas = function (el, obj, superClass) {
        this.timeout = null;
        this.superClass = superClass;
        this.el = el;
        this.elWidth = el.width;
        this.elHeight = el.height;
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
        this.squareOfRubberRange = this.rubberRange * this.rubberRange;
        this.watcher = superClass.options.watcher;
        this.writeCallBack = superClass.options.writeCallBack;
        this.isDrawing = false;
        this.beginPoint = null;
        this.coords = {};
        this.curve = null;
        this.setUp(this.initSettings(obj));
        this.drawingContent(Object.assign({}, this.canvasSettings));
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
            }, {
                passive: false
            });

            w.addEventListener('touchmove', function (e) {
                _self.touchMove.call(_self, e, _self.getInputCoords(e));
            }, {
                passive: false
            });

            w.addEventListener('touchend', function (e) {
                _self.touchEnd.call(_self, e);
            }, {
                passive: false
            });

            // mouse事件
            this.el.addEventListener('mousedown', function (e) {
                _self.touchStart.call(_self, e, _self.getInputCoords(e));
            });

            w.addEventListener('mousemove', function (e) {
                _self.touchMove.call(_self, e, _self.getInputCoords(e));
            });

            w.addEventListener('mouseup', function (e) {
                _self.touchEnd.call(_self, e);
            });

            // 绑定回调机制
            this.bindCbFunc(this.el, this);

            if (w.requestAnimationFrame) requestAnimationFrame(this.drawing.bind(this));
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
                el.addEventListener('touchstart', function fn(e) {
                    if (_self.writeCallBack.type && _self.writeCallBack.type === 'once') e.target.removeEventListener('touchstart', fn);
                    return _self.writeCallBack.cb();
                });
                el.addEventListener('mousedown', function fn(e) {
                    if (_self.writeCallBack.type && _self.writeCallBack.type === 'once') e.target.removeEventListener('mousedown', fn);
                    return _self.writeCallBack.cb();
                });
            }
        },
        // 回调方法执行
        cbFunc: function (type) {
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

            if (this.canvasSettings.inputType === 'rubber') {
                this.rubberStart(e, coords);
            } else {
                this.coords = coords;
                this.curve = {
                    path: [],
                    canvasSettings: Object.assign({}, this.canvasSettings),
                    rectArea: []
                };

                if (!w.requestAnimationFrame) this.drawing();
                this.clearEventBubble(e);
            }

            this.isDrawing = true;
        },
        // 触摸移动
        touchMove: function (e, coords) {
            if (e.touches && e.touches.length > 1) {
                this.isDrawing = false;
                return;
            };
            if (!this.isDrawing) return;

            this.coords = coords;

            if (this.canvasSettings.inputType === 'rubber') {
                this.rubberMove(e, coords);
            } else {
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
            if (this.canvasSettings.inputType === 'rubber') {
                this.rubberUp(e);
            } else {
                if (!this.curve) return;
                this.curve.rectArea = this.superClass.getRectArea(this.curve.path, this.rubberRange, this.el);
                this.info.content.push(this.curve);
                this.curve = null;
            }
            // console.log(this.info)
            // console.log(this.info.content);
            console.log(JSON.stringify(this.info.content));
        },

        drawing: function () {
            if (this.isDrawing && this.canvasSettings.inputType !== 'rubber' && this.curve) {
                // 绘制
                // 存入当前轨迹点
                this.curve.path.push({
                    x: this.coords.x / this.elWidth,
                    y: this.coords.y / this.elHeight
                });
                if (this.curve.path.length > 3) {
                    const lastTwoPoints = this.curve.path.slice(-2);
                    const controlPoint = {
                        x: lastTwoPoints[0].x * this.elWidth,
                        y: lastTwoPoints[0].y * this.elHeight
                    }
                    const endPoint = {
                        x: (lastTwoPoints[0].x * this.elWidth + lastTwoPoints[1].x * this.elWidth) / 2,
                        y: (lastTwoPoints[0].y * this.elHeight + lastTwoPoints[1].y * this.elHeight) / 2
                    }

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.beginPoint.x, this.beginPoint.y);
                    this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
                    this.ctx.stroke();
                    this.ctx.closePath();

                    this.beginPoint = endPoint;
                } else {
                    this.beginPoint = {
                        x: this.curve.path[0].x * this.elWidth,
                        y: this.curve.path[0].y * this.elHeight
                    };
                }
            }
            if (w.requestAnimationFrame) requestAnimationFrame(this.drawing.bind(this));
        },

        // 橡皮区域拖拽开始
        rubberStart: function (e, coords) {
            this.cbFunc('sync');
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
            this.cbFunc('async');
            this.clearEventBubble(e);
            var selDiv = document.getElementById('board-rubber-area');
            // 获取参数
            var l = selDiv.offsetLeft;
            var t = selDiv.offsetTop;
            var w = selDiv.offsetWidth;
            var h = selDiv.offsetHeight;

            this.checkInnerWriting({
                x: l,
                y: t,
                width: w,
                height: h
            });

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

                var xMin = Number((oContent.rectArea[0] * this.elWidth).toFixed(0));
                var xMax = Number((oContent.rectArea[1] * this.elWidth).toFixed(0));
                var yMin = Number((oContent.rectArea[2] * this.elHeight).toFixed(0));
                var yMax = Number((oContent.rectArea[3] * this.elHeight).toFixed(0));

                var rect2 = {
                    x: xMin,
                    y: yMin,
                    width: xMax - xMin,
                    height: yMax - yMin
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
            var l1 = {
                x: rect1.x,
                y: rect1.y
            };
            var r1 = {
                x: rect1.x + rect1.width,
                y: rect1.y + rect1.height
            };
            var l2 = {
                x: rect2.x,
                y: rect2.y
            };
            var r2 = {
                x: rect2.x + rect2.width,
                y: rect2.y + rect2.height
            };
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
                    x: Number((oPoint.currentMidX * this.elWidth).toFixed(0)),
                    y: Number((oPoint.currentMidY * this.elHeight).toFixed(0))
                };
                var coords2 = {
                    x: Number((oPoint.oldX * this.elWidth).toFixed(0)),
                    y: Number((oPoint.oldY * this.elHeight).toFixed(0))
                };
                var coords3 = {
                    x: Number((oPoint.oldMidX * this.elWidth).toFixed(0)),
                    y: Number((oPoint.oldMidY * this.elHeight).toFixed(0))
                };
                if (this.isFitPath(coords1, rectArea) || this.isFitPath(coords2, rectArea) || this.isFitPath(coords3, rectArea)) {
                    return true;
                }
            }
            return false;
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

        getInputCoords: function (e) {
            e = e.originalEvent ? e.originalEvent : e;
            var
                rect = this.el.getBoundingClientRect(),
                width = this.el.width,
                height = this.el.height,
                left = rect.left,
                top = rect.top;
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
                x: x,
                y: y
            };
        },

        // 初始化白板内容
        drawingContent: function (canvasSettings) {
            this.clearAll();

            if (!this.info.content.length) {
                this.setUp(canvasSettings);
                return;
            }

            var content = this.info.content;

            for (var i = 0, len = content.length; i < len; i++) {
                var oPathInfo = content[i];
                if (!oPathInfo || !oPathInfo.path.length) continue;

                var arr = oPathInfo.path;

                this.setUp(oPathInfo.canvasSettings);
                this.beginPoint = {
                    x: arr[0].x * this.elWidth,
                    y: arr[0].y * this.elHeight
                };
                
                for (var j = 0, length = arr.length; j < length; j++) {
                    if((j + 2) > arr.length) break;
                    if (j > 1) {
                        const lastTwoPoints = arr.slice(j, j + 2);
                        const controlPoint = {
                            x: lastTwoPoints[0].x * this.elWidth,
                            y: lastTwoPoints[0].y * this.elHeight
                        }
                        const endPoint = {
                            x: (lastTwoPoints[0].x * this.elWidth + lastTwoPoints[1].x * this.elWidth) / 2,
                            y: (lastTwoPoints[0].y * this.elHeight + lastTwoPoints[1].y * this.elHeight) / 2
                        }

                        this.ctx.beginPath();
                        this.ctx.moveTo(this.beginPoint.x, this.beginPoint.y);
                        this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
                        this.ctx.stroke();
                        this.ctx.closePath();

                        this.beginPoint = endPoint;
                    }
                }
            }

            // 恢复上一次的设置
            this.setUp(canvasSettings);
        },

        // 清除画布的所有内容
        clearAll: function () {
            var canvas = this.el;
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
        _self.oCanvas.cbFunc('sync');

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
        _self.oCanvas.cbFunc('async');

        var oStyle = w.getComputedStyle(_self.dom);
        _self.info.info.left = oStyle.left;
        _self.info.info.top = oStyle.top;
    }
    /***********************************************************************************/

})(typeof window !== 'undefined' ? window : global, document);