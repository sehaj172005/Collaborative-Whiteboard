import { tooltype } from "../../constants";

export const DrawElements = ({ roughCanvas, ctx, elements }) => {
  elements.forEach((el) => {
    switch (el.type) {
      case tooltype.RECTANGLE:
      case tooltype.LINE:
      case tooltype.ELLIPSE:
        if (el.roughElement) {
          roughCanvas.draw(el.roughElement);
        }
        break;

      case tooltype.TEXT:
        ctx.textBaseline = "top";
        ctx.font = "24px sans-serif";
        ctx.fillStyle = "black";
        ctx.fillText(el.text, el.x1, el.y1);
        break;

      default:
        console.error("Unknown element type:", el.type);
    }
  });
};
