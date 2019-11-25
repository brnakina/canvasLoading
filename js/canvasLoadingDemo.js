var canvasLoading = canvasLoading || {};
canvasLoading.demo = (function(){
    const core = {
        _init : (settings) => {

            const speedBar = document.getElementById('speed');
            speedBar.oninput = function(){
                document.getElementById('speed_output').value = this.value;
                settings.speed = this.value;
            }

            const sizeBar = document.getElementById('size');
            sizeBar.oninput = function(){
                document.getElementById('size_output').value = this.value;
                settings.canvasSize = this.value;
                settings.canvas.setAttribute("width", settings.canvasSize);
                settings.canvas.setAttribute("height", settings.canvasSize);
                canvasLoading.circles.forEach(circle => circle.resize());
                canvasLoading.newCanvas();
            }

            const orbitRadiusRateBar = document.getElementById('orbit_radius_rate');
            orbitRadiusRateBar.oninput = function(){
                document.getElementById('orbit_radius_rate_output').value = this.value;
                settings.orbitRadiusRate = this.value;
                canvasLoading.circles.forEach(circle => circle.resize());
                canvasLoading.newCanvas();
            }

            const circleNumberBar = document.getElementById('circle_number_bar');
            circleNumberBar.oninput = function(){
                document.getElementById('circle_number_output').value = this.value;
                settings.circleNumber = this.value;
                canvasLoading.newCanvas();
            }

            const radiusBar = document.getElementById('radius_bar');
            radiusBar.oninput = function(){
                document.getElementById('radius_output').value = this.value;
                settings.radius = this.value;
                canvasLoading.circles.forEach(circle => circle.resize());
                canvasLoading.newCanvas();
            }

            const color1 = document.getElementById('color_1_bar');
            color1.onchange = function(){
                document.getElementById('color_1_output').value = this.value;
                settings.color1 = this.value;
                canvasLoading.newCanvas();
            }

            const color2 = document.getElementById('color_2_bar');
            color2.onchange = function(){
                document.getElementById('color_2_output').value = this.value;
                settings.color2 = this.value;
                canvasLoading.newCanvas();
            }

            const strokeColor = document.getElementById('stroke_color');
            strokeColor.onchange = function(){
                document.getElementById('stroke_color_output').value = this.value;
                settings.strokeColor = this.value;
                canvasLoading.newCanvas();
            }

            const hasStroke = document.getElementById('has_stroke');
            hasStroke.onclick = function(){
                settings.hasStroke = this.checked;
                canvasLoading.newCanvas();
            }

            const text = document.getElementById('text');
            text.onchange = function(){
                settings.text = this.value;
                canvasLoading.newCanvas();
            }

            const fontsize = document.getElementById('fontsize');
            fontsize.onchange = function(){
                document.getElementById('fontsize_output').value = this.value;
                settings.fontsize = this.value;
                canvasLoading.newCanvas();
            }

            const bold = document.getElementById('bold');
            bold.onclick = function(){
                settings.bold = this.checked;
                canvasLoading.newCanvas();
            }

            const textColor = document.getElementById('text_color');
            textColor.onchange = function(){
                document.getElementById('text_color_output').value = this.value;
                settings.textColor = this.value;
                canvasLoading.newCanvas();
            }

            speedBar.value = settings.speed;
            sizeBar.value = settings.canvasSize;
            orbitRadiusRateBar.value = settings.orbitRadiusRate;
            circleNumberBar.value = settings.circleNumber;
            radiusBar.value = settings.radius;
            color1.value = settings.color1;
            color2.value = settings.color2;
            strokeColor.value = settings.strokeColor;
            hasStroke.value = settings.hasStroke;
            text.value = settings.text;
            fontsize.value = settings.fontsize;
            bold.checked = settings.bold;
            textColor.value = settings.textColor;
        }
    }

    return {
        init : core._init
    }
})();