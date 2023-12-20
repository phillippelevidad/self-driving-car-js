class Car {
  /**
   * Creates a new instance of the Car class.
   * @param {number} x - The x-coordinate of the car's position.
   * @param {number} y - The y-coordinate of the car's position.
   * @param {number} width - The width of the car.
   * @param {number} height - The height of the car.
   * @param {string} controlType - The type of control for the car. Can be "DUMMY" or "AI".
   * @param {number} maxSpeed - The maximum speed of the car. Defaults to 3.
   */
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.maxSpeed = maxSpeed;
    this.acceleration = 0.2;
    this.friction = 0.05;
    this.damaged = false;

    this.angle = 0;
    this.turningSpeed = 0.03;

    this.polygon = null;
    this.controls = new Controls(controlType);

    this.useBrain = controlType === "AI";

    if (controlType != "DUMMY") {
      this.sensors = new Sensors(this);
      this.brain = new NeuralNetwork([this.sensors.rayCount, 6, 4]);
    }
  }

  /**
   * Draws the car on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   * @param {string} color - The color of the car. Defaults to black.
   * @param {boolean} drawSensors - Whether to draw the sensors of the car. Defaults to false.
   */
  draw(ctx, color, drawSensors = false) {
    ctx.fillStyle = this.damaged ? "red" : color ?? "black";

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    this.sensors && drawSensors && this.sensors.draw(ctx);
  }

  /**
   * Updates the car's state and behavior.
   * @param {Array} roadBorders - The array of road borders.
   * @param {Array} traffic - The array of traffic cars.
   */
  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }

    if (this.sensors) {
      this.sensors.update(roadBorders, traffic);

      // Feed sensor readings to the neural network
      const offsets = this.sensors.readings.map((reading) =>
        reading ? 1 - reading.offset : 0
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      // Set controls based on neural network output
      if (this.useBrain) {
        this.controls.forward = Boolean(outputs[0]);
        this.controls.left = Boolean(outputs[1]);
        this.controls.right = Boolean(outputs[2]);
        this.controls.reverse = Boolean(outputs[3]);
      }
    }
  }

  /**
   * Assess the damage of the car by checking for intersection with road borders and traffic cars.
   * @param {Array} roadBorders - The array of road borders.
   * @param {Array} traffic - The array of traffic cars.
   * @returns {boolean} - True if the car is damaged, false otherwise.
   */
  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) return true;
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) return true;
    }
    return false;
  }

  /**
   * Creates a polygon representing the car's shape.
   * @returns {Array} - An array of points representing the vertices of the polygon.
   */
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    // Calculate the coordinates of the vertices based on the car's position, angle, width, and height
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  /**
   * Moves the car based on the control inputs and updates its position and angle.
   */
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed < -(this.maxSpeed / 2)) {
      this.speed = -(this.maxSpeed / 2);
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.controls.left) {
      this.angle += this.turningSpeed;
    }
    if (this.controls.right) {
      this.angle -= this.turningSpeed;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}
