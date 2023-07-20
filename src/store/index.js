import { configureStore } from "@reduxjs/toolkit";

import gameStateSlice from "./slices/gameStateSlice";

export const store = configureStore({
  reducer: {
    gameState: gameStateSlice,
  },
});
