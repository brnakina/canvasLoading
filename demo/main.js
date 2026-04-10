import canvasLoading, { defaultSettings } from '../src/canvasLoading.js';

const canvas = document.getElementById('canvas_loading');
const form = document.getElementById('controls');
const state = { ...defaultSettings, el: 'canvas_loading', canvas };

function parseValue(input) {
  if (input.type === 'checkbox') {
    return input.checked;
  }
  if (input.type === 'range' || input.type === 'number') {
    const value = Number(input.value);
    return Number.isNaN(value) ? 0 : value;
  }
  return input.value;
}

function updateOutputs(name) {
  const output = form.querySelector(`[data-output="${name}"]`);
  if (output) {
    output.textContent = state[name];
  }
}

function attachListeners() {
  const elements = Array.from(form.elements);
  elements.forEach((input) => {
    if (!(input instanceof HTMLInputElement)) return;
    const { name } = input;
    if (!name) return;
    if (input.type === 'checkbox') {
      input.checked = Boolean(state[name]);
    } else {
      input.value = state[name];
    }
    updateOutputs(name);
    input.addEventListener('input', (event) => {
      const target = event.target;
      state[name] = parseValue(target);
      updateOutputs(name);
      canvasLoading.init(state);
    });
  });
}

attachListeners();
canvasLoading.init(state);
