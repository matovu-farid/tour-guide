import { expect, test, describe } from "bun:test";
import { computeConvexHull, findFurthestPoints } from "../convexHull";

interface Point {
  x: number;
  y: number;
}

// Helper function to check if two points are equal
function arePointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

// Helper function to check if two arrays of points are equivalent, ignoring order
function arePointArraysEqual(arr1: Point[], arr2: Point[]): boolean {
  if (arr1.length !== arr2.length) return false;

  const set1 = new Set(arr1.map((p) => JSON.stringify(p)));
  const set2 = new Set(arr2.map((p) => JSON.stringify(p)));

  for (const point of set1) {
    if (!set2.has(point)) return false;
  }
  return true;
}

describe("computeConvexHull", () => {
  test("Simple triangle", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ];

    const expectedHull: Point[] = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ];

    const hull = computeConvexHull(points);
    expect(arePointArraysEqual(hull, expectedHull)).toBe(true);
  });

  test("Square shape", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 0, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 0 },
    ];

    const expectedHull: Point[] = [
      { x: 0, y: 0 },
      { x: 0, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 0 },
    ];

    const hull = computeConvexHull(points);
    expect(arePointArraysEqual(hull, expectedHull)).toBe(true);
  });

  test("Colinear points", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];

    const expectedHull: Point[] = [
      { x: 0, y: 0 },
      { x: 3, y: 3 },
    ];

    const hull = computeConvexHull(points);
    expect(arePointArraysEqual(hull, expectedHull)).toBe(true);
  });

  test("Concave shape", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 0, y: 3 },
    ];

    const expectedHull: Point[] = [
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 3 },
      { x: 0, y: 3 },
    ];

    const hull = computeConvexHull(points);
    expect(arePointArraysEqual(hull, expectedHull)).toBe(true);
  });

  test("Star shape", () => {
    const points: Point[] = [
      { x: 0, y: 3 },
      { x: 1, y: 1 },
      { x: 3, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: -3 },
      { x: -1, y: -1 },
      { x: -3, y: 0 },
      { x: -1, y: 1 },
    ];

    const expectedHull: Point[] = [
      { x: -3, y: 0 },
      { x: 0, y: -3 },
      { x: 3, y: 0 },
      { x: 0, y: 3 },
    ];

    const hull = computeConvexHull(points);
    expect(arePointArraysEqual(hull, expectedHull)).toBe(true);
  });

  test("Circle points", () => {
    const points: Point[] = [];
    const numPoints = 100;
    const radius = 10;
    for (let i = 0; i < numPoints; i++) {
      const angle = (2 * Math.PI * i) / numPoints;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }

    const hull = computeConvexHull(points);
    expect(hull.length).toBeGreaterThanOrEqual(numPoints * 0.9);

    const epsilon = 1e-5;
    for (const hullPoint of hull) {
      const distance = Math.hypot(hullPoint.x, hullPoint.y);
      expect(Math.abs(distance - radius)).toBeLessThan(epsilon);
    }
  });
});
describe("findFurthestPoints", () => {
  test("Simple triangle", () => {
    const hull: Point[] = computeConvexHull(  [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ]);

    const [pointA, pointB] = findFurthestPoints(hull);

    // The furthest points should be (0,0) and (2,0)
    expect(
      (pointA.x === 0 && pointA.y === 0 && pointB.x === 2 && pointB.y === 0) ||
        (pointA.x === 2 && pointA.y === 0 && pointB.x === 0 && pointB.y === 0)
    ).toBe(true);
  });

  test("Square shape", () => {
    const hull: Point[] = computeConvexHull(  [
      { x: 0, y: 0 },
      { x: 0, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 0 },
    ]);

    const [pointA, pointB] = findFurthestPoints(hull);

    // The furthest points should be opposite corners
    const expectedPairs = [
      [
        { x: 0, y: 0 },
        { x: 2, y: 2 },
      ],
      [
        { x: 0, y: 2 },
        { x: 2, y: 0 },
      ],
    ];

    const isCorrect = expectedPairs.some(
      ([p1, p2]) =>
        (pointA.x === p1.x &&
          pointA.y === p1.y &&
          pointB.x === p2.x &&
          pointB.y === p2.y) ||
        (pointA.x === p2.x &&
          pointA.y === p2.y &&
          pointB.x === p1.x &&
          pointB.y === p1.y)
    );

    expect(isCorrect).toBe(true);
  });

  test("Colinear points", () => {
    const hull: Point[] = computeConvexHull([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ]);

    const [pointA, pointB] = findFurthestPoints(hull);

    // The furthest points should be the endpoints
    expect(
      (pointA.x === 0 && pointA.y === 0 && pointB.x === 3 && pointB.y === 3) ||
        (pointA.x === 3 && pointA.y === 3 && pointB.x === 0 && pointB.y === 0)
    ).toBe(true);
  });

  test("Convex quadrilateral", () => {
    const hull: Point[] = computeConvexHull([
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 3 },
      { x: 0, y: 3 },
    ]);

    const [pointA, pointB] = findFurthestPoints(hull);

    // The furthest points should be (0,0) and (2,3)
    const expectedPairs = [
      [
        { x: 0, y: 0 },
        { x: 2, y: 3 },
      ],
    ];

    const isCorrect = expectedPairs.some(
      ([p1, p2]) =>
        (pointA.x === p1.x &&
          pointA.y === p1.y &&
          pointB.x === p2.x &&
          pointB.y === p2.y) ||
        (pointA.x === p2.x &&
          pointA.y === p2.y &&
          pointB.x === p1.x &&
          pointB.y === p1.y)
    );

    expect(isCorrect).toBe(true);
  });

  test("Circle of points", () => {
    const points: Point[] = [];
    const numPoints = 100;
    const radius = 10;
    for (let i = 0; i < numPoints; i++) {
      const angle = (2 * Math.PI * i) / numPoints;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }

    const hull = points; // Since all points are on the circle, they form the hull
    const [pointA, pointB] = findFurthestPoints(hull);

    // The furthest distance in a circle is between two opposite points
    const expectedDistanceSquared = (2 * radius) ** 2;

    const actualDistanceSquared = distanceSquared(pointA, pointB);
    const epsilon = 1e-6;

    expect(
      Math.abs(actualDistanceSquared - expectedDistanceSquared) < epsilon
    ).toBe(true);
  });

  test("Random convex polygon", () => {
    // A convex hexagon
    const hull: Point[] = computeConvexHull(  [
      { x: 0, y: 0 },
      { x: 2, y: -1 },
      { x: 4, y: 0 },
      { x: 5, y: 2 },
      { x: 3, y: 4 },
      { x: 1, y: 3 },
    ]);

    const [pointA, pointB] = findFurthestPoints(hull);

    // The furthest points should be approximately (0,0) and (5,2)
    expect(
      (pointA.x === 0 && pointA.y === 0 && pointB.x === 5 && pointB.y === 2) ||
        (pointA.x === 5 && pointA.y === 2 && pointB.x === 0 && pointB.y === 0)
    ).toBe(true);
  });

  // Additional edge case tests
  test("Single point", () => {
    const hull: Point[] = computeConvexHull([{ x: 0, y: 0 }]) ;

    const [pointA, pointB] = findFurthestPoints(hull);

    // Both points should be the same since there's only one point
    expect(pointA).toEqual({ x: 0, y: 0 });
    expect(pointB).toEqual({ x: 0, y: 0 });
  });

  test("Two points", () => {
    const hull: Point[] = computeConvexHull(  [
      { x: -1, y: -1 },
      { x: 1, y: 1 },
    ]);

    const [pointA, pointB] = findFurthestPoints(hull);

    // The furthest points should be the two given points
    expect(
      (pointA.x === -1 &&
        pointA.y === -1 &&
        pointB.x === 1 &&
        pointB.y === 1) ||
        (pointA.x === 1 && pointA.y === 1 && pointB.x === -1 && pointB.y === -1)
    ).toBe(true);
  });

  test("Multiple maxima", () => {
    const hull: Point[] = computeConvexHull(  [
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
    ]);

    const [pointA, pointB] = findFurthestPoints(hull);

    // Multiple pairs have the same maximum distance
    const expectedPairs = [
      [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
      ],
    ];

    const isCorrect = expectedPairs.some(
      ([p1, p2]) =>
        (pointA.x === p1.x &&
          pointA.y === p1.y &&
          pointB.x === p2.x &&
          pointB.y === p2.y) ||
        (pointA.x === p2.x &&
          pointA.y === p2.y &&
          pointB.x === p1.x &&
          pointB.y === p1.y)
    );

    expect(isCorrect).toBe(true);
  });
});

function distanceSquared(p1: Point, p2: Point): number {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
}
