import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    tool : null ,
    elements : []
}

const whiteboardSlice  = createSlice({
    name : 'whiteboardSlice',
    initialState,
    reducers : {
        setToolType : (state,action) => {
            state.tool = action.payload
        },
        updateElements : (state,action) => {
            const {id} = action.payload
           const index =  state.elements.findIndex((el) => {
               return  el.id === id
            })

            if(index === -1){
                state.elements.push(action.payload)
            }else{
                state.elements[index] = action.payload;
            }
        },
        setElement : (state,action) => {
            state.elements = action.payload
        }
    }
})

export const {setToolType,updateElements,setElement} = whiteboardSlice.actions;
export default whiteboardSlice.reducer;
