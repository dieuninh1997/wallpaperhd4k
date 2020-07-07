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
        'https://www.pexels.com/photo/selective-focus-photography-of-grey-wire-995043/',
    },
    {
      search: 'design',
      image:
        'https://www.pexels.com/photo/yellow-and-and-blue-colored-pencils-1762851/',
    },
    {
      search: 'nature',
      image:
        'https://www.pexels.com/photo/bengal-tiger-half-soak-body-on-water-during-daytime-145939/',
    },
    {
      search: 'universe',
      image: 'https://www.pexels.com/photo/sky-space-milky-way-stars-110854/',
    },
    {
      search: 'art',
      image: 'https://www.pexels.com/photo/julius-caesar-marble-statue-615344/',
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
    default:
      return state;
  }
};
