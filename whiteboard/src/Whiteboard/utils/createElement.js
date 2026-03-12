import { tooltype } from "../../constants";
import rough from "roughjs";

const generator = rough.generator();

const generateEllipse = ({ x1, y1, x2, y2 }) => {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  return generator.ellipse(cx, cy, width, height);
};

export const generateRectangle = ({ x1, y1, x2, y2 }) => {
  const width = x2 - x1;
  const height = y2 - y1;
  return generator.rectangle(x1, y1, width, height);
};

export const generateLine = ({ x1, y1, x2, y2 }) => {
  return generator.line(x1, y1, x2, y2);
};

export const createElement = ({ x1, y1, x2, y2, id, type, text }) => {
  switch (type) {
    case tooltype.RECTANGLE: {
      const roughElement = generateRectangle({ x1, y1, x2, y2 });
      return { id, type, roughElement, x1, y1, x2, y2 };
    }

    case tooltype.LINE: {
      const lineRoughElement = generateLine({ x1, y1, x2, y2 });
      return { id, type, roughElement: lineRoughElement, x1, y1, x2, y2 };
    }

    case tooltype.TEXT:
      return { id, type, x1, y1, x2, y2, text: text || "" };

    case tooltype.ELLIPSE: {
      const ellipseRoughElement = generateEllipse({ x1, y1, x2, y2 });
      return { id, type, roughElement: ellipseRoughElement, x1, y1, x2, y2 };
    }

    default:
      throw new Error(`SOMETHING WENT WRONG - unsupported type: ${type}`);
  }
};
