class Road {
  /**
   * Road constructor.
   * @param {number} x - The x-coordinate of the road.
   * @param {number} width - The width of the road.
   * @param {number} laneCount - The number of lanes in the road. Default is 3.
   */
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1_000_000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  /**
   * Get the center x-coordinate of a specific lane.
   * @param {number} laneIndex - The index of the lane.
   * @returns {number} - The x-coordinate of the center of the lane.
   */
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    const left = this.left + laneIndex * laneWidth;
    const right = left + laneWidth;
    return (left + right) / 2;
  }

  /**
   * Draw the road on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  draw(ctx) {
    // Set the line width and color for the road markings
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    // Draw the lane markings
    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    // Reset the line dash to solid
    ctx.setLineDash([]);

    // Draw the road borders
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}
