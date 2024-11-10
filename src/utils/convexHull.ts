export interface Point {
  x: number;
  y: number;
  id: number;
}

/**
 * Computes the convex hull of a set of 2D points using the Graham Scan algorithm.
 * This implementation uses cross products to determine the orientation of points.
 * @param points - An array of Point objects.
 * @returns An array of Point objects representing the convex hull in counterclockwise order.
 */
export function computeConvexHull(points: Point[]): Point[] {
  // Remove duplicates while preserving IDs
  const uniquePoints = Array.from(
    new Map(points.map(p => [`${p.x},${p.y}`, p]))
    .values()
  );

  if (uniquePoints.length <= 1) return uniquePoints;

  // Step 1: Find the point with the lowest y-coordinate (and lowest x-coordinate in case of tie)
  const start = uniquePoints.reduce((minPoint, point) =>
    point.y < minPoint.y || (point.y === minPoint.y && point.x < minPoint.x)
      ? point
      : minPoint
  );

  // Step 2: Sort points by polar angle with 'start' point
  uniquePoints.sort((a, b) => {
    const angleA = Math.atan2(a.y - start.y, a.x - start.x);
    const angleB = Math.atan2(b.y - start.y, b.x - start.x);
    if (angleA === angleB) {
      return distance(start, a) - distance(start, b);
    }
    return angleA - angleB;
  });

  // Step 3: Use a stack to build the convex hull
  const hull: Point[] = [];
  for (const point of uniquePoints) {
    while (
      hull.length >= 2 &&
      cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0
    ) {
      hull.pop();
    }
    hull.push(point);
  }

  return hull;
}

/**
 * Cross product of vectors OA and OB.
 * A positive value indicates a counterclockwise turn, zero indicates collinear points,
 * and a negative value indicates a clockwise turn.
 */
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * Calculates the squared distance between two points to avoid unnecessary square root computations.
 */
function distance(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

// rotatingCalipers.ts

export function findFurthestPoints(hull: Point[]): [Point, Point] {
  const n = hull.length;
  if (n === 0) {
    throw new Error("Hull must contain at least one point");
  }
  if (n === 1) {
    return [hull[0], hull[0]];
  }

  let maxDistanceSquared = 0;
  let maxPair: [Point, Point] = [hull[0], hull[0]];

  let j = 1;
  for (let i = 0; i < n; i++) {
    const nextI = (i + 1) % n;

    while (true) {
      const nextJ = (j + 1) % n;

      const cross = crossProduct(
        subtractPoints(hull[nextI], hull[i]),
        subtractPoints(hull[nextJ], hull[j])
      );

      if (cross > 0) {
        j = nextJ;
      } else {
        break;
      }
    }

    const distanceSquared = distanceSq(hull[i], hull[j]);
    if (distanceSquared > maxDistanceSquared) {
      maxDistanceSquared = distanceSquared;
      maxPair = [hull[i], hull[j]];
    }
  }

  return maxPair;
}

function subtractPoints(p1: Point, p2: Point): Point {
  return { 
    x: p1.x - p2.x, 
    y: p1.y - p2.y,
    id: p1.id
  };
}

function crossProduct(p1: Point, p2: Point): number {
  return p1.x * p2.y - p1.y * p2.x;
}

export function distanceSq(p1: Point, p2: Point): number {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
}
