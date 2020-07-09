import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SplashScreen from 'react-native-splash-screen';
import Drawer from 'react-native-drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Text} from '../components';
import Header from '../components/Header';
import axios from '../configs/axios';
import FastImage from 'react-native-fast-image';
import AppConfig from '../utils/AppConfig';
import {useNavigation} from 'react-navigation-hooks';
import {screenNames} from '../configs/const';

const {width} = Dimensions.get('window');

const MainScreen = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [screenNavigate, setScreenNavigate] = useState('Newest');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const {navigate} = useNavigation();

  useEffect(() => {
    SplashScreen.hide();

    const asyncLoadData = async () => {
      await getImages();
    };
    asyncLoadData();
  }, [getImages]);

  useEffect(() => {
    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleValidateClose,
    );

    return () => handler.remove();
  }, [handleValidateClose]);

  const handleValidateClose = useCallback(() => {
    BackHandler.exitApp();
    return true;
  }, []);

  // useEffect(() => {
  //   setNextPage(1);
  //   setListImage([]);
  // }, [screenNavigate]);

  const getImages = useCallback(async () => {
    setIsLoadingMore(true);
    try {
      let url = `/popular?per_page=80&page=${nextPage}`;
      if (screenNavigate === 'Newest') {
        url = `/curated?per_page=80&page=${nextPage}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: AppConfig.API_ACCESS_KEY,
        },
      });

      setListImage([...listImage, ...response.data.photos]);
      setPerPage(response.data.per_page);
      if (nextPage + 1 <= perPage) {
        setNextPage(nextPage + 1);
      } else {
        setNextPage(1);
      }
      setIsLoadingMore(false);
    } catch (error) {
      setIsLoadingMore(false);
      console.log('getImages.error', error);
    }
  }, [listImage, nextPage, perPage, screenNavigate]);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      let url = '/popular?per_page=80&page=1';
      if (screenNavigate === 'Newest') {
        url = '/curated?per_page=80&page=1';
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: AppConfig.API_ACCESS_KEY,
        },
      });

      setListImage(response.data.photos);
      setNextPage(1);
      setIsRefreshing(false);
    } catch (error) {
      setIsRefreshing(false);
      console.log('handleRefreshData.error', error);
    }
  };

  const handleGoImageDetailScreen = image => {
    navigate({routeName: screenNames.ImageDetailScreen, params: {image}});
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  const handleOpenDrawer = () => {
    setIsOpenDrawer(true);
  };

  const renderLeftHeader = () => (
    <TouchableOpacity
      hitSlop={{
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }}
      onPress={handleOpenDrawer}>
      <Icon size={30} color="#fff" name="format-line-weight" />
    </TouchableOpacity>
  );

  const renderCenterHeader = () => {
    return <Text>{screenNavigate}</Text>;
  };

  const renderRightHeader = () => (
    <TouchableOpacity
      hitSlop={{
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }}
      onPress={handleSearchPressed}>
      <Fontisto size={20} color="#fff" name="search" />
    </TouchableOpacity>
  );

  const handleSearchPressed = () => {
    navigate({routeName: screenNames.CategoryScreen, params: {}});
  };

  const renderHeader = () => {
    return (
      <Header
        showStatusBar={true}
        left={renderLeftHeader()}
        center={renderCenterHeader()}
        right={renderRightHeader()}
      />
    );
  };

  // const handleTrendingPressed = () => {
  //   setScreenNavigate('Trending');
  //   handleCloseDrawer();
  //   getImages();
  // };

  const handleNewestPressed = () => {
    setScreenNavigate('Newest');
    handleCloseDrawer();
    getImages();
  };

  const handleFavoritePressed = () => {
    handleCloseDrawer();
    navigate({routeName: screenNames.FavoriteScreen, params: {}});
  };

  const renderFooter = () => {
    if (!isLoadingMore) {
      return null;
    }
    return <ActivityIndicator style={styles.indicator} />;
  };

  return (
    <Drawer
      openDrawerOffset={0.5}
      open={isOpenDrawer}
      tapToClose
      type="overlay"
      negotiatePan
      panOpenMask={0.3}
      captureGestures
      onClose={handleCloseDrawer}
      content={
        <View style={styles.drawerContainer}>
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={handleCloseDrawer}>
            <Icon size={30} color="#161952" name="format-line-weight" />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.row} onPress={handleTrendingPressed}>
            <Icon size={30} color="#161952" name="home" />
            <Text
              style={[
                styles.label,
                screenNavigate === 'Trending' ? styles.textBold : null,
              ]}>
              Trending
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.row} onPress={handleNewestPressed}>
            <Icon size={30} color="#161952" name="trending-up" />
            <Text
              style={[
                styles.label,
                screenNavigate === 'Newest' ? styles.textBold : null,
              ]}>
              Newest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleFavoritePressed}>
            <Icon size={30} color="#161952" name="heart-box-outline" />
            <Text
              style={[
                styles.label,
                screenNavigate === 'Favorite' ? styles.textBold : null,
              ]}>
              Favorite
            </Text>
          </TouchableOpacity>
        </View>
      }>
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          refreshing={isRefreshing}
          onRefresh={handleRefreshData}
          showsVerticalScrollIndicator={false}
          data={listImage}
          extraData={listImage}
          numColumns={3}
          keyExtractor={(item, index) => `Image-${index}`}
          onEndReachedThreshold={0.5}
          onEndReached={getImages}
          ListFooterComponent={renderFooter}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => handleGoImageDetailScreen(item)}
              style={styles.flexOne}
              activeOpacity={0.9}>
              <FastImage
                source={{uri: item?.src?.portrait}}
                resizeMode={FastImage.resizeMode.stretch}
                style={{width: width / 3, height: (width / 3) * 1.5}}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </Drawer>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161952',
  },
  flexOne: {
    flex: 1,
  },
  buttonClose: {
    alignItems: 'flex-end',
    paddingRight: 20,
    marginBottom: 10,
  },
  drawerContainer: {
    backgroundColor: '#fff',
    flex: 1,
    position: 'relative',
    padding: 10,
  },
  label: {
    fontSize: 14,
    color: '#161952',
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
  indicator: {
    color: '#000',
    height: (50 / 375) * width,
  },
});
