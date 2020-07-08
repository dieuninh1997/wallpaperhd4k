import React, {useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from 'react-navigation-hooks';
import {Text} from '../components';
import {screenNames} from '../configs/const';
import Header from '../components/Header';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const FavoriteScreen = props => {
  const master = useSelector(state => state.master);
  const {favorites = []} = master;
  const {navigate} = useNavigation();

  const handleGoBack = () => {
    props?.navigation.goBack();
  };

  const renderLeftHeader = () => (
    <TouchableOpacity
      hitSlop={{
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }}
      onPress={handleGoBack}>
      <Icon
        name="keyboard-backspace"
        size={(26 / 375) * width}
        color={'#fff'}
      />
    </TouchableOpacity>
  );

  const renderCenterHeader = () => {
    return <Text>Favorite</Text>;
  };

  const renderHeader = () => {
    return (
      <Header
        showStatusBar={true}
        left={renderLeftHeader()}
        center={renderCenterHeader()}
      />
    );
  };
  const handleGoImageDetailScreen = image => {
    navigate({routeName: screenNames.ImageDetailScreen, params: {image}});
  };
  return (
    <View style={styles.container}>
      {renderHeader()}
      {favorites.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={favorites}
          extraData={favorites}
          numColumns={3}
          keyExtractor={(item, index) => `Image-${index}`}
          onEndReachedThreshold={0.5}
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
      ) : (
        <View style={styles.emptyView}>
          <Icon
            name="heart-broken"
            size={(100 / 375) * width}
            color={'rgba(255, 255, 255, 0.4)'}
          />
          <Text style={styles.emptyText}>No wallpapers in Favorites</Text>
        </View>
      )}
    </View>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161952',
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
