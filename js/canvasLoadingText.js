var canvasLoading = canvasLoading || {};
canvasLoading.text = class Text {

    constructor(settings) {
        this.settings = settings;
    }

    draw() {
        this.settings.ctx.font = [
            (this.settings.bold ? "bold" : ""),
            (this.settings.fontsize + "px"),
            "sans-serif"
        ].join(" ");
        this.settings.ctx.textAlign = "center";
        this.settings.ctx.textBaseline = "middle";
        this.settings.ctx.fillText(this.settings.text, this.settings.canvasSize / 2, this.settings.canvasSize / 2);

        return this;
    }
}
