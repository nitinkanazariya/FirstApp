///  1  Store.js file

import {configureStore} from '@reduxjs/toolkit';
import ThemeSlice from './ThemeSlice';

export const Store = configureStore({
  reducer: {
    theme: ThemeSlice,
  },
});
export default Store;

////  2 themeslice.js

// import {createSlice} from '@reduxjs/toolkit';
// export const ThemeSlice = createSlice({
//   name: 'Theme',
//   initialState: {
//     data: 'LIGHT',
//   },
//   reducers: {
//     changeTheme(state, action) {
//       state.data = action.payload;
//     },
//   },
// });
// export const {changeTheme} = ThemeSlice.actions;
// export default ThemeSlice.reducer;

//// 3 useselector
// const THEME = useSelector(state => state.theme.data);
// const Dark = THEME == 'DARK';

//// 4 usedispatch
// const dispatch = useDispatch();
// dispatch(changeTheme('DARK'));
