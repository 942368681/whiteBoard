import './white-board.css';
import '../lib/font/font';
import '../lib/icon/iconfont.css';
import { Image } from './components/image/image';
import { Audio } from './components/audio/audio';
import { N2SVG } from './components/n2svg/n2svg'

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
        this.pageHeight = 400;
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
            // BOARD_ARR.push(info);
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
            this.el.onmousedown = this.drawStart.bind(this);
            this.el.ontouchstart  = this.drawStart.bind(this);
        },
        // 落笔
        drawStart: function (ev) {
            var ev = ev || w.event;
            var x = ev.offsetX || ev.touches[0].pageX.toFixed(0);
            var y = ev.offsetY || ev.touches[0].pageY.toFixed(0);
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);

            // 每次落笔创建一个轨迹对象记录轨迹以输出为svg path格式,存放在当前层画布对象的content中
            var locus = { path: 'M'+ x +' '+ y +'' };
            this.info.content.push(locus);
            
            this.el.onmousemove = this.drawMove.bind(this, locus);
            this.el.ontouchmove = this.drawMove.bind(this, locus);
            d.onmouseup = this.drawEnd.bind(this, locus);
            d.ontouchend = this.drawEnd.bind(this, locus);
        },
        // 移动画笔
        drawMove: function (locus, ev) {
            var ev = ev || w.event;
            var x = ev.offsetX || ev.touches[0].pageX.toFixed(0);
            var y = ev.offsetY || ev.touches[0].pageY.toFixed(0);

            locus.path = locus.path + 'L'+ x +' '+ y +'';

            this.ctx.lineTo(x, y);
            this.ctx.stroke(); 
        },
        // 结束绘画
        drawEnd: function () {
            this.el.onmousemove = d.onmouseup = null;
            this.el.ontouchmove = d.ontouchend = null;
            this.ctx.closePath();
            console.log(JSON.stringify(this.info.content));
            console.log(this.info);
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

