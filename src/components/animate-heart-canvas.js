class AnimateHeartCanvas {
    constructor(hMin, hMax, countHeart = 150, sizeMin = 50, sizeMax = 350, bgColor) {
      this.isPlaying = true; // Default auto-play
  
      this.mouseX = 0;
      this.mouseY = 0;
  
      this.configFrame = {
        width: 1200,
        height: 300,
        bgColor: bgColor,
      };
  
      this.configHeart = {
        timeLine: 0, // Timeline
        timeInit: new Date().getTime(),
        movement: 1, // Movement speed
        x: 50, // Position x
        y: 50, // Position y
        width: 200, // Heart size
        height: 200, // Heart size
        countHeart: countHeart || 150, // Number of hearts
        sizeMin: isNaN(sizeMin) ? 50 : sizeMin, // Min size
        sizeMax: isNaN(sizeMax) ? 350 : sizeMax, // Max size
        colorSaturate: 100, // Color saturation (0-100)
        colorLight: 60, // Color lightness (0-100)
        hMin: isNaN(hMin) ? 330 : hMin, // Min hue
        hMax: isNaN(hMax) ? 350 : hMax, // Max hue
        minOpacity: 20, // Min opacity (%)
        maxOpacity: 100, // Max opacity (%)
        opacityGrowth: 5, // Opacity growth
        heartRangeMin: 0, // Heart appearance range (0.0-1.0)
        heartRangeMax: 0.3,
        gravityMin: 1, // Min gravity
        gravityMax: 9.8, // Max gravity
        flowDirection: 1, // Movement direction (1: up, -1: down)
      };
  
      this.heartBuffer = []; // Heart buffer
  
      this.init();
  
      window.onresize = () => {
        this.configFrame.height = window.innerHeight * 2; // Use window.innerHeight
        this.configFrame.width = window.innerWidth * 2; // Use window.innerWidth
        let heartLayer = document.getElementById("heartLayer");
        this.updateFrameAttribute(heartLayer);
      };
    }
  
    play() {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.draw();
      }
    }
  
    stop() {
      this.isPlaying = false;
    }
  
    moveDown() {
      this.configHeart.flowDirection = -1;
    }
  
    moveUp() {
      this.configHeart.flowDirection = 1;
    }
  
    speedUp() {}
  
    speedDown() {}
  
    destroy() {
      this.isPlaying = false;
      let heartLayer = document.getElementById("heartLayer");
      heartLayer.remove();
      console.log("Animation stopped");
    }
  
    updateFrameAttribute(heartLayer) {
      heartLayer.setAttribute("id", "heartLayer");
      heartLayer.setAttribute("width", this.configFrame.width);
      heartLayer.setAttribute("height", this.configFrame.height);
      heartLayer.style.width = `${this.configFrame.width / 2}px`;
      heartLayer.style.height = `${this.configFrame.height / 2}px`;
      heartLayer.style.zIndex = "-3";
      heartLayer.style.userSelect = "none";
      heartLayer.style.position = "fixed";
      heartLayer.style.top = "0";
      heartLayer.style.left = "0";
    }
  
    init() {
      this.configFrame.height = window.innerHeight * 2; // Use window.innerHeight
      this.configFrame.width = window.innerWidth * 2; // Use window.innerWidth
  
      let heartLayer = document.createElement("canvas");
      this.updateFrameAttribute(heartLayer);
      document.documentElement.append(heartLayer);
  
      this.configHeart.timeLine = 0;
  
      // Fill heart buffer
      for (let i = 0; i < this.configHeart.countHeart; i++) {
        let randomSize = randomInt(this.configHeart.sizeMin, this.configHeart.sizeMax);
        let x = randomInt(0, this.configFrame.width);
        let y = randomInt(
          this.configFrame.height * (1 - this.configHeart.heartRangeMax),
          this.configFrame.height * (1 - this.configHeart.heartRangeMin)
        );
        this.heartBuffer.push({
          id: i,
          gravity: randomFloat(this.configHeart.gravityMin, this.configHeart.gravityMax),
          opacity: 0,
          opacityFinal: randomInt(this.configHeart.minOpacity, this.configHeart.maxOpacity),
          timeInit: randomInt(1, 500),
          x,
          y,
          originalX: x,
          originalY: y,
          width: randomSize,
          height: randomSize,
          colorH: randomInt(this.configHeart.hMin, this.configHeart.hMax),
        });
      }
  
      this.draw();
  
      document.documentElement.addEventListener("mousemove", (event) => {
        this.mouseX = event.x;
        this.mouseY = event.y;
      });
    }
  
    draw() {
      this.configHeart.timeLine = this.configHeart.timeLine + 1;
  
      let canvasHeart = document.getElementById("heartLayer");
      let contextHeart = canvasHeart.getContext("2d");
      contextHeart.clearRect(0, 0, this.configFrame.width, this.configFrame.height);
  
      if (this.configFrame.bgColor) {
        contextHeart.fillStyle = this.configFrame.bgColor;
        contextHeart.fillRect(0, 0, this.configFrame.width, this.configFrame.height);
      }
  
      this.heartBuffer.forEach((heart) => {
        if (heart.y < -heart.height) {
          heart.y = heart.originalY;
          heart.timeInit = this.configHeart.timeLine;
          heart.opacity = 0;
        }
  
        let timeGap = this.configHeart.timeLine - heart.timeInit;
        if (timeGap > 0) {
          heart.opacity = heart.opacity * ((this.configHeart.timeLine - heart.timeInit) / 100);
        } else {
          heart.opacity = 0;
        }
  
        if (heart.opacity >= heart.opacityFinal) {
          heart.opacity = heart.opacityFinal;
        }
  
        let movement = (1 / 2) * heart.gravity * ((this.configHeart.timeLine - heart.timeInit) / 300) * this.configHeart.flowDirection;
        heart.y = heart.y - movement;
  
        this.drawHeart(
          heart.x,
          heart.y,
          heart.width / 2,
          heart.height / 2,
          `hsl(${heart.colorH} ${this.configHeart.colorSaturate}% ${this.configHeart.colorLight}% / ${heart.opacity}%)`
        );
        heart.opacity = heart.opacity + this.configHeart.opacityGrowth;
      });
  
      if (this.isPlaying) {
        window.requestAnimationFrame(() => {
          this.draw();
        });
      }
    }
  
    drawHeart(x, y, width, height, colorFill) {
      let canvasHeart = document.getElementById("heartLayer");
      let contextHeart = canvasHeart.getContext("2d");
  
      contextHeart.save();
      contextHeart.beginPath();
      let topCurveHeight = height * 0.3;
      contextHeart.moveTo(x, y + topCurveHeight);
      contextHeart.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight);
      contextHeart.bezierCurveTo(x - width / 2, y + (height + topCurveHeight) / 2, x, y + (height + topCurveHeight) / 1.4, x, y + height);
      contextHeart.bezierCurveTo(x, y + (height + topCurveHeight) / 1.8, x + width / 2, y + (height + topCurveHeight) / 2, x + width / 2, y + topCurveHeight);
      contextHeart.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);
      contextHeart.closePath();
      contextHeart.fillStyle = colorFill;
      contextHeart.fill();
      contextHeart.restore();
    }
  }
  
  // Helper functions
  function randomDirection() {
    return Math.random() > 0.5 ? 1 : -1;
  }
  
  function randomInt(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(0));
  }
  
  function randomFloat(min, max) {
    return Number(Math.random() * (max - min) + min);
  }
  
  export { AnimateHeartCanvas };
  