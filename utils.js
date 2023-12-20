/**
 * Linearly interpolates between two values.
 * @param {number} start - The starting value.
 * @param {number} end - The ending value.
 * @param {number} t - The interpolation parameter between 0 and 1.
 * @returns {number} - The interpolated value.
 */
function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Calculates the intersection point between two line segments.
 * @param {Object} A - The first point of the first line segment.
 * @param {Object} B - The second point of the first line segment.
 * @param {Object} C - The first point of the second line segment.
 * @param {Object} D - The second point of the second line segment.
 * @returns {Object|null} - The intersection point if it exists, otherwise null.
 */
function getIntersection(A, B, C, D) {
  // Numerator of the t parameter
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  // Numerator of the u parameter
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  // Denominator
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  // If the denominator is zero, the lines are parallel or coincident
  if (bottom === 0) return null;

  const t = tTop / bottom;
  const u = uTop / bottom;

  // If t and u are within the range [0, 1], the line segments intersect
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    // Calculate the intersection point using linear interpolation
    return {
      x: lerp(A.x, B.x, t),
      y: lerp(A.y, B.y, t),
      offset: t,
    };
  }
}

/**
 * Converts a value to an RGBA color string.
 * @param {number} value - The value to convert.
 * @returns {string} - The RGBA color string.
 */
function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

/**
 * Checks if two polygons intersect.
 * @param {Array} poly1 - The first polygon represented as an array of points.
 * @param {Array} poly2 - The second polygon represented as an array of points.
 * @returns {boolean} - True if the polygons intersect, false otherwise.
 */
function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const A = poly1[i];
      const B = poly1[(i + 1) % poly1.length];
      const C = poly2[j];
      const D = poly2[(j + 1) % poly2.length];

      // Check if the line segments intersect
      const touch = getIntersection(A, B, C, D);
      if (touch) return true;
    }
  }
}
