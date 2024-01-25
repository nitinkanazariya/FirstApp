import {View, Text, Modal, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '../Image/Icon';
import {color} from '../Image/Color/color';

const ImageViewModal = ({visible, uri, closeModal}) => {
  return (
    <View>
      <Modal visible={visible} transparent>
        <View style={{flex: 1}}>
          <Image source={{uri: uri}} style={{flex: 1}} />
          <TouchableOpacity
            onPress={closeModal}
            style={{
              position: 'absolute',
              right: 20,
              top: 20,
              padding: 5,
              borderRadius: 50,
              backgroundColor: color.white,
            }}>
            <Image
              source={Icon.cancel}
              style={{
                height: 25,
                width: 25,
              }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ImageViewModal;
