import { createSlice } from '@reduxjs/toolkit';
import { LightTheme, DarkTheme } from '../../theme';

const initialState = {
  theme: DarkTheme,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setLightTheme: (state) => {
      state.theme = LightTheme;
    },
    setDarkTheme: (state) => {
      state.theme = DarkTheme;
    },
  },
});

export const { setLightTheme, setDarkTheme } = themeSlice.actions;

export const selectTheme = (state) => state.theme.theme;

export default themeSlice.reducer;
