import { computeConvexHull, findFurthestPoints } from "./convexHull";
import { findHamiltonianPath, getDistanceMatrix } from "./paths";

export type MarkerType = {
  id: number;
  latitude: number;
  longitude: number;

  title: string;
  description: string;
};

export function sortMarkerAsHamiltonianPath(
  markers: MarkerType[]
): MarkerType[] {
  const distanceMatrix = getDistanceMatrix(markers);
  const hull = computeConvexHull(
    markers.map((marker, index) => ({
      id: index,
      x: marker.longitude,
      y: marker.latitude,
    }))
  );
  const [start, end] = findFurthestPoints(hull);
  const [_,path] = findHamiltonianPath(
    markers.length,
    distanceMatrix,
    start.id,
    end.id
  );
  return path.map((i) => markers[i]);
}

export const markers: MarkerType[] = [
  {
    id: 1,
    latitude: 0.3186,
    longitude: 32.5916,
    title: "Café Javas Kampala",
    description:
      "A popular café known for its extensive menu and excellent customer service, ideal for breakfast meetings or casual hangouts.",
  },
  {
    id: 2,
    latitude: 0.327,
    longitude: 32.601,
    title: "Izumi Restaurant & Lounge",
    description:
      "A trendy spot offering a blend of Japanese, Sushi, and Thai cuisines in a spacious setting, perfect for dining with friends.",
  },
  {
    id: 3,
    latitude: 0.3138,
    longitude: 32.5865,
    title: "La Paroni's Choma Point",
    description:
      "Known for its vibrant atmosphere and live music, this is the go-to spot for parties and gatherings on Parliamentary Avenue.",
  },
  {
    id: 4,
    latitude: 0.3275,
    longitude: 32.602,
    title: "Mythos",
    description:
      "A Greek-inspired restaurant offering Mediterranean dishes, perfect for family dinners or business meetings in Kololo.",
  },
  {
    id: 5,
    latitude: 0.3272,
    longitude: 32.6025,
    title: "The Lawns",
    description:
      "Specializing in game meat with a fusion of continental and local dishes, offering a scenic view of lush gardens.",
  },
  {
    id: 6,
    latitude: 0.3194,
    longitude: 32.5883,
    title: "Cayenne Restaurant & Lounge",
    description:
      "A trendy spot in Bukoto with a poolside ambiance, ideal for evening hangouts, cocktails, and social events.",
  },
  {
    id: 7,
    latitude: 0.3112,
    longitude: 32.591,
    title: "Sky Lounge",
    description:
      "Situated on the rooftop of Kisementi, it offers panoramic views of the city with a lively nightlife vibe.",
  },
  {
    id: 8,
    latitude: 0.3189,
    longitude: 32.5965,
    title: "The Alchemist Kitchen & Bar",
    description:
      "A hip bar in Kololo known for its relaxed atmosphere, craft cocktails, and occasional live music events.",
  },
  {
    id: 9,
    latitude: 0.3125,
    longitude: 32.579,
    title: "Prunes Café",
    description:
      "A charming café offering fresh organic meals, perfect for brunch or working remotely in a relaxed garden setting.",
  },
  {
    id: 10,
    latitude: 0.3203,
    longitude: 32.5969,
    title: "Riders Lounge",
    description:
      "A popular nightlife spot in Kampala with an energetic atmosphere, offering great music, cocktails, and dance floors.",
  },
];
