export const SET_FAVORITES = 'SET_FAVORITES';
export const SET_COLLECTIONS = 'SET_COLLECTIONS';

export const setFavorites = data => ({
  type: SET_FAVORITES,
  payload: {data},
});

export const setCollections = () => ({
  type: SET_COLLECTIONS,
  payload: {},
});

const initialState = {
  favorites: [],
  collections: [
    {
      search: 'blur',
      image:
        'https://images.pexels.com/photos/3916456/pexels-photo-3916456.jpeg',
    },
    {
      search: 'design',
      image:
        'https://images.pexels.com/photos/5836/yellow-metal-design-decoration.jpg',
    },
    {
      search: 'nature',
      image: 'https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg',
    },
    {
      search: 'universe',
      image: 'https://images.pexels.com/photos/110854/pexels-photo-110854.jpeg',
    },
    {
      search: 'art',
      image:
        'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg',
    },
  ],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FAVORITES:
      return {
        ...state,
        favorites: action?.payload?.data,
      };
    case SET_COLLECTIONS: {
      return {
        ...state,
        collections: initialState.collections,
      };
    }
    default:
      return state;
  }
};
