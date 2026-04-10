const TWO_PI = Math.PI * 2;

export const defaultSettings = {
  el: 'canvas_loading',
  canvasSize: 256,
  circleNumber: 20,
  speed: 60,
  orbitRadiusRate: 80,
  length: 0,
  radius: 3.5,
  color1: '#ffffff',
  color2: '#000000',
  hasStroke: true,
  strokeColor: '#000000',
  text: 'Now Loading',
  textColor: '#000000',
  fontsize: 20,
  bold: true,
};

const clampHexChannel = (value) => {
  const parsed = parseInt(value, 16);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(255, parsed));
};

class TextRenderer {
  constructor(settings) {
    this.settings = settings;
  }

  update(settings) {
    this.settings = settings;
    return this;
  }

  draw(ctx) {
    const { text, canvasSize, textColor, fontsize, bold } = this.settings;
    const r = clampHexChannel(textColor.slice(1, 3));
    const g = clampHexChannel(textColor.slice(3, 5));
    const b = clampHexChannel(textColor.slice(5, 7));

    ctx.font = `${bold ? 'bold ' : ''}${fontsize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(${r},${g},${b},1)`;
    ctx.fillText(text, canvasSize / 2, canvasSize / 2);
  }
}

class Satellite {
  constructor(settings, index) {
    this.index = index;
    this.radian = this.index * (TWO_PI / settings.circleNumber);
    this.updateSettings(settings);
  }

  updateSettings(settings) {
    this.settings = settings;
    this.radius = settings.radius;
    this.orbitRadiusRate = settings.orbitRadiusRate;
    this.length = settings.length;
  }

  colorChannel(channel) {
    const map = {
      red: { from: 1, to: 3 },
      green: { from: 3, to: 5 },
      blue: { from: 5, to: 7 },
    };
    const { from, to } = map[channel];
    const base = clampHexChannel(this.settings.color1.slice(from, to));
    const target = clampHexChannel(this.settings.color2.slice(from, to));
    const midpoint = this.settings.circleNumber / 2;
    const factor = Math.abs(this.index - midpoint) / midpoint;
    return Math.round((target - base) * factor + base);
  }

  get radiusPx() {
    return (this.settings.canvasSize * this.radius) / 100;
  }

  get orbitRadiusPx() {
    return (this.settings.canvasSize / 2) * (this.orbitRadiusRate / 100);
  }

  get innerRatio() {
    return (100 - this.length) * 0.01;
  }

  move() {
    this.radian += (this.settings.speed * 0.1) / 255;
    if (this.radian > TWO_PI) {
      this.radian -= TWO_PI;
    }
    if (this.radian < -TWO_PI) {
      this.radian += TWO_PI;
    }
    const center = this.settings.canvasSize / 2;
    const radius = this.orbitRadiusPx;
    const ratio = this.innerRatio;
    this.x = Math.cos(this.radian) * radius + center;
    this.y = Math.sin(this.radian) * radius + center;
    this.innerX = Math.cos(this.radian) * radius * ratio + center;
    this.innerY = Math.sin(this.radian) * radius * ratio + center;
    return this;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radiusPx, this.radian + Math.PI * 0.5, this.radian - Math.PI * 0.5, true);
    ctx.arc(this.innerX, this.innerY, this.radiusPx, this.radian - Math.PI * 0.5, this.radian + Math.PI * 0.5, true);
    ctx.closePath();
    const r = this.colorChannel('red');
    const g = this.colorChannel('green');
    const b = this.colorChannel('blue');
    ctx.fillStyle = `rgba(${r},${g},${b},1)`;
    ctx.fill();
    if (this.settings.hasStroke) {
      ctx.strokeStyle = this.settings.strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}

export class CanvasLoadingController {
  constructor(options = {}) {
    this.defaults = { ...defaultSettings, ...options };
    this.settings = { ...this.defaults };
    this.circles = [];
    this.textRenderer = new TextRenderer(this.settings);
    this.frameId = null;
  }

  init(options = {}) {
    const merged = { ...this.settings, ...options };
    this.configureContext(merged);
    this.settings = merged;
    this.newCanvas();
    this.start();
    return this;
  }

  configureContext(settings) {
    if (!settings.canvas) {
      settings.canvas = document.getElementById(settings.el);
    }
    if (!settings.canvas) {
      throw new Error(`canvasLoading: canvas element "${settings.el}" not found`);
    }
    settings.ctx = settings.canvas.getContext('2d');
    if (!settings.ctx) {
      throw new Error('canvasLoading: 2d context unavailable');
    }
    settings.canvas.width = settings.canvasSize;
    settings.canvas.height = settings.canvasSize;
  }

  newCanvas(options) {
    if (options) {
      const merged = { ...this.settings, ...options };
      this.configureContext(merged);
      this.settings = merged;
    }
    if (!this.circles.length || this.circles.length !== this.settings.circleNumber) {
      this.circles = Array.from({ length: this.settings.circleNumber }, (_, index) => new Satellite(this.settings, index));
    } else {
      this.circles.forEach((circle) => circle.updateSettings(this.settings));
    }
    this.textRenderer.update(this.settings);
    return this;
  }

  start() {
    this.stop();
    const loop = () => {
      const { ctx, canvasSize } = this.settings;
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      this.circles.forEach((circle) => circle.move().draw(ctx));
      this.textRenderer.draw(ctx);
      this.frameId = window.requestAnimationFrame(loop);
    };
    this.frameId = window.requestAnimationFrame(loop);
    return this;
  }

  stop() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    return this;
  }

  getCircles() {
    return this.circles;
  }
}

export const canvasLoading = new CanvasLoadingController();

export function createCanvasLoading(options = {}) {
  return new CanvasLoadingController(options);
}

export default canvasLoading;
