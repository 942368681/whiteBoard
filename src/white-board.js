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
        this.pageHeight = this.wrapDom.getBoundingClientRect().height;
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

            // 清理dom和已挂载到canvasObj的canvas实例
            while (this.wrapDom.children.length) {
                this.wrapDom.removeChild(this.wrapDom.firstElementChild);
            }
            this.canvasObj = [];

            for (var i = 0, len = this.options.zIndexInfo.length; i < len; i++) {
                var item = this.options.zIndexInfo[i];
                this.createCanvas(item);
            }

            // 加纸按钮
            var addPageBtn = document.createElement('button');
            addPageBtn.setAttribute('class', 'boardIcon board-icon-jia board-add-page');
            this.wrapDom.appendChild(addPageBtn);
            var _self = this;
            addPageBtn.onclick = function () {
                _self.addPage();
            }; 

            // 测试多媒体控件dom接入
            /* var testBtn = document.createElement('button');
            testBtn.innerText = "img";
            testBtn.style.position = 'absolute';
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
            }; */
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
            this.options.zIndexInfo[0].page += 1;
            this.initLayout();
            if (this.options.addCallBack && typeof this.options.addCallBack === 'function') this.options.addCallBack();
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
            oCanvas.debounce(oCanvas.watcher.cb, oCanvas.watcher.wait)();
            if (initDrag) new Drag(dom, oCanvas, info);
        },

        // 通知元素已被删除
        deleteElFromOtherData: function (type, zIndex, dom) {
            for (var i = 0, len = this.canvasObj[0].info.other[type].length; i < len; i++) {
                if (this.canvasObj[0].info.other[type][i].zIndex === zIndex) {
                    this.canvasObj[0].info.other[type].splice(i, 1);
                    break;
                }
            }
            this.canvasObj[0].el.parentNode.removeChild(dom);
            console.log(this.canvasObj[0].info.other[type]);
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
            globalCompositeOperation: '',
            inputType: ''
        };
        this.rubberRange = 5;
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
                globalCompositeOperation: obj.inputType && obj.inputType === 'fluorescent-pen' ? 'darken' : 'source-over',
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
        // 基础绘图功能
        initDrawEvent: function () {
            var _self = this;
            
            // touch事件
            this.el.addEventListener('touchstart', function (e) {
                _self.touchStart.call(_self, e, _self.getInputCoords(e));
            });

            this.el.addEventListener('touchmove', function (e) {
                _self.touchMove.call(_self, e, _self.getInputCoords(e));
            });

            this.el.addEventListener('touchend', function (e) {
                _self.info.update = true;
                _self.touchEnd.call(_self, e);
            });

            // mouse事件
            this.el.addEventListener('mousedown', function (e) {
                _self.touchStart.call(_self, e, _self.getInputCoords(e));
            });
            
            this.el.addEventListener('mousemove', function (e) {
                _self.touchMove.call(_self, e, _self.getInputCoords(e));
            });
            
            this.el.addEventListener('mouseup', function (e) {
                _self.info.update = true;
                _self.touchEnd.call(_self, e);
            });

            // 监听输入完毕，触发异步回调
            if (_self.watcher && _self.watcher.cb && typeof _self.watcher.cb === "function") {
                this.el.addEventListener('touchend', _self.debounce(_self.watcher.cb, _self.watcher.wait));
                this.el.addEventListener('mouseup', _self.debounce(_self.watcher.cb, _self.watcher.wait));
            }

            // 监听输入开始，触发同步回调(兼容事件只执行一次)
            if (_self.writeCallBack && _self.writeCallBack.cb && typeof _self.writeCallBack.cb === "function") {
                this.el.addEventListener('touchstart', function fn (e) {
                    if (_self.writeCallBack.type && _self.writeCallBack.type === 'once') e.target.removeEventListener('touchstart', fn);
                    return _self.writeCallBack.cb();
                });
                this.el.addEventListener('mousedown', function fn (e) {
                    if (_self.writeCallBack.type && _self.writeCallBack.type === 'once') e.target.removeEventListener('mousedown', fn);
                    return _self.writeCallBack.cb();
                });
            }

            if (w.requestAnimationFrame) requestAnimationFrame( this.drawing.bind(this) );
        },
        // 防抖
        debounce: function (func, wait) {
            var _self = this;
            return function () {
                clearTimeout(_self.timeout);
                _self.timeout = setTimeout(func, wait);
            }
        },
        // 触摸事件开始
        touchStart: function (e, coords) {
            if (e.touches && e.touches.length > 1) {
                this.isDrawing = false;
                return;
            };

            this.isDrawing = true;
            this.coords.current = this.coords.old = coords;
            this.coords.oldMid = this.getMidInputCoords(coords);
            
            console.log(this.coords);

            // this.locus = { path: 'M'+ this.coords.current.x +' '+ this.coords.current.y +'' };
            this.curve = {
                path: [],
                canvasSettings: Object.assign({}, this.canvasSettings)
            };

            if (!w.requestAnimationFrame) this.drawing();
    
            e.stopPropagation();
            e.preventDefault();
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
                var pos = {
                    x: coords.x,
                    y: coords.y
                };
                this.removeOnePath(pos);
            }

            // this.locus.path = this.locus.path + 'L'+ this.coords.current.x +' '+ this.coords.current.y +'';
            // this.curve.path.push([this.coords.old.x, this.coords.old.y, this.coords.oldMid.x, this.coords.oldMid.y]);
    
            if (!w.requestAnimationFrame) this.drawing();

            e.stopPropagation();
            e.preventDefault();
        },
        // 触摸结束
        touchEnd: function (e) {
            if (this.isDrawing && (!e.touches || e.touches.length === 0)) {
                this.isDrawing = false;
                e.stopPropagation();
                e.preventDefault();
            }
            // this.info.content.push(this.locus);
            if (this.canvasSettings.inputType !== 'rubber') {
                this.info.content.push(this.curve);
            }
            // console.log(this.info.content);
        },

        drawing: function () {
            if (this.isDrawing) {
                var currentMid = this.getMidInputCoords(this.coords.current);
                
                if (this.canvasSettings.inputType !== 'rubber') {
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
            }
            if (w.requestAnimationFrame) requestAnimationFrame( this.drawing.bind(this) );
        },

        // 去除一条匹配的轨迹
        removeOnePath: function (coords) {
            if (!this.info.content.length) {
                return;
            };
            for (var i = 0, len = this.info.content.length; i < len; i++) {
                if (!this.info.content[i]) break;
                var matchResult = this.matchPath(coords, this.info.content[i].path);
                if (matchResult) {
                    this.info.content.splice(i, 1);
                    i = i - 1;
                };
            }
            this.drawingContent(Object.assign({}, this.canvasSettings));
        },
        // 根据点击坐标匹配选中的一条轨迹
        matchPath: function (coords, pathArr) {
            var _self = this;
            var pointArr = pathArr.map(function (e) {
                return [e.currentMidX, e.currentMidY, e.oldMidX, e.oldMidY];
            });

            var bool = pointArr.some(function (e) {
                return _self.distanceOfPoint2Line(coords.x, coords.y, e[0], e[1], e[2], e[3]) <= (_self.rubberRange*_self.rubberRange);
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
                height = this.el.height
            ;
            var x, y;
            if (e.touches && e.touches.length == 1) {
                x = e.touches[0].pageX;
                y = e.touches[0].pageY;
            } else {
                x = e.pageX;
                y = e.pageY;
            }
            x = x - this.el.getBoundingClientRect().left;
            y = y - this.el.getBoundingClientRect().top;
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
        drawingContent: function (canvasSettings) {
            this.clearAll();

            if (!this.info.content.length) return;

            var content = this.info.content.filter(function (e) {
                return e;
            });

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

            for (var i = 0, len = content.length; i < len; i++) {
                var oPathInfo = content[i];
                var arr = oPathInfo.path;
                this.setUp(oPathInfo.canvasSettings);
                for (var j = 0, length = arr.length; j < length; j++) {
                    var currentMidX = arr[j].currentMidX;
                    var currentMidY = arr[j].currentMidY;
                    var oldX = arr[j].oldX;
                    var oldY = arr[j].oldY;
                    var oldMidX = arr[j].oldMidX;
                    var oldMidY = arr[j].oldMidY;
                    this.ctx.beginPath();
                    this.ctx.moveTo(currentMidX, currentMidY);
                    this.ctx.quadraticCurveTo(oldX, oldY, oldMidX, oldMidY);
                    this.ctx.stroke();
                }
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
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
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
        _self.flag = true;
        var touch;
        if (event.touches) {
            touch = event.touches[0];
        } else {
            touch = event;
        }
        var offLeft = touch.clientX - _self.dom.offsetLeft; //当前点击点相对元素左边框的距离
        var offTop = touch.clientY - _self.dom.offsetTop; //当前点击点相对元素上边框的距离

        window.onmousemove = function () {
            _self.move(_self, offLeft, offTop);
        }
        window.onmouseup = function () {
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
        window.onmousemove = null;
        window.onmouseup = null;
        _self.flag = false;
        _self.oCanvas.debounce(_self.oCanvas.watcher.cb, _self.oCanvas.watcher.wait)();
        var oStyle = w.getComputedStyle(_self.dom);
        _self.info.info.left = oStyle.left;
        _self.info.info.top = oStyle.top;
    }
    /***********************************************************************************/

})(typeof window !== 'undefined' ? window : global, document);

