import {useEffect} from 'react';
import {useNavigation} from 'react-navigation-hooks';
import {screenNames} from '../configs/const';

const SplashScreen = () => {
  const {navigate} = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      goMainScreen();
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const goMainScreen = () => {
    navigate({routeName: screenNames.MainScreen, params: {}});
  };

  return null;
};

export default SplashScreen;
