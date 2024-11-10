import { findHamiltonianPath } from "../paths";
import { expect, test, describe } from "bun:test";

describe("findHamiltonianPath", () => {
  test("Simple small graph with 4 nodes", () => {
    const distanceMatrix = [
      [0, 10, 15, 20],
      [10, 0, 35, 25],
      [15, 35, 0, 30],
      [20, 25, 30, 0],
    ];
    const start = 0; // Start at A (index 0)
    const end = 3; // End at D (index 3)

    const [minDistance, path] = findHamiltonianPath(
      4,
      distanceMatrix,
      start,
      end
    );
    expect(minDistance).toBe(75);
    expect(path).toEqual([0, 2, 1, 3]); // A -> C -> B -> D
  });

  test("Triangle graph with 3 nodes", () => {
    const distanceMatrix = [
      [0, 10, 15],
      [10, 0, 20],
      [15, 20, 0],
    ];
    const start = 0; // Start at A
    const end = 2; // End at C

    const [minDistance, path] = findHamiltonianPath(
      3,
      distanceMatrix,
      start,
      end
    );
    expect(minDistance).toBe(30);
    expect(path).toEqual([0, 1, 2]); // A -> B -> C
  });

  test("Complete graph with 4 nodes (Corrected)", () => {
    const distanceMatrix = [
      [0, 2, 9, 10],
      [1, 0, 6, 4],
      [15, 7, 0, 8],
      [6, 3, 12, 0],
    ];
    const start = 0; // Start at A
    const end = 3; // End at D

    const [minDistance, path] = findHamiltonianPath(
      4,
      distanceMatrix,
      start,
      end
    );
    expect(minDistance).toBe(16);
    expect(path).toEqual([0, 1, 2, 3]); // A -> B -> C -> D
  });

  test("Direct path with only two nodes", () => {
    const distanceMatrix = [
      [0, 5],
      [5, 0],
    ];
    const start = 0; // Start at A
    const end = 1; // End at B

    const [minDistance, path] = findHamiltonianPath(
      2,
      distanceMatrix,
      start,
      end
    );
    expect(minDistance).toBe(5);
    expect(path).toEqual([0, 1]); // A -> B
  });

  test("Graph with unreachable nodes (Corrected)", () => {
    const distanceMatrix = [
      [0, Infinity, 15],
      [Infinity, 0, 20],
      [15, 20, 0],
    ];
    const start = 0;
    const end = 1;

    const [minDistance, path] = findHamiltonianPath(
      3,
      distanceMatrix,
      start,
      end
    );
    expect(minDistance).toBe(35);
    expect(path).toEqual([0, 2, 1]); // 0 -> 2 -> 1
  });
});
