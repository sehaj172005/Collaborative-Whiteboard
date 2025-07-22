import { configureStore } from '@reduxjs/toolkit';
import whiteboardSlicer from "../Whiteboard/whiteboardSlice";

export const store = configureStore({
  reducer: {
    whiteboardSlice: whiteboardSlicer,  // This key is fine — it’s just a state path
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["whiteboardSlice/updateElements"],
        ignoredPaths: ["whiteboardSlice.elements"],
      },
    }),
});
