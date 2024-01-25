import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '../Image/Icon';
import {color} from '../Image/Color/color';

const ChatImage = ({
  uri,
  alignSelf,
  marginRight,
  marginLeft,
  onImage,
  backgroundColor,
  onDownload,
  timeColor,

  time,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={{
        alignSelf: alignSelf,
        marginRight,
        marginLeft,
        backgroundColor,
        borderRadius: 10,
      }}
      onPress={onImage}>
      <Image
        source={{uri: uri}}
        style={{height: 200, width: 200, borderRadius: 10}}
      />
      <Text
        style={{
          color: timeColor,
          textAlign: 'right',
          fontSize: 12,
          marginRight: 5,
        }}>
        {time}
      </Text>
      {icon == null ? null : (
        <TouchableOpacity
          onPress={onDownload}
          style={{
            backgroundColor: color.white,
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            position: 'absolute',
            top: 85,
            left: 85,
          }}>
          <Image
            source={icon}
            style={{
              height: 20,
              width: 20,
              tintColor: color.black,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default ChatImage;
