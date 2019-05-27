import './image.css';

export const Image = function (data, coordinate, Z_INDEX_TOTAL) {
    this.url = data;
    this.coordinate = coordinate;
    this.zIndex = Z_INDEX_TOTAL;
    this.dom = null;
    this.init();
};

Image.prototype = {
    init: function () {
        this.dom = document.createElement('div');
        this.dom.setAttribute("class", "board-drag-img");
        this.dom.style.cssText = "left: " + this.coordinate.x + "px; top: " + this.coordinate.y + "px; z-index: " + this.zIndex + "";
        var img = document.createElement('img');
        img.setAttribute('src', this.url);
        img.addEventListener('mousedown', function (ev) {
            ev.preventDefault()
        })
        this.dom.appendChild(img);
    }
};