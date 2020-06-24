var canvasLoading = Object.assign(canvasLoading,
    (function(){

        let circles = [];
        let text = null;

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
                setInterval(() => {
                    settings.ctx.clearRect(0, 0, settings.canvasSize, settings.canvasSize);
                    circles.forEach(circle => circle.move().draw());
                    text.draw(settings);
                }, 1000 / 60);
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
            getCircles : core._circles,
        };
    })()
);
