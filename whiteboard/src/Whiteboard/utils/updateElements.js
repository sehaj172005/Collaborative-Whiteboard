import { tooltype } from "../../constants";
import { Emitupdatefuction } from "../../socketconn/socketconn";
import { setElement } from "../whiteboardSlice";
import { createElement } from "./createElement";

export const updateElement = (
  { x1, y1, x2, y2, type, index, id, text },
  elements,
  dispatch
) => {
  const elementsCopy = [...elements];

  switch (type) {
    case tooltype.RECTANGLE:
      const rectElement = createElement({ x1, y1, x2, y2, id, type });
      elementsCopy[index] = rectElement;
      dispatch(setElement(elementsCopy));
      Emitupdatefuction(rectElement);
      break;

    case tooltype.LINE:
      const lineElement = createElement({ x1, y1, x2, y2, id, type });
      elementsCopy[index] = lineElement;
      dispatch(setElement(elementsCopy));
      Emitupdatefuction(lineElement);
      break;

    case tooltype.TEXT:
      // Get canvas context for text measurements
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = "24px sans-serif"; // Set font before measuring

      const textWidth = ctx.measureText(text || "").width;
      const textHeight = 24;

      const textElement = {
        ...createElement({
          x1,
          y1,
          x2: x1 + textWidth,
          y2: y1 + textHeight,
          id,
          type,
          text: text || "",
        }),
      };

      elementsCopy[index] = textElement;
      dispatch(setElement(elementsCopy));
      Emitupdatefuction(textElement);
      break;

    case tooltype.ELLIPSE:
      const ellipseElement = createElement({ x1, y1, x2, y2, id, type });
      elementsCopy[index] = ellipseElement;
      dispatch(setElement(elementsCopy));
      Emitupdatefuction(ellipseElement);

      break;

    default:
      throw new Error(`Unsupported element type: ${type}`);
  }
};
