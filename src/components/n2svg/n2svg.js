import './n2svg.css';

export const N2SVG = function (data, coordinate, Z_INDEX_TOTAL) {
    this.data = data;
    this.paths = [];
    this.coordinate = coordinate;
    this.zIndex = Z_INDEX_TOTAL;
    this.dom = null;
    this.handleData();
    this.init();
};

N2SVG.prototype = {
    handleData: function () {
        for (var i = 0, len = this.data.length; i < len; i++) {
            var oPathData = this.data[i];
            var oPathStr = "";
            for (var j = 0, length = oPathData.length; j < length; j++) {
                oPathStr += ' M' + oPathData[j].currentMidX + ',' + oPathData[j].currentMidY + ' Q' + oPathData[j].oldX + ',' + oPathData[j].oldY + ' ' + oPathData[j].oldMidX + ',' + oPathData[j].oldMidY;
            }
            this.paths.push({ path: oPathStr });
        }
    },
    init: function () {
        this.dom = document.createElement('div');
        this.dom.setAttribute("class", "board-drag-svg");
        this.dom.style.cssText = "left: " + this.coordinate.x + "px; top: " + this.coordinate.y + "px; z-index: " + this.zIndex + "";
        var svgNodes = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgNodes.setAttribute('width', 100);
        svgNodes.setAttribute('height', 100);

        for (var i = 0, len = this.paths.length; i < len; i++) {
            var pathNodes = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathNodes.setAttribute('d', this.paths[i].path);
            pathNodes.setAttribute('fill', 'transparent');
            pathNodes.setAttribute('stroke', '#000');
            pathNodes.setAttribute('stroke-width', '5');
            pathNodes.setAttribute('strock-linecap', 'round');
            svgNodes.appendChild(pathNodes);
        }

        this.dom.appendChild(svgNodes);
    }
};