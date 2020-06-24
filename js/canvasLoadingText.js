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
}
