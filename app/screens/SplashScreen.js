import {useEffect, useCallback} from 'react';
import {useNavigation} from 'react-navigation-hooks';
import {screenNames} from '../configs/const';
import {dispatch} from 'rxjs/internal/observable/pairs';
import {setCollections} from '../redux/master';

const SplashScreen = () => {
  const {navigate} = useNavigation();

  useEffect(() => {
    const loadData = () => {
      dispatch(setCollections());
    };

    const timeout = setTimeout(() => {
      goMainScreen();
    }, 1000);
    return () => {
      clearTimeout(timeout);
      loadData();
    };
  }, [goMainScreen]);
  const goMainScreen = useCallback(() => {
    navigate({routeName: screenNames.MainScreen, params: {}});
  }, [navigate]);

  return null;
};

export default SplashScreen;
