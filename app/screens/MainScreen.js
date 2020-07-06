import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SplashScreen from 'react-native-splash-screen';
import screens from './index';

const {width} = Dimensions.get('window');
const tabViewConfig = {
  index: 1,
  routes: [
    {key: 'first', icon: 'format-list-bulleted-square'},
    {key: 'second', icon: 'home'},
    {key: 'third', icon: 'trending-up'},
  ],
};
const MainScreen = () => {
  const [navigationState, setNavigationState] = useState(tabViewConfig);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const renderIcon = ({route, focused, color}) => (
    <MaterialCommunityIcons
      name={route.icon}
      size={(28 / 375) * width}
      color={color}
    />
  );

  const renderCustomeTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#fff'}}
      style={{backgroundColor: '#222831'}}
      renderIcon={renderIcon}
      renderLabel={() => null}
      tabStyle={{height: (50 / 375) * width}}
      renderBadge={({route}) => {
        if (route.key === 'third') {
          return;
        }
        return <View style={styles.tabbar} />;
      }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TabView
        renderTabBar={renderCustomeTabBar}
        renderScene={SceneMap({
          first: screens.CategoryScreen,
          second: screens.HomeScreen,
          third: screens.TrendingScreen,
        })}
        navigationState={navigationState}
        onIndexChange={index => setNavigationState({...navigationState, index})}
        initialLayout={{width}}
        swipeEnabled
      />
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    width: (1 / 375) * width,
    height: (30 / 375) * width,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: (10 / 375) * width,
  },
});
