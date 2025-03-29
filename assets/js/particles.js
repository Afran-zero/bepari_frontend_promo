// assets/js/particles.js
particlesJS('particles-js', {
    "particles": {
      "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
      "color": { "value": "#a2ff80" },
      "shape": { "type": "circle" },
      "opacity": {
        "value": 0.5,
        "random": true,
        "anim": { "enable": true, "speed": 1, "opacity_min": 0.1 }
      },
      "size": { "value": 3, "random": true },
      "line_linked": { "enable": true, "distance": 150, "color": "#a2ff80", "opacity": 0.2, "width": 1 },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": { "enable": true, "mode": "grab" },
        "onclick": { "enable": true, "mode": "push" },
        "resize": true
      }
    }
  });