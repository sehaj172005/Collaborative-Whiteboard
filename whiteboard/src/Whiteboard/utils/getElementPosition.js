import { tooltype } from "../../constants";
import { positions } from "../../constants/positions";

// Check if the point is near a corner/endpoint
const NearPoint = (x, y, x1, y1, position) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? position : null;
};

// Check if a point (x, y) lies near a line from (x1, y1) to (x2, y2)
const OnLine = (x1, y1, x2, y2, x, y, threshold = 2) => {
  const lineLength = Math.hypot(x2 - x1, y2 - y1);
  const d1 = Math.hypot(x - x1, y - y1);
  const d2 = Math.hypot(x - x2, y - y2);
  const distanceToLine = Math.abs(d1 + d2 - lineLength);
  return distanceToLine <= threshold ? positions.INSIDE : null;
};

const findElementPosition = (x, y, el) => {
  switch (el.type) {
    case tooltype.RECTANGLE: {
      const TOP_RIGHT = NearPoint(x, y, el.x2, el.y1, positions.TOP_RIGHT);
      const TOP_LEFT = NearPoint(x, y, el.x1, el.y1, positions.TOP_LEFT);
      const BOTTOM_LEFT = NearPoint(x, y, el.x1, el.y2, positions.BOTTOM_LEFT);
      const BOTTOM_RIGHT = NearPoint(
        x,
        y,
        el.x2,
        el.y2,
        positions.BOTTOM_RIGHT
      );

      const inside =
        x >= el.x1 && x <= el.x2 && y >= el.y1 && y <= el.y2
          ? positions.INSIDE
          : null;

      return TOP_RIGHT || TOP_LEFT || BOTTOM_LEFT || BOTTOM_RIGHT || inside;
    }

    case tooltype.TEXT:
      return x >= el.x1 && x <= el.x2 && y >= el.y1 && y <= el.y2
        ? positions.INSIDE
        : null;

    case tooltype.LINE:
      const START = NearPoint(x, y, el.x1, el.y1, positions.START);
      const END = NearPoint(x, y, el.x2, el.y2, positions.END);
      const ONLINE = OnLine(el.x1, el.y1, el.x2, el.y2, x, y);
      return START || END || ONLINE;

    case tooltype.ELLIPSE:
      // Calculate center of the ellipse
      const cx = (el.x1 + el.x2) / 2;
      const cy = (el.y1 + el.y2) / 2;

      // Radii
      const rx = Math.abs(el.x2 - el.x1) / 2;
      const ry = Math.abs(el.y2 - el.y1) / 2;

      // Point inside ellipse test using ellipse equation
      const normalizedX = (x - cx) / rx;
      const normalizedY = (y - cy) / ry;
      const distance = normalizedX ** 2 + normalizedY ** 2;

      if (distance <= 1) {
        return positions.INSIDE;
      }

    default:
      return null;
  }
};

export const getElementPosition = (clientX, clientY, elements) => {
  const matched = elements
    .map((el) => ({
      ...el,
      position: findElementPosition(clientX, clientY, el),
    }))
    .filter((el) => el.position !== null && el.position !== undefined);

  if (matched.length === 0) return null;

  matched.sort((a, b) => {
    const areaA = Math.abs((a.x2 - a.x1) * (a.y2 - a.y1));
    const areaB = Math.abs((b.x2 - b.x1) * (b.y2 - b.y1));
    return areaA - areaB;
  });

  return matched[0];
};
