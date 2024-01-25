import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '../Image/Icon';

const TextMessage = ({
  Message,
  alignSelf,
  marginLeft,
  marginRight,
  backgroundColor,
  color,
  onText,
  timeColor,
  time,
}) => {
  return (
    <TouchableOpacity
      onPress={onText}
      style={{
        backgroundColor: backgroundColor,
        alignSelf: alignSelf,
        borderRadius: 5,
        padding: 5,
        marginRight: marginRight,
        marginLeft: marginLeft,
      }}>
      <Text
        style={{
          color: color,
          fontSize: 15,
          fontWeight: '500',
          lineHeight: 23,
          letterSpacing: 0.5,
        }}>
        {Message}
      </Text>
      <Text style={{textAlign: 'right', fontSize: 12, color: timeColor}}>
        {time}
      </Text>
    </TouchableOpacity>
  );
};

export default TextMessage;
