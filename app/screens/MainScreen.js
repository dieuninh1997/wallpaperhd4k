import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SplashScreen from 'react-native-splash-screen';
import Drawer from 'react-native-drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Text} from '../components';
import Header from '../components/Header';
import axios from '../configs/axios';
import FastImage from 'react-native-fast-image';

const MainScreen = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [screenNavigate, setScreenNavigate] = useState('HomeScreen');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(1);

  useEffect(() => {
    SplashScreen.hide();

    const asyncLoadData = async () => {
      await getImages();
    };
  }, [getImages]);

  const getImages = useCallback(async () => {
    setIsLoadingMore(true);
    try {
      const response = await axios.get(`/popular?per_page=80&page=${nextPage}`);
      console.log('================================================');
      console.log('response', response);
      console.log('================================================');
      setListImage([...listImage, ...response.data.photos]);
      setNextPage(nextPage + 1);
      setIsLoadingMore(false);
    } catch (error) {
      setIsLoadingMore(false);
      console.log('getImages.error', error);
    }
  }, [listImage, nextPage]);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get('/popular?per_page=80&page=1');
      console.log('================================================');
      console.log('handleRefreshData', response);
      console.log('================================================');
      setListImage(response.data.photos);
      setNextPage(1);
      setIsRefreshing(false);
    } catch (error) {
      setIsRefreshing(false);
      console.log('handleRefreshData.error', error);
    }
  };

  const handleGoImageDetailScreen = image => {};

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

  const renderCenterHeader = () => <Text>Trending</Text>;

  const renderHeader = () => {
    return (
      <Header
        showStatusBar={false}
        left={renderLeftHeader()}
        center={renderCenterHeader()}
      />
    );
  };

  const handleTrendingPressed = () => {
    setScreenNavigate('HomeScreen');
  };

  const handleNewestPressed = () => {
    setScreenNavigate('TrendingScreen');
  };

  const renderFooter = () => {
    if (!isLoadingMore) {
      return null;
    }
    return (
      <ActivityIndicator style={{color: '#000', height: (50 / 375) * width}} />
    );
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
          <TouchableOpacity style={styles.row} onPress={handleTrendingPressed}>
            <Icon size={30} color="#161952" name="home" />
            <Text
              style={[
                styles.label,
                screenNavigate === 'HomeScreen' ? {fontWeight: 'bold'} : null,
              ]}>
              Trending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleNewestPressed}>
            <Icon size={30} color="#161952" name="trending-up" />
            <Text
              style={[
                styles.label,
                screenNavigate === 'TrendingScreen'
                  ? {fontWeight: 'bold'}
                  : null,
              ]}>
              Newest
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
              style={{flex: 1}}
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
});
