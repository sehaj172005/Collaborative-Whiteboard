import { positions } from "../../constants/positions";


export const GetCursortype = (position) => {

    switch(position){
        case positions.TOP_LEFT:
        case positions.BOTTOM_RIGHT:
        case positions.START:
        case positions.END:
            return "nw-resize"
        case positions.BOTTOM_LEFT:
        case positions.TOP_RIGHT:
            return "nesw-resize"
        default:
            return "move"
    }
}

