import './audio.css';

export const Audio = function (data, coordinate, Z_INDEX_TOTAL) {
    // this.url = data;
    this.url = "http://audio.xmcdn.com/group27/M04/DC/4C/wKgJR1kIsODx5zSpADBCObWMDZc875.m4a"
    this.coordinate = coordinate;
    this.zIndex = Z_INDEX_TOTAL;
    this.dom = null;
    this.audio = null;
    this.btnL = null; // 左侧播放，暂停按钮
    this.btnR = null; // 右侧音量按钮
    this.rateLine - null; // 播放总进度条
    this.completeLine = null; // 已播放进度条
    this.point = null; // 播放进度圆点
    this.timeS = null; // 当前时间
    this.timeE = null; // 音频时长
    this.init();
};

Audio.prototype = {
    init: function () {
        this.createDom();
        this.initTime();
        this.bindEvent();
    },

    createDom: function () {
        this.dom = document.createElement('div');
        this.dom.setAttribute("class", "board-audio-player");
        this.dom.style.cssText = "left: " + this.coordinate.x + "px; top: " + this.coordinate.y + "px; z-index: " + this.zIndex + "";
        this.dom.setAttribute('src', this.url);

        var audio = document.createElement('audio');
        audio.setAttribute("id", "audioTag");
        audio.setAttribute("src", this.url);
        this.audio = audio;

        var controls = document.createElement('div');
        controls.setAttribute("class", "board-controls");

        var btnL = document.createElement('div');
        btnL.setAttribute("class", "board-btns-l");
        this.btnL = btnL;

        var palyBtn = document.createElement('i');
        palyBtn.setAttribute("class", "boardIcon board-icon-ziyuanldpi2 play");

        var rate = document.createElement('div');
        rate.setAttribute("class", "board-rate");

        var rateLine = document.createElement('div');
        rateLine.setAttribute("class", "board-rate-line");
        this.rateLine = rateLine;

        var completeLine = document.createElement('div');
        completeLine.setAttribute("class", "board-complete-line");
        this.completeLine = completeLine;

        var point = document.createElement('div');
        point.setAttribute("class", "board-point");
        this.point = point;

        var time = document.createElement('div');
        time.setAttribute("class", "board-time");

        var timeS = document.createElement('b');
        this.timeS = timeS;

        var timeE = document.createElement('b');
        this.timeE = timeE;

        var btnR = document.createElement('div');
        btnR.setAttribute("class", "board-btns-r"); 
        this.btnR = btnR;

        var volumeBtn = document.createElement('i');
        volumeBtn.setAttribute("class", "boardIcon board-icon-ziyuanldpi3 volume");

        this.dom.appendChild(audio);
        this.dom.appendChild(controls);
        controls.appendChild(btnL);
        controls.appendChild(rate);
        controls.appendChild(btnR);
        btnL.appendChild(palyBtn);
        rate.appendChild(rateLine);
        rate.appendChild(time);
        btnR.appendChild(volumeBtn);
        rateLine.appendChild(completeLine);
        completeLine.appendChild(point);
        time.appendChild(timeS);
        time.appendChild(timeE);
    },

    initTime: function () {
        this.timeS.innerText = "00:00";
        this.timeE.innerText = "--:--";
    },

    bindEvent: function () {
        this.btnL.addEventListener('click', this.playControl.bind(this));
        this.audio.addEventListener('loadedmetadata', function () {
            this.timeE.innerText = this.transTime(this.audio.duration);
        }.bind(this));
        this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
        this.rateLine.addEventListener('click', function (ev) {
            this.jumpTo(ev);
        }.bind(this));
        this.audio.addEventListener('ended', this.end.bind(this));
    },

    // 播放开始，暂停
    playControl: function () {
        if (this.audio.paused) {
            this.audio.play();
            this.btnL.getElementsByTagName('i')[0].classList.value = "boardIcon board-icon-ziyuanldpi1 pause";
        } else {
            this.audio.pause();
            this.btnL.getElementsByTagName('i')[0].classList.value = "boardIcon board-icon-ziyuanldpi2 play";
        }
    },

    // 播放中
    updateProgress: function () {
        var value = Math.round((Math.floor(this.audio.currentTime) / Math.floor(this.audio.duration)) * 100, 0);
        this.completeLine.style.width = value + "%";
        this.timeS.innerText = this.transTime(this.audio.currentTime);
    },

    // 跳转到指定位置
    jumpTo: function (ev) {
        var rate = ev.offsetX / this.rateLine.offsetWidth;
        this.audio.currentTime = this.audio.duration * rate;
        this.updateProgress();
    },

    // 播放结束
    end: function () {
        this.audio.currentTime = 0;
        this.timeS.innerText = "00:00";
        this.audio.pause();
        this.btnL.getElementsByTagName('i')[0].classList.value = "boardIcon board-icon-ziyuanldpi2 play";
    },

    //转换音频时长显示
    transTime: function (time) {
        var duration = parseInt(time);
        var minute = parseInt(duration / 60);
        var sec = duration % 60 + '';
        var isM0 = ':';
        if (minute == 0) {
            minute = '00';
        } else if (minute < 10) {
            minute = '0' + minute;
        }
        if (sec.length == 1) {
            sec = '0' + sec;
        }
        return minute + isM0 + sec;
    }
};
