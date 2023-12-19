function lerp(start, end, t) {
  return start + (end - start) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom === 0) return null;

  const t = tTop / bottom;
  const u = uTop / bottom;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: lerp(A.x, B.x, t),
      y: lerp(A.y, B.y, t),
      offset: t,
    };
  }
}

function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const A = poly1[i];
      const B = poly1[(i + 1) % poly1.length];
      const C = poly2[j];
      const D = poly2[(j + 1) % poly2.length];

      const touch = getIntersection(A, B, C, D);
      if (touch) return true;
    }
  }
}
