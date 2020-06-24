var canvasLoading = canvasLoading || {};
canvasLoading.demo = (function(){
    const core = {
        _init : (settings) => {

          canvasLoading.vue = new Vue({
            el : "#contents",
            data : {
              settings : settings
            },
            computed : {
              source(){
                return `<script src=""></script>
<script>
  window.addEventListener('DOMContentLoaded', function() {
    canvasLoading.init({
      el : "${this.settings.el}",
      canvasSize : ${this.settings.canvasSize},
      circleNumber : ${this.settings.circleNumber},
      speed : ${this.settings.speed},
      orbitRadiusRate : ${this.settings.orbitRadiusRate},
      length : ${this.settings.length},
      radius : ${this.settings.radius},
      color1 : "${this.settings.color1}",
      color2 : "${this.settings.color2}",
      hasStroke : ${this.settings.hasStroke},
      strokeColor : "${this.settings.strokeColor}",
      text : "${this.settings.text}",
      textColor : "${this.settings.textColor}",
      fontsize : ${this.settings.fontsize},
      bold : ${this.settings.bold},
    });
  });
</script>`;
              },
            },
            methods : {
              onChange(){
                settings.canvas.setAttribute("width", settings.canvasSize);
                settings.canvas.setAttribute("height", settings.canvasSize);
                canvasLoading.newCanvas(this.settings);
              },
            },
          });
        }
    }

    return {
        init : core._init
    }
})();
