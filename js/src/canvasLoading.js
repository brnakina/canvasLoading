var canvasLoading = canvasLoading || {};
canvasLoading.text = class Text {

    constructor(settings) {
        this.settings = settings;
    }

    draw(settings) {
    	this.settings = settings;
    	this.setRGB();
        this.settings.ctx.font = [
            (this.settings.bold ? "bold" : ""),
            (this.settings.fontsize + "px"),
            "sans-serif"
        ].join(" ");
        this.settings.ctx.textAlign = "center";
        this.settings.ctx.textBaseline = "middle";
        this.settings.ctx.fillStyle = "rgba({r},{g},{b},1)".replace("{r}", this.r).replace("{g}", this.g).replace("{b}", this.b);
        this.settings.ctx.fillText(this.settings.text, this.settings.canvasSize / 2, this.settings.canvasSize / 2);

        return this;
    }

    setRGB(){
        this.r = this.settings.textColor.slice(1,3);
        this.g = this.settings.textColor.slice(3,5);
        this.b = this.settings.textColor.slice(5,7);
    }
};
canvasLoading.satellite = class Satellite {

    constructor(settings, i) {

        this.settings = settings;
        this.i = i;
        this.radian = this.i * (2 * Math.PI / settings.circleNumber);
        this.color1 = settings.color1;
        this.color2 = settings.color2;
        this.length = settings.length;
        this.resize();
    }

    colorCode(color) {
        const colorAddress = {
            red : {
                from : 1,
                to : 3
            },
            green : {
                from : 3,
                to : 5
            },
            blue : {
                from : 5,
                to : 7
            }
        };
        const target = colorAddress[color];
        const from = parseInt(this._color1.slice(target.from, target.to), 16);
        const to = parseInt(this._color2.slice(target.from, target.to), 16);
        return ((to - from) * Math.abs(this.i - (this.settings.circleNumber / 2)) / (this.settings.circleNumber / 2)) + from;
    }

    get r(){
        return this.colorCode("red");
    }

    get g(){
        return this.colorCode("green");
    }

    get b(){
        return this.colorCode("blue");
    }

    get color1(){
        return this._color1;
    }

    set color1(value){
        this._color1 = value;
    }

    get color2(){
        return this._color2;
    }

    set color2(value){
        this._color2 = value;
    }

    get radiusCalc(){
        return this.settings.canvasSize * this._radius / 100;
    }

    get radius(){
        return this._radius;
    }

    set radius(value){
        this._radius = value;
    }

    get orbitRadiusCalc(){
        return this.settings.canvasSize / 2 * this._orbitRadius / 100;
    }

    get orbitRadius(){
        return this._orbitRadius;
    }

    set orbitRadius(value){
        this._orbitRadius = value;
    }

    get lengthCalc(){
        return (100 - this._length) * 0.01;
    }

    get length(){
        return this._length;
    }

    set length(value){
        this._length = value;
    }

    move() {
        this.radian += this.settings.speed * 0.1 / 255;
        if(this.radian > Math.PI * 2){
            this.radian -= Math.PI * 2;
        }
        if(this.radian < Math.PI * 2 * -1){
            this.radian += Math.PI * 2;
        }
        this.x = Math.cos(this.radian) * this.orbitRadiusCalc + (this.settings.canvasSize / 2);
        this.y = Math.sin(this.radian) * this.orbitRadiusCalc + (this.settings.canvasSize / 2);

        this.innerX = Math.cos(this.radian) * this.orbitRadiusCalc * this.lengthCalc + (this.settings.canvasSize / 2);
        this.innerY = Math.sin(this.radian) * this.orbitRadiusCalc * this.lengthCalc + (this.settings.canvasSize / 2);

        return this;
    }

    resize() {
        this.radius = this.settings.radius;
        this.orbitRadius = this.settings.orbitRadiusRate;

        return this;
    }

    draw() {
        this.settings.ctx.beginPath();
        this.settings.ctx.arc(this.x, this.y, this.radiusCalc, this.radian + Math.PI * 0.5, this.radian - Math.PI * 0.5, true);
        this.settings.ctx.arc(this.innerX, this.innerY, this.radiusCalc, this.radian - Math.PI * 0.5, this.radian + Math.PI * 0.5, true);
        this.settings.ctx.closePath();
        this.settings.ctx.fillStyle = "rgba({r},{g},{b},1)".replace("{r}", this.r).replace("{g}", this.g).replace("{b}", this.b);
        this.settings.ctx.fill();
        if(this.settings.hasStroke){
            this.settings.ctx.strokeStyle = this.settings.strokeColor;
            this.settings.ctx.lineWidth = 0;
            this.settings.ctx.stroke();
        }

        return this;
    }
};
var canvasLoading = Object.assign(canvasLoading,
    (function(){

        let circles = [];
        let text = null;
		let timer = null;

        let settings = {
            el : "canvas_loading",
            canvasSize : 256,
            circleNumber : 20,
            speed : 60,
            orbitRadiusRate : 80,
            length : 0,
            radius : 3.5,
            color1 : "#ffffff",
            color2 : "#000000",
            hasStroke : true,
            strokeColor : "#000000",
            text : "Now Loading",
            textColor : "#000000",
            fontsize : 20,
            bold : true,
        };

        const core = {
            _init(args){

                Object.assign(settings, args);

                settings.canvas = document.getElementById(settings.el);
                settings.ctx = settings.canvas.getContext('2d');

                settings.canvas.setAttribute("width", settings.canvasSize);
                settings.canvas.setAttribute("height", settings.canvasSize);

                core._newCanvas();

                core._drive();

                if(canvasLoading.demo){
                    canvasLoading.demo.init(settings);
                }
            },

            _newCanvas(){
                circles = [];
                for(let i = 0; i < settings.circleNumber; i += 1){
                    circles.push(new canvasLoading.satellite(settings, i));
                }
                text = new canvasLoading.text(settings);
            },

            _drive(){
                timer = setInterval(() => {
                    settings.ctx.clearRect(0, 0, settings.canvasSize, settings.canvasSize);
                    circles.forEach(circle => circle.move().draw());
                    text.draw(settings);
                }, 1000 / 60);
            },

            _stop(){
            	clearInterval(timer);
            },

            _circles(){
                return circles;
            },

            _open(){
                console.log(circles);
            },

            _close(){

            }
        };

        return {
            init : core._init,
            newCanvas : core._newCanvas,
            open : core._open,
            close : core._close,
			stop : core._stop,
            getCircles : core._circles,
        };
    })()
);
