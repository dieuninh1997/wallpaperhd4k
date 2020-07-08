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
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const CategoryScreen = props => {
  const {navigate} = useNavigation();
  const [searchText, setSearchText] = useState('');
  const master = useSelector(state => state.master);
  const {collections = []} = master;

  const handleChangeInput = text => {
    setSearchText(text);
  };

  const handleGoBack = () => {
    props?.navigation.goBack();
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.btn} onPress={handleGoBack}>
            <Icon
              name="keyboard-backspace"
              size={(26 / 375) * width}
              color={'#fff'}
            />
          </TouchableOpacity>
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
              onPress={() => handleSuggestionScreen(searchText)}>
              <Fontisto size={20} color="#161952" name="search" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.title}>
          Suggested: people, holding hands, love, hugging, couple, wedding more
        </Text>
      </View>
    );
  };

  const handleSuggestionScreen = search => {
    navigate({routeName: screenNames.CollectionScreen, params: {search}});
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSuggestionScreen(item?.search)}>
        <ImageBackground style={styles.itemBg} source={{uri: item?.image}}>
          <Text style={styles.itemName}>{item?.search}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

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

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161952',
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerTop: {
    height: 20 + StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
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
  title: {
    color: '#rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 20,
    marginBottom: 30,
  },
  btn: {},
});
