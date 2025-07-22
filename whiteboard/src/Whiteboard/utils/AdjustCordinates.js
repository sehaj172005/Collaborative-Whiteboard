import { setElement } from "../whiteboardSlice";
import { updateElement } from "./updateElements";

export function AdjustCoordinates(elements, dispatch, index) {
    const el = elements[index];
    const { x1, y1, x2, y2 } = el;
    
    // Remove zero-area elements
    if (x1 === x2 && y1 === y2) {
        const newElements = elements.filter((_, i) => i !== index);
        dispatch(setElement(newElements));
        return;
    }
    
    // Normalize coordinates: ensure x1 <= x2 and y1 <= y2
    const normalizedX1 = Math.min(x1, x2);
    const normalizedY1 = Math.min(y1, y2);
    const normalizedX2 = Math.max(x1, x2);
    const normalizedY2 = Math.max(y1, y2);
    
    // Update if coordinates changed
    if ((x1>x2 && y1>y2)) {
        
        updateElement({
            x1: normalizedX1,
            y1: normalizedY1,
            x2: normalizedX2, 
            y2: normalizedY2,
            type: elements[index].type,
            index,

            id: elements[index].id,
        }, elements, dispatch);
    }
}