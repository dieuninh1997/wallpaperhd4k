import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import {Text} from '../components';
import {screenNames} from '../configs/const';
import axios from '../configs/axios';
import AppConfig from '../utils/AppConfig';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const CollectionScreen = props => {
  const {search} = props?.navigation?.state?.params;
  const {navigate} = useNavigation();

  const [listImage, setListImage] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const asyncLoadData = async () => {
      await getImages();
    };

    asyncLoadData();
  }, [getImages]);

  const handleGoBack = () => {
    props?.navigation.goBack();
  };

  const getImages = useCallback(async () => {
    setIsLoadingMore(true);
    try {
      const response = await axios.get(
        `/search?query=${search}&per_page=80&page=${nextPage}`,
        {
          headers: {
            Authorization: AppConfig.API_ACCESS_KEY,
          },
        },
      );
      setListImage([...listImage, ...response.data.photos]);
      setNextPage(nextPage + 1);
      setIsLoadingMore(false);
    } catch (error) {
      setIsLoadingMore(false);
      console.log('getImages error', error);
    }
  }, [listImage, nextPage, search]);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get(
        `/search?query=${search}&per_page=80&page=1`,
        {
          headers: {
            Authorization: AppConfig.API_ACCESS_KEY,
          },
        },
      );

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

  const renderFooter = () => {
    if (!isLoadingMore) {
      return null;
    }
    return (
      <ActivityIndicator style={{color: '#000', height: (50 / 375) * width}} />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        refreshing={isRefreshing}
        onRefresh={handleRefreshData}
        showsVerticalScrollIndicator={false}
        data={listImage}
        numColumns={3}
        keyExtractor={(item, index) => `Image-${index}`}
        extraData={listImage}
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
        onEndReachedThreshold={0.5}
        onEndReached={getImages}
        ListFooterComponent={renderFooter}
      />
      <View style={styles.topView}>
        <TouchableOpacity style={styles.btn} onPress={handleGoBack}>
          <Icon
            name="keyboard-backspace"
            size={(26 / 375) * width}
            color={'#fff'}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{search}</Text>
      </View>
    </View>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161952',
  },
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: (50 / 375) * width + StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 40, 49, 0.4)',
  },
  title: {
    fontSize: 24,
    textTransform: 'uppercase',
    alignSelf: 'center',
  },
  btn: {
    left: 16,
    position: 'absolute',
  },
});
