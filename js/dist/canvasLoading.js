"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvasLoading = canvasLoading || {};
canvasLoading.text = function () {
    function Text(settings) {
        _classCallCheck(this, Text);

        this.settings = settings;
    }

    _createClass(Text, [{
        key: "draw",
        value: function draw(settings) {
            this.settings = settings;
            this.setRGB();
            this.settings.ctx.font = [this.settings.bold ? "bold" : "", this.settings.fontsize + "px", "sans-serif"].join(" ");
            this.settings.ctx.textAlign = "center";
            this.settings.ctx.textBaseline = "middle";
            this.settings.ctx.fillStyle = "rgba({r},{g},{b},1)".replace("{r}", this.r).replace("{g}", this.g).replace("{b}", this.b);
            this.settings.ctx.fillText(this.settings.text, this.settings.canvasSize / 2, this.settings.canvasSize / 2);

            return this;
        }
    }, {
        key: "setRGB",
        value: function setRGB() {
            this.r = this.settings.textColor.slice(1, 3);
            this.g = this.settings.textColor.slice(3, 5);
            this.b = this.settings.textColor.slice(5, 7);
        }
    }]);

    return Text;
}();
canvasLoading.satellite = function () {
    function Satellite(settings, i) {
        _classCallCheck(this, Satellite);

        this.settings = settings;
        this.i = i;
        this.radian = this.i * (2 * Math.PI / settings.circleNumber);
        this.color1 = settings.color1;
        this.color2 = settings.color2;
        this.length = settings.length;
        this.resize();
    }

    _createClass(Satellite, [{
        key: "colorCode",
        value: function colorCode(color) {
            var colorAddress = {
                red: {
                    from: 1,
                    to: 3
                },
                green: {
                    from: 3,
                    to: 5
                },
                blue: {
                    from: 5,
                    to: 7
                }
            };
            var target = colorAddress[color];
            var from = parseInt(this._color1.slice(target.from, target.to), 16);
            var to = parseInt(this._color2.slice(target.from, target.to), 16);
            return (to - from) * Math.abs(this.i - this.settings.circleNumber / 2) / (this.settings.circleNumber / 2) + from;
        }
    }, {
        key: "move",
        value: function move() {
            this.radian += this.settings.speed * 0.1 / 255;
            if (this.radian > Math.PI * 2) {
                this.radian -= Math.PI * 2;
            }
            if (this.radian < Math.PI * 2 * -1) {
                this.radian += Math.PI * 2;
            }
            this.x = Math.cos(this.radian) * this.orbitRadiusCalc + this.settings.canvasSize / 2;
            this.y = Math.sin(this.radian) * this.orbitRadiusCalc + this.settings.canvasSize / 2;

            this.innerX = Math.cos(this.radian) * this.orbitRadiusCalc * this.lengthCalc + this.settings.canvasSize / 2;
            this.innerY = Math.sin(this.radian) * this.orbitRadiusCalc * this.lengthCalc + this.settings.canvasSize / 2;

            return this;
        }
    }, {
        key: "resize",
        value: function resize() {
            this.radius = this.settings.radius;
            this.orbitRadius = this.settings.orbitRadiusRate;

            return this;
        }
    }, {
        key: "draw",
        value: function draw() {
            this.settings.ctx.beginPath();
            this.settings.ctx.arc(this.x, this.y, this.radiusCalc, this.radian + Math.PI * 0.5, this.radian - Math.PI * 0.5, true);
            this.settings.ctx.arc(this.innerX, this.innerY, this.radiusCalc, this.radian - Math.PI * 0.5, this.radian + Math.PI * 0.5, true);
            this.settings.ctx.closePath();
            this.settings.ctx.fillStyle = "rgba({r},{g},{b},1)".replace("{r}", this.r).replace("{g}", this.g).replace("{b}", this.b);
            this.settings.ctx.fill();
            if (this.settings.hasStroke) {
                this.settings.ctx.strokeStyle = this.settings.strokeColor;
                this.settings.ctx.lineWidth = 0;
                this.settings.ctx.stroke();
            }

            return this;
        }
    }, {
        key: "r",
        get: function get() {
            return this.colorCode("red");
        }
    }, {
        key: "g",
        get: function get() {
            return this.colorCode("green");
        }
    }, {
        key: "b",
        get: function get() {
            return this.colorCode("blue");
        }
    }, {
        key: "color1",
        get: function get() {
            return this._color1;
        },
        set: function set(value) {
            this._color1 = value;
        }
    }, {
        key: "color2",
        get: function get() {
            return this._color2;
        },
        set: function set(value) {
            this._color2 = value;
        }
    }, {
        key: "radiusCalc",
        get: function get() {
            return this.settings.canvasSize * this._radius / 100;
        }
    }, {
        key: "radius",
        get: function get() {
            return this._radius;
        },
        set: function set(value) {
            this._radius = value;
        }
    }, {
        key: "orbitRadiusCalc",
        get: function get() {
            return this.settings.canvasSize / 2 * this._orbitRadius / 100;
        }
    }, {
        key: "orbitRadius",
        get: function get() {
            return this._orbitRadius;
        },
        set: function set(value) {
            this._orbitRadius = value;
        }
    }, {
        key: "lengthCalc",
        get: function get() {
            return (100 - this._length) * 0.01;
        }
    }, {
        key: "length",
        get: function get() {
            return this._length;
        },
        set: function set(value) {
            this._length = value;
        }
    }]);

    return Satellite;
}();
var canvasLoading = Object.assign(canvasLoading, function () {

    var circles = [];
    var text = null;
    var timer = null;

    var settings = {
        el: "canvas_loading",
        canvasSize: 256,
        circleNumber: 20,
        speed: 60,
        orbitRadiusRate: 80,
        length: 0,
        radius: 3.5,
        color1: "#ffffff",
        color2: "#000000",
        hasStroke: true,
        strokeColor: "#000000",
        text: "Now Loading",
        textColor: "#000000",
        fontsize: 20,
        bold: true
    };

    var core = {
        _init: function _init(args) {

            Object.assign(settings, args);

            settings.canvas = document.getElementById(settings.el);
            settings.ctx = settings.canvas.getContext('2d');

            settings.canvas.setAttribute("width", settings.canvasSize);
            settings.canvas.setAttribute("height", settings.canvasSize);

            core._newCanvas();

            core._drive();

            if (canvasLoading.demo) {
                canvasLoading.demo.init(settings);
            }
        },
        _newCanvas: function _newCanvas() {
            if (!circles.length || circles.length !== settings.circleNumber) {
                circles = [];
                for (var i = 0; i < settings.circleNumber; i += 1) {
                    circles.push(new canvasLoading.satellite(settings, i));
                }
            }
            text = new canvasLoading.text(settings);
        },
        _drive: function _drive() {
            timer = setInterval(function () {
                settings.ctx.clearRect(0, 0, settings.canvasSize, settings.canvasSize);
                circles.forEach(function (circle) {
                    return circle.move().draw();
                });
                text.draw(settings);
            }, 1000 / 60);
        },
        _stop: function _stop() {
            clearInterval(timer);
        },
        _circles: function _circles() {
            return circles;
        },
        _open: function _open() {
            console.log(circles);
        },
        _close: function _close() {}
    };

    return {
        init: core._init,
        newCanvas: core._newCanvas,
        open: core._open,
        close: core._close,
        stop: core._stop,
        getCircles: core._circles
    };
}());
