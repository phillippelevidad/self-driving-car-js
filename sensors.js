class Sensors {
  /**
   * Constructs a new Sensors object.
   * @param {Car} car - The car object associated with the sensors.
   */
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;
    this.rays = []; // Ray start and end points.
    this.readings = [];
  }

  /**
   * Draws the sensor rays on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  draw(ctx) {
    for (let i = 0; i < this.rays.length; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }

      // Draw the ray line
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Draw the connection line between the ray end and the car
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  /**
   * Updates the sensor readings based on the current road borders and traffic.
   * @param {Array} roadBorders - The array of road borders.
   * @param {Array} traffic - The array of traffic objects.
   */
  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  /**
   * Casts the sensor rays from the car's position in different directions.
   */
  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      // Calculate the angle of the ray based on the spread and the current index
      const angle =
        lerp(this.raySpread / 2, -this.raySpread / 2, i / (this.rayCount - 1)) +
        this.car.angle;

      const start = {
        x: this.car.x,
        y: this.car.y,
      };
      const end = {
        x: this.car.x - Math.sin(angle) * this.rayLength,
        y: this.car.y - Math.cos(angle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  /**
   * Calculates the sensor reading based on the intersection of the ray with road borders and traffic objects.
   * @param {Array} ray - The ray represented by start and end points.
   * @param {Array} roadBorders - The array of road borders.
   * @param {Array} traffic - The array of traffic objects.
   * @returns {Object|null} - The intersection point with the minimum offset, or null if no intersection is found.
   */
  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    // Check for intersection with road borders
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) touches.push(touch);
    }

    // Check for intersection with traffic objects
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let i = 0; i < poly.length; i++) {
        const touch = getIntersection(
          ray[0],
          ray[1],
          poly[i],
          poly[(i + 1) % poly.length]
        );
        if (touch) touches.push(touch);
      }
    }

    // Return the intersection point with the minimum offset
    if (touches.length === 0) return null;
    const offsets = touches.map((t) => t.offset);
    const minOffset = Math.min(...offsets);
    return touches.find((t) => t.offset === minOffset);
  }
}
