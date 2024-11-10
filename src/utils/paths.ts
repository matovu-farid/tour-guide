import { MarkerType } from "./markers";
import MapView, { Polyline, Marker, LatLng } from "react-native-maps";
import { getDistance, orderByDistance } from "geolib";

export function getDistanceMatrix(markers: MarkerType[]): DistanceMatrix {
  return markers.map((marker) =>
    markers.map((otherMarker) =>
      getDistance(
        { latitude: marker.latitude, longitude: marker.longitude },
        { latitude: otherMarker.latitude, longitude: otherMarker.longitude }
      )
    )
  );
}

/**
 * Finds the shortest Hamiltonian path with fixed start and end points.
 * @param n - Number of markers.
 * @param dist - Distance matrix where dist[i][j] is the distance from marker i to marker j.
 * @param start - Index of the starting marker.
 * @param end - Index of the ending marker.
 * @returns The minimum distance of the Hamiltonian path.
 */
type DistanceMatrix = number[][];

/**
 * Function to find the shortest Hamiltonian path with a fixed start and end node.
 * @param n - Number of nodes.
 * @param dist - Distance matrix where dist[i][j] represents the distance from node i to node j.
 * @param start - Index of the starting node.
 * @param end - Index of the ending node.
 * @returns A tuple containing the minimum distance and the path taken.
 */
export function findHamiltonianPath(
  n: number,
  dist: DistanceMatrix,
  start: number,
  end: number
): [number, number[]] {
  // Step 1: Initialize the DP and parent tables
  const dp: number[][] = Array.from({ length: 1 << n }, () =>
    Array(n).fill(Infinity)
  );
  const parent: number[][] = Array.from({ length: 1 << n }, () =>
    Array(n).fill(-1)
  );

  // Step 2: Set the starting point
  dp[1 << start][start] = 0;

  // Step 3: Fill the DP table
  for (let mask = 1; mask < 1 << n; mask++) {
    for (let i = 0; i < n; i++) {
      // Skip if 'i' is not included in 'mask' or if 'i' is the end node
      if (!(mask & (1 << i)) || i === end) continue;

      // Explore all previous nodes 'j'
      for (let j = 0; j < n; j++) {
        if (i !== j && mask & (1 << j)) {
          const newCost = dp[mask ^ (1 << i)][j] + dist[j][i];
          if (newCost < dp[mask][i]) {
            dp[mask][i] = newCost;
            parent[mask][i] = j; // Store the previous node that led to 'i'
          }
        }
      }
    }
  }

  // Step 4: Find the minimum path that ends at the fixed 'end' node
  let minPath = Infinity;
  let bestLastNode = -1;
  for (let i = 0; i < n; i++) {
    if (i !== end) {
      const cost = dp[((1 << n) - 1) ^ (1 << end)][i] + dist[i][end];
      if (cost < minPath) {
        minPath = cost;
        bestLastNode = i;
      }
    }
  }

  // If no valid path was found, return Infinity and an empty path
  if (minPath === Infinity) return [Infinity, []];

  // Step 5: Reconstruct the path starting from the best last node
  const path = reconstructPath(parent, n, start, end, bestLastNode);

  return [minPath, path];
}

/**
 * Function to reconstruct the Hamiltonian path from the parent table.
 * @param parent - Parent table used for backtracking the path.
 * @param n - Number of nodes.
 * @param start - Index of the starting node.
 * @param end - Index of the ending node.
 * @param lastNode - The best last node before reaching the end.
 * @returns The reconstructed path as an array of node indices.
 */
function reconstructPath(
  parent: number[][],
  n: number,
  start: number,
  end: number,
  lastNode: number
): number[] {
  const path: number[] = [];
  let mask = ((1 << n) - 1) ^ (1 << end); // All nodes except the 'end' node
  let current = lastNode;

  // Backtrack from the last node to the start node
  while (current !== start) {
    path.push(current);
    const prevNode = parent[mask][current];
    mask ^= 1 << current;
    current = prevNode;
  }

  // Add the start node to the path
  path.push(start);
  path.reverse();

  // Finally, add the end node
  path.push(end);

  return path;
}
