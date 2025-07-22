import { positions } from "../../constants/positions";

export const Getelementcoordinates = (element, clientX, clientY) => {
  const { x1, y1, x2, y2 } = element;
  switch (element.position) {
    case positions.START:
    case positions.TOP_LEFT:
      return { x1: clientX, y1: clientY, x2, y2 };
    case positions.TOP_RIGHT:
      return { x1, y1: clientY, x2: clientX, y2 };
    case positions.BOTTOM_LEFT:
      return { x1: clientX, y1, x2, y2: clientY };
    case positions.END:
    case positions.BOTTOM_RIGHT:
      return { x1, y1, x2: clientX, y2: clientY };
    
    defualt: return null;
  }
};
