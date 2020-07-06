import React, {Component} from 'react';
import {StatusBar, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default class Header extends Component {
  static propTypes = {
    left: PropTypes.any,
    center: PropTypes.any,
    right: PropTypes.any,
    showStatusBar: PropTypes.bool,
    headerStyle: PropTypes.object,
    centerStyle: PropTypes.object,
    rightStyle: PropTypes.object,
    leftStyle: PropTypes.object,
  };

  render() {
    const {
      left,
      center,
      right,
      showStatusBar,
      headerStyle,
      centerStyle,
      rightStyle,
      leftStyle,
    } = this.props;
    return (
      <View style={[styles.header, headerStyle]}>
        {showStatusBar && (
          <StatusBar
            backgroundColor="transparent"
            translucent
            barStyle="light-content"
          />
        )}
        <View style={[styles.center, centerStyle]}>{center}</View>
        <View style={[styles.left, leftStyle]}>{left}</View>
        <View style={[styles.right, rightStyle]}>{right}</View>
      </View>
    );
  }
}

Header.defaultProps = {
  showStatusBar: true,
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0d298a',
    elevation: 0,
    height: 44 + StatusBar.currentHeight,
    paddingTop: StatusBar.currentHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  center: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    top: StatusBar.currentHeight,
    bottom: 0,
  },
});
