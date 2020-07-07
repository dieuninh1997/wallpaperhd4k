import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TextInput,
  StatusBar,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from 'react-navigation-hooks';
import {Text} from '../components';
import {screenNames} from '../configs/const';
import Fontisto from 'react-native-vector-icons/Fontisto';

const {width, height} = Dimensions.get('window');

const CollectionScreen = () => {
  const [searchText, setSearchText] = useState('');
  const master = useSelector(state => state.master);
  const {collections} = master;

  const handleSearchPressed = () => {};
  const handleChangeInput = text => {
    setSearchText(text);
  };
  const renderHeader = () => {
    console.log('================================================');
    console.log('collections', collections);
    console.log('================================================');
    return (
      <View style={styles.searchContainer}>
        <TextInput
          allowFontScaling={false}
          value={searchText}
          style={styles.inputSearch}
          underlineColorAndroid="transparent"
          returnKeyType="done"
          onChangeText={text => handleChangeInput(text)}
          placeholder={'Search for free photos'}
          placeholderTextColor={'#444774'}
        />
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
      </View>
    );
  };

  const handleSuggestionScreen = search => {};
  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleSuggestionScreen(item?.search)}>
      <ImageBackground style={styles.itemBg} source={{uri: item?.image}}>
        <Text style={styles.itemName}>{item?.search}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>{''}</Text>
      {renderHeader()}
      <FlatList
        data={collections}
        extraData={collections}
        keyExtractor={(item, index) => `FlatList-${index}`}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161952',
  },
  searchContainer: {
    marginHorizontal: 20,
    height: 20 + StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight,
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  inputSearch: {
    flex: 1,
    color: '#000',
    fontSize: 14,
    marginRight: 10,
  },
  itemBg: {
    width,
    height: (150 / 375) * width,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
