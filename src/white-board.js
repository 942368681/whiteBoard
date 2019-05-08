import './white-board.css';
import '../lib/font/font';
import '../lib/icon/iconfont.css';
import { Image } from './components/image/image';
import { Audio } from './components/audio/audio';
import { N2SVG } from './components/n2svg/n2svg';


(function() {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
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
            console.log('层级总数: ' + num);
            return num;
        },

        // 初始化画布布局
        initLayout: function () {
            var maxPage = Math.max.apply(Math, this.options.zIndexInfo.map(function(e) { return (e.page || 1) }));
            console.log('最大页数: ' + maxPage);
            this.wrapDom.style.height = maxPage*this.pageHeight + 'px';
            this.wrapDom.style.position = 'relative';

            for (var i = 0, len = this.options.zIndexInfo.length; i < len; i++) {
                var item = this.options.zIndexInfo[i];
                this.createCanvas(item);
            }

            /* var testBtn = document.createElement('button');
            testBtn.innerText = "img";
            testBtn.style.position = 'absolute';
            testBtn.style.zIndex = 999;
            this.wrapDom.appendChild(testBtn);
            var _self = this;
            testBtn.onclick = function () {
                _self.createMediaDom('N2', [{"path":"M21 23L23 23L28 26L33 29L39 30L42 32L45 33L46 34L47 34L47 35L48 35L49 36"}], true);
                // _self.createMediaDom('img', 'https://s.gravatar.com/avatar/7d228fb734bde96e1bae224107cc48cb', true);
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
            obj.canvas = new Canvas(canvas, obj, this.wrapDom);
        },

        // 获取随机位置
        getRandomPosition: function () {
            var clientW = this.wrapDom.clientWidth;
            var clientH = this.wrapDom.clientHeight;
            var xRange = [clientW * 0.2, clientW - clientW * 0.4];
            var yRange = [clientH * 0.2, clientH - clientH * 0.4];
            return {
                x: Math.round(Math.random() * (xRange[1] - xRange[0]) + xRange[0]),
                y: Math.round(Math.random() * (yRange[1] - yRange[0]) + yRange[0])
            }
        },

        // 插入多媒体模块及n2笔svg图片
        createMediaDom: function (type, data, initDrag) {
            this.zIndexTotal += 1;
            var dom = null;
            var info = {
                type: "",
                dom: "",
                zIndex: ""
            };
            var coordinate = this.getRandomPosition();
            switch (type) {
                case 'img':
                    dom = new Image(data, coordinate, this.zIndexTotal).dom;
                    info.type = "img";
                    info.dom = dom;
                    info.zIndex = this.zIndexTotal;
                    break;
                case 'video':
                    return alert("暂不支持");
                    break;
                case 'audio':
                    dom = new Audio(data, coordinate, this.zIndexTotal).dom;
                    info.type = "audio";
                    info.dom = dom;
                    info.zIndex = this.zIndexTotal;
                    break;
                case 'N2':
                    dom = new N2SVG(data, coordinate, this.zIndexTotal).dom;
                    info.type = "audio";
                    info.dom = dom;
                    info.zIndex = this.zIndexTotal;
                    break;
                default:
                    return alert("未知类型控件");
                    break;
            }
            this.wrapDom.appendChild(dom);
            if (initDrag) new Drag(dom, this.wrapDom);
        }
    };

    if(!w.WhiteBoard) w.WhiteBoard =  WhiteBoard;


    /******************************* 单个canvas画布对象 **********************************/
    var Canvas = function (el, obj, wrapDom) {
        this.el = el;
        this.info = obj;
        this.wrapDom = wrapDom;
        this.canvasSettings = {
            strokeStyle: obj.color || '#000',
            lineWidth: obj.size || 5,
            lineCap: "round"
        };
        this.isDrawing = false;
        this.coords = {};
        this.coords.old = this.coords.current = this.coords.oldMid = { x: 0, y: 0 };
        this.locus = null;
        this.initCtx();
        this.initDrawEvent();
        this.drawingContent();
    };

    Canvas.prototype = {
        // 初始化画笔样式
        initCtx: function () {
            this.ctx = this.el.getContext("2d");
            this.ctx.strokeStyle = this.canvasSettings.strokeStyle;
            this.ctx.lineWidth = this.canvasSettings.lineWidth;
            this.ctx.lineCap = this.canvasSettings.lineCap;
        },
        // 基础绘图功能
        initDrawEvent: function () {
            var _self = this;
            
            this.el.addEventListener('touchstart', function (e) {
                _self.touchStart.call(_self, e, _self.getInputCoords(e));
            });

            this.el.addEventListener('touchmove', function (e) {
                _self.touchMove.call(_self, e, _self.getInputCoords(e));
            });

            this.el.addEventListener('touchend', function (e) {
                _self.touchEnd.call(_self, e);
            });

            if (window.requestAnimationFrame) requestAnimationFrame( this.drawing.bind(this) );
        },
        // 触摸事件开始
        touchStart: function (e, coords) {
            this.isDrawing = true;
            this.coords.current = this.coords.old = coords;
            this.coords.oldMid = this.getMidInputCoords(coords);
            
            console.log(this.info);
            console.log(this.coords);

            this.locus = { path: 'M'+ this.coords.current.x +' '+ this.coords.current.y +'' };

            if (!window.requestAnimationFrame) this.drawing();
    
            e.stopPropagation();
            e.preventDefault();
        },
        // 触摸移动
        touchMove: function (e, coords) {
            this.coords.current = coords;

            this.locus.path = this.locus.path + 'L'+ this.coords.current.x +' '+ this.coords.current.y +'';
    
            if (!window.requestAnimationFrame) this.drawing();

            // console.log(this.coords);
    
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
            this.info.content.push(this.locus);
            console.log(JSON.stringify(this.info.content));
        },

        drawing: function () {
            if (this.isDrawing) {
                console.log('绘制中...');
                var currentMid = this.getMidInputCoords(this.coords.current);

                this.ctx.beginPath();
                this.ctx.moveTo(currentMid.x, currentMid.y);
                this.ctx.quadraticCurveTo(this.coords.old.x, this.coords.old.y, this.coords.oldMid.x, this.coords.oldMid.y);
                this.ctx.stroke();
    
                this.coords.old = this.coords.current;
                this.coords.oldMid = currentMid;
            }
    
            if (window.requestAnimationFrame) requestAnimationFrame( this.drawing.bind(this) );
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

        // 更改设置
        setUp: function (settings) {
            this.canvasSettings = Object.assign(this.canvasSettings, settings);
            this.initCtx();
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
        drawingContent: function () {
            if (!this.info.content.length) return;
            for (var i = 0, len = this.info.content.length; i < len; i++) {
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
            }
        },
        // 加页
        addPage: function () {

        },
    };
    /*************************************************************************/
    
    /********************************* 拖拽类 *********************************/
    function Drag(dom, wrapDom) {
        this.dom = dom;
        this.flag = false;
        var self = this;
        var sty = null;
        if (w.getComputedStyle) {
            sty = w.getComputedStyle(self.dom, null); // 非IE
        } else {
            sty = self.dom.currentStyle; // IE
        }
        this.maxLeft = wrapDom.clientWidth - sty.width.split('px')[0] - 20; //当前元素可移动的最大左偏移
        this.maxTop = wrapDom.clientHeight - sty.height.split('px')[0] - 20; //当前元素可移动的最大上偏移

        self.dom.addEventListener("mousedown", function (e) {
            self.down(self);
        }, false);
        self.dom.addEventListener("touchstart", function (e) {
            self.down(self);
        }, false)

    }
    //按下
    Drag.prototype.down = function (self) {
        self.flag = true;
        var touch;
        if (event.touches) {
            touch = event.touches[0];
        } else {
            touch = event;
        }
        var offLeft = touch.clientX - self.dom.offsetLeft; //当前点击点相对元素左边框的距离
        var offTop = touch.clientY - self.dom.offsetTop; //当前点击点相对元素上边框的距离

        w.addEventListener("mousemove", function () {
            self.move(self, offLeft, offTop);
        }, false);
        w.addEventListener("touchmove", function () {
            self.move(self, offLeft, offTop);
        }, false)
        w.addEventListener("mouseup", function () {
            self.end(self);
        }, false);
        w.addEventListener("touchend", function () {
            self.end(self);
        }, false);
    }
    //移动
    Drag.prototype.move = function (self, offLeft, offTop) {
        if (self.flag) {
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
            } else if (endX >= self.maxLeft) {
                endX = self.maxLeft;
            }
            if (endY <= 20) {
                endY = 20;
            } else if (endY >= self.maxTop) {
                endY = self.maxTop;
            }

            self.dom.style.left = endX + "px";
            self.dom.style.top = endY + "px";
        }
    }
    //释放
    Drag.prototype.end = function (self) {
        self.flag = false;
    }
    /***********************************************************************************/

})(typeof window !== 'undefined' ? window : global, document);

