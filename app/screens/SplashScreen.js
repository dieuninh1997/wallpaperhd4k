import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {screenNames} from '../configs/const';
import {setApiKeys, setCollections} from '../redux/master';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  useEffect(() => {
    let unsubscribe1;
    const unsubscribe = firestore()
      .collection('collections')
      .onSnapshot(querySnapshot => {
        const collections = querySnapshot.docs.map(documentSnapshot => ({
          search: documentSnapshot.data()?.search,
          image: documentSnapshot.data()?.image,
        }));
        dispatch(setCollections(collections));

        unsubscribe1 = firestore()
          .collection('apikeys')
          .onSnapshot(querySnapshot1 => {
            const apiKeys = querySnapshot1.docs.map(
              documentSnapshot => documentSnapshot.data()?.apiKey,
            );
            dispatch(setApiKeys(apiKeys));
            goMainScreen();
          });
      });
    return () => {
      unsubscribe();
      unsubscribe1();
    };
  }, []);

  const goMainScreen = () => {
    navigate({routeName: screenNames.MainScreen, params: {}});
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} />
  );
};

export default SplashScreen;
