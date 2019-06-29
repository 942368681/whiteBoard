import './image.css';

export const Image = function (info, superClass) {
    this.info = info;
    this.url = info.info.url;
    this.zIndex = info.zIndex;
    this.dom = null;
    this.superClass = superClass;
    this.isScale = false;
    this.init();
};

Image.prototype = {
    // dom初始化
    init: function () {
        var _self = this;
        this.dom = document.createElement('div');
        this.dom.setAttribute("class", "board-drag-img");
        this.dom.style.cssText = "left: " + this.info.info.left + "; top: " + this.info.info.top + "; z-index: " + this.zIndex + "; width:"+ this.info.info.width +"; height: "+ this.info.info.height +"";

        var img = document.createElement('img');
        img.setAttribute('src', this.url);
        img.addEventListener('mousedown', function (ev) {
            ev.preventDefault();
        });

        img.onload = function () {
            if (_self.info.info.rotate) img.style.transform = _self.info.info.rotate;
        };

        var rotateIconDom = document.createElement('i');
        rotateIconDom.setAttribute('class', 'boardIcon board-icon-yulanxuanzhuan board-rotate');

        var scaleIconDom = document.createElement('i');
        scaleIconDom.setAttribute('class', 'boardIcon board-icon-amplification_icon board-scale');

        var deleteIconDom = document.createElement('i');
        deleteIconDom.setAttribute('class', 'boardIcon board-icon-shanchu board-delete');

        var basePoint = document.createElement('b');
        basePoint.setAttribute('class', 'board-base-point');

        var baseXpoint = document.createElement('b');
        baseXpoint.setAttribute('class', 'board-base-x-point');

        var baseYpoint = document.createElement('b');
        baseYpoint.setAttribute('class', 'board-base-y-point');
        
        this.dom.appendChild(img);
        this.dom.appendChild(rotateIconDom);
        this.dom.appendChild(scaleIconDom);
        this.dom.appendChild(deleteIconDom);
        this.dom.appendChild(basePoint);
        this.dom.appendChild(baseXpoint);
        this.dom.appendChild(baseYpoint);

        this.bindEvents();
    },

    // 绑定事件
    bindEvents: function () {
        var _self = this;
        var rotateBtn = this.dom.getElementsByClassName('board-rotate')[0];
        var scaleBtn = this.dom.getElementsByClassName('board-scale')[0];
        var deleteBtn = this.dom.getElementsByClassName('board-delete')[0];

        // 绑定删除事件
        deleteBtn.addEventListener('mousedown', function (ev) {
            _self.cancelAll(ev);
            _self.deleteIt('img', _self.zIndex, _self.dom);

        });
        deleteBtn.addEventListener('touchstart', function (ev) {
            _self.cancelAll(ev);
            _self.deleteIt('img', _self.zIndex, _self.dom);
        });

        // 绑定缩放事件
        scaleBtn.addEventListener('mousedown', function (ev) {
            _self.cancelAll(ev);
            _self.isScale = true;
            _self.scaleStart(ev);

        });
        scaleBtn.addEventListener('touchstart', function (ev) {
            _self.cancelAll(ev);
            _self.isScale = true;
            _self.scaleStart(ev);
        });

        // 绑定旋转事件
        rotateBtn.addEventListener('mousedown', function (ev) {
            _self.cancelAll(ev);
            _self.rotateIt(ev);

        });
        rotateBtn.addEventListener('touchstart', function (ev) {
            _self.cancelAll(ev);
            _self.rotateIt(ev);
        });
    },

    // 阻止冒泡，默认行为
    cancelAll: function (ev) {
        ev.preventDefault();
        ev.cancelBubble = true;
        ev.stopPropagation();
    },

    // 删除这个图片
    deleteIt: function (type, zIndex, dom) {
        this.superClass.deleteElFromOtherData(type, zIndex, dom);
    },

    // 旋转（顺时针一次90deg）
    rotateIt: function () {
        var oImg = this.dom.getElementsByTagName('img')[0];
        oImg.style.transition = 'all .2s ease-in-out';
        var trans = this.dom.getElementsByTagName('img')[0].style.transform;
        if (!trans) {
            oImg.style.transform = 'rotate(90deg)';
        } else {
            var prevDeg = Number(trans.match(/\((.+)\d/g)[0].substr(1));
            prevDeg += 90;
            oImg.style.transform = 'rotate('+ prevDeg +'deg)';
        }

        // 执行回调
        var oCanvas = this.superClass.canvasObj[0];
        oCanvas.cbFunc(true, 'all');

        this.setDomInfo('rotate');
    },

    // 缩放开始
    scaleStart: function (e) {
        var _self = this;
        // 执行回调
        var oCanvas = _self.superClass.canvasObj[0];
        oCanvas.cbFunc(false, 'sync');

        var coords = this.getPos(e);
        var pos = {
            'w': this.dom.getBoundingClientRect().width,
            'h': this.dom.getBoundingClientRect().height,
            'x': coords.x,
            'y': coords.y
        };
        var basePoint = {
            x: Number(_self.dom.getElementsByClassName('board-base-point')[0].getBoundingClientRect().left.toFixed(0)),
            y: Number(_self.dom.getElementsByClassName('board-base-point')[0].getBoundingClientRect().top.toFixed(0))
        };
        var baseXpoint = {
            x: Number(_self.dom.getElementsByClassName('board-base-x-point')[0].getBoundingClientRect().left.toFixed(0)),
            y: Number(_self.dom.getElementsByClassName('board-base-x-point')[0].getBoundingClientRect().top.toFixed(0)),
        };
        var baseYpoint = {
            x: Number(_self.dom.getElementsByClassName('board-base-y-point')[0].getBoundingClientRect().left.toFixed(0)),
            y: Number(_self.dom.getElementsByClassName('board-base-y-point')[0].getBoundingClientRect().top.toFixed(0)),
        };
        window.onmousemove = function (ev) {
            _self.scaleing(pos, basePoint, baseXpoint, baseYpoint, ev);
        };
        window.onmouseup = function () {
            _self.scaleEnd();
        };
        window.addEventListener('touchmove', function (ev) {
            _self.scaleing(pos, basePoint, baseXpoint, baseYpoint, ev);
        });
        window.addEventListener('touchend', function () {
            _self.scaleEnd();
        });
    },

    // 缩放中
    scaleing: function (pos, basePoint, baseXpoint, baseYpoint, ev) {
        if (!this.isScale) return;
        var _self = this;

        var resultX = _self.computeOffset(basePoint, baseXpoint, _self.getPos(ev));
        var resultY = _self.computeOffset(basePoint, baseYpoint, _self.getPos(ev));
        var disX = Number(_self.distanceOfPoint2Line(basePoint, baseXpoint, _self.getPos(ev)).toFixed(0));
        var disY = Number(_self.distanceOfPoint2Line(basePoint, baseYpoint, _self.getPos(ev)).toFixed(0));

        if (resultX >= 0 ) {
            disX = disX;
        } else {
            disX = -disX;
        }
        if (resultY < 0 ) {
            disY = disY;
        } else {
            disY = -disY;
        }

        var wrapDom = this.superClass.canvasObj[0].el.parentNode;
        var w = Math.max(120, pos.w + disX);
        var h = Math.max(120, pos.h + disY);
        w = w >= wrapDom.offsetWidth - _self.dom.offsetLeft - 20 ? wrapDom.offsetWidth - _self.dom.offsetLeft - 20 : w;
        h = h >= wrapDom.offsetHeight - _self.dom.offsetTop - 20 ? wrapDom.offsetHeight - _self.dom.offsetTop - 20 : h;
        var x = Math.min(w, h);
        _self.dom.style.width = x + 'px';
        _self.dom.style.height = x + 'px';

    },

    // 缩放结束
    scaleEnd: function () {
        if (!this.isScale) return;
        window.onmousemove = null;
        window.onmouseup = null;
        this.isScale = false;
        
        // 执行回调
        var oCanvas = this.superClass.canvasObj[0];
        oCanvas.cbFunc(true, 'async');

        this.setDomInfo('scale');
    },

    // 计算某点在某线段的左侧还是右侧
    computeOffset: function (basePoint, point, pos) {
        var p1 = [basePoint.x - pos.x, basePoint.y - pos.y];
        var p2 = [point.x - pos.x, point.y - pos.y];
        return p1[0]*p2[1] - p1[1]*p2[0];
    },

    /**
     * 计算某点到直线的垂直距离
     * @param {x, y} p1 直线上的点p1
     * @param {x, y} p2 直线上的点p2
     * @param {x, y} p3 直线外的点
     */
    distanceOfPoint2Line: function (p1, p2, p3) {
        var len;

        if (p1.x - p2.x == 0) {
            len = Math.abs(p3.x - p1.x)
        } else {
            var A = (p1.y - p2.y) / (p1.x - p2.x)
            var B = p1.y - A * p1.x

            len = Math.abs((A * p3.x + B - p3.y) / Math.sqrt(A * A + 1))
        }

        return len;
    },

    // 计算鼠标或手指位置
    getPos: function (e) {
        var x, y;
        if (e.touches && e.touches.length == 1) {
            x = e.touches[0].pageX;
            y = e.touches[0].pageY;
        } else {
            x = e.pageX;
            y = e.pageY;
        }
        return {
            x: Number(x.toFixed(0)),
            y: Number(y.toFixed(0))
        }
    },

    // 设置该图片实例dom信息
    setDomInfo: function (type) {
        var oStyle = window.getComputedStyle(this.dom);
        switch (type) {
            case 'scale':
                this.info.info.width = oStyle.width;
                this.info.info.height = oStyle.height;
                break;
            case 'rotate':
                this.info.info.rotate = this.dom.getElementsByTagName('img')[0].style.transform;
                break;
            default:
                break;
        }
    }

};