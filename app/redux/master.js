export const SET_FAVORITES = 'SET_FAVORITES';

export const setFavorites = data => ({
  type: SET_FAVORITES,
  payload: {data},
});

const initialState = {
  favorites: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FAVORITES:
      return {
        ...state,
        favorites: action?.payload?.data,
      };
    default:
      return state;
  }
};
