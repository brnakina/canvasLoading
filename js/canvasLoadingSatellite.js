var canvasLoading = canvasLoading || {};
canvasLoading.satellite = class Satellite {

    constructor(settings, i) {

        const colorCode = (i, color) => {
            const from = parseInt(color.from, 16);
            const to = parseInt(color.to, 16);
            return ((to - from) * Math.abs(i - (settings.circleNumber / 2)) / (settings.circleNumber / 2)) + from;
        };

        const r = {
            from : settings.color1.slice(1,3),
            to : settings.color2.slice(1,3),
        };
        const g = {
            from : settings.color1.slice(3,5),
            to : settings.color2.slice(3,5),
        };
        const b = {
            from : settings.color1.slice(5,7),
            to : settings.color2.slice(5,7),
        };
        this.settings = settings;
        this.r = colorCode(i, r);
        this.g = colorCode(i, g);
        this.b = colorCode(i, b);
        this.radian = i * (2 * Math.PI / settings.circleNumber);
        this.resize();
    }

    move() {
        this.radian += this.settings.speed * 0.1 / 255;
        if(this.radian > Math.PI * 2){
            this.radian -= Math.PI * 2;
        }
        if(this.radian < Math.PI * 2 * -1){
            this.radian += Math.PI * 2;
        }
        this.x = Math.cos(this.radian) * this.orbitRadius + (this.settings.canvasSize / 2);
        this.y = Math.sin(this.radian) * this.orbitRadius + (this.settings.canvasSize / 2);

        return this;
    }

    resize() {
        this.radius = this.settings.canvasSize * this.settings.radius / 100;
        this.orbitRadius = (this.settings.canvasSize / 2) * (this.settings.orbitRadiusRate / 100);

        return this;
    }

    draw() {
        this.settings.ctx.beginPath();
        this.settings.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.settings.ctx.fillStyle = "rgba({r},{g},{b},1)".replace("{r}", this.r).replace("{g}", this.g).replace("{b}", this.b);
        this.settings.ctx.fill();
        if(this.settings.hasStroke){
            this.settings.ctx.strokeStyle = this.settings.strokeColor;
            this.settings.ctx.lineWidth = 0;
            this.settings.ctx.stroke();
        }

        return this;
    }
}
