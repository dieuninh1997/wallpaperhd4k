import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  CameraRoll,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigationParam} from 'react-navigation-hooks';
import {Text} from '../components';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Share from 'react-native-share';
import RNWalle from 'react-native-walle';
import AppPreferences from '../utils/AppPreferences';
import RNFetchBlob from 'rn-fetch-blob';
import {setFavorites} from '../redux/master';
import {useDispatch} from 'react-redux';

const {width, height} = Dimensions.get('window');

const ImageDetailScreen = props => {
  const dispatch = useDispatch();
  const master = useSelector(state => state.master);
  const {favorites = []} = master;
  const image = useNavigationParam('image');
  const [isShowModalSetWallpaper, setIsShowModalSetWallpaper] = useState(false);

  const handleGoBack = () => {
    props?.navigation.goBack();
  };

  const shareSingleImage = async url => {
    const shareOptions = {
      title: 'Share file',
      url,
      failOnCancel: false,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  const handleShowActionsheet = () => {
    setIsShowModalSetWallpaper(true);
  };

  const handleSetWallpaper = (localtion = 'system') => {
    setIsShowModalSetWallpaper(false);

    RNWalle.setWallPaper(image?.src?.portrait, localtion, res => {
      if (res === 'success') {
        AppPreferences.showToastMessage('Home screen wallpaper applied');
      }
    });
  };

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          return true;
        } else {
          //If permission denied then show alert 'Storage Permission Not Granted'
          AppPreferences.showToastMessage('Storage Permission Not Granted');
          return false;
        }
      } catch (err) {
        //To handle permission related issue
        console.warn(err);
      }
    } else {
      return true;
    }
  };
  const saveToGallery = imgUrl => {
    if (!imgUrl) {
      return;
    }
    if (!checkPermission()) {
      return;
    }
    const imageName = imgUrl.substring(
      imgUrl.lastIndexOf('/') + 1,
      imgUrl.lastIndexOf('?'),
    );
    const dirs = RNFetchBlob.fs.dirs;
    const path =
      Platform.OS === 'ios'
        ? dirs.MainBundleDir + imageName
        : dirs.PictureDir + imageName;

    if (Platform.OS === 'android') {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
        indicator: true,
        IOSBackgroundTask: true,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Image',
        },
      })
        .fetch('GET', imgUrl)
        .then(res => {
          AppPreferences.showToastMessage('Downloaded Successful!');
        });
    } else {
      CameraRoll.saveToCameraRoll(imgUrl);
    }
  };

  const renderModal = () => (
    <Modal
      isVisible={isShowModalSetWallpaper}
      onBackdropPress={() => setIsShowModalSetWallpaper(false)}
      useNativeDriver
      style={styles.modalContainer}
      animationInTiming={400}
      backdropTransitionInTiming={400}
      animationOutTiming={750}
      backdropTransitionOutTiming={750}>
      <View style={styles.modalSetWallpaper}>
        <TouchableOpacity
          style={styles.buttonModalContainer}
          onPress={() => handleSetWallpaper('system')}>
          <Text style={styles.textModal}>Set as Home screen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonModalContainer, styles.divider]}
          onPress={() => handleSetWallpaper('lock')}>
          <Text style={styles.textModal}>Set as Lock screen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonModalContainer}
          onPress={() => handleSetWallpaper('both')}>
          <Text style={styles.textModal}>Set both</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const handleFavoritePressed = image => {
    const data = [...favorites, image];
    dispatch(setFavorites(data));
  };

  const isFavorite = favorites.find(i => i.id === image.id);

  return (
    <View style={styles.container}>
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        style={{width, height}}
        source={{uri: image?.src?.portrait}}
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.btn, styles.btnBack]}
          onPress={handleGoBack}>
          <Icon
            name="keyboard-backspace"
            size={(26 / 375) * width}
            color={'#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnInfo]}
          onPress={() => handleFavoritePressed(image)}>
          {!isFavorite ? (
            <MaterialCommunityIcons
              name="heart-outline"
              size={(26 / 375) * width}
              color={'#000'}
            />
          ) : (
            <MaterialCommunityIcons
              name="heart"
              size={(26 / 375) * width}
              color={'#000'}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnCenter]}
          onPress={handleShowActionsheet}>
          <Icon name="wallpaper" size={(26 / 375) * width} color={'#000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnInfo]}
          onPress={() => saveToGallery(image?.src?.portrait)}>
          <Icon name="file-download" size={(26 / 375) * width} color={'#000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnBack]}
          onPress={() => shareSingleImage(image?.src?.portrait)}>
          <Icon name="share" size={(24 / 375) * width} color={'#000'} />
        </TouchableOpacity>
      </View>
      {renderModal()}
    </View>
  );
};

export default ImageDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: (20 / 375) * width,
    width,
    paddingHorizontal: (30 / 375) * width,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBack: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  btnInfo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  btnCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: (18 / 375) * width,
  },
  modalSetWallpaper: {
    width: (340 / 375) * width,
    height: (132 / 375) * width,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2ea6d6',
    borderBottomColor: '#2ea6d6',
  },
  buttonModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: (10 / 375) * width,
  },
  textModal: {
    color: '#000',
  },
});
