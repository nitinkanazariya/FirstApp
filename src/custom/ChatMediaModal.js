import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {Icon} from '../Image/Icon';
import {color} from '../Image/Color/color';
import {useSelector} from 'react-redux';

export const ChatMediaModal = ({
  visible,
  onClose,
  onPhoto,
  onCamera,
  onCaptureVideo,
  onVideo,
  onContact,
}) => {
  const THEME = useSelector(state => state.theme.data);
  const Dark = THEME == 'DARK';
  return (
    <View>
      <Modal visible={visible} transparent>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <View
              style={{
                backgroundColor: Dark ? color.lightblack : color.white,
                position: 'absolute',
                bottom: 60,
                left: 10,
                padding: 10,
                width: '70%',
                paddingHorizontal: '10%',
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                borderBottomRightRadius: 30,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.iconView}>
                  <TouchableOpacity
                    style={[
                      styles.TouchableOpacity,
                      {backgroundColor: color.cameraBg}, //orange
                    ]}
                    onPress={onCamera}>
                    <Image source={Icon.camera} style={styles.icon} />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.txt,
                      {color: Dark ? color.white : color.black},
                    ]}>
                    Camera
                  </Text>
                </View>
                <View style={styles.iconView}>
                  <TouchableOpacity
                    style={[
                      styles.TouchableOpacity,
                      {backgroundColor: color.captureBg}, //blue
                    ]}
                    onPress={onCaptureVideo}>
                    <Image source={Icon.videocamera} style={styles.icon} />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.txt,
                      {color: Dark ? color.white : color.black},
                    ]}>
                    Capture
                  </Text>
                </View>
                <View style={styles.iconView}>
                  <TouchableOpacity
                    style={[
                      styles.TouchableOpacity,
                      {backgroundColor: color.contactBg}, //pink
                    ]}
                    onPress={onContact}>
                    <Image source={Icon.contect} style={styles.icon} />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.txt,
                      {color: Dark ? color.white : color.black},
                    ]}>
                    Contect
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <View style={styles.iconView}>
                  <TouchableOpacity
                    style={[
                      styles.TouchableOpacity,
                      {backgroundColor: color.photoBg}, //green
                    ]}
                    onPress={onPhoto}>
                    <Image source={Icon.gallery} style={styles.icon} />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.txt,
                      {color: Dark ? color.white : color.black},
                    ]}>
                    Photo
                  </Text>
                </View>
                <View style={styles.iconView}>
                  <TouchableOpacity
                    style={[
                      styles.TouchableOpacity,
                      {backgroundColor: color.videoBg},
                    ]}
                    onPress={onVideo}>
                    <Image source={Icon.video} style={styles.icon} />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.txt,
                      {color: Dark ? color.white : color.black},
                    ]}>
                    Video
                  </Text>
                </View>
                <View style={styles.iconView}>
                  <TouchableOpacity
                    style={[
                      styles.TouchableOpacity,
                      {backgroundColor: Dark ? color.lightblack : color.white},
                    ]}>
                    {/* <Image source={Icon.gallery} style={styles.icon} /> */}
                  </TouchableOpacity>
                  <Text style={styles.txt}></Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  icon: {height: 25, width: 25, resizeMode: 'contain', tintColor: color.black},
  txt: {
    fontSize: 15,
    textAlign: 'center',
    color: color.black,
    fontWeight: '700',
  },
  TouchableOpacity: {
    backgroundColor: 'pink',
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  iconView: {alignItems: 'center', justifyContent: 'center'},
});
