import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '../Image/Icon';
import {color} from '../Image/Color/color';

const Contact = ({
  name,
  number,
  alignSelf,
  marginLeft,
  marginRight,
  backgroundColor,
  namecolor,
  numbercolor,
  onContact,
  timeColor,
  time,
}) => {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        alignSelf: alignSelf,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5,
        marginRight: marginRight,
        marginLeft: marginLeft,
        borderWidth: 1,
        borderColor: color.gray,
      }}>
      <Image
        source={Icon.profile}
        style={{borderRadius: 50, height: 40, width: 40}}
      />
      <View style={{marginLeft: 10, justifyContent: 'center'}}>
        <Text
          style={{
            color: namecolor,
            fontSize: 15,
            fontWeight: '700',
            flexWrap: 'wrap',
          }}>
          {name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: numbercolor,
            flexWrap: 'wrap',
            paddingRight: 30,
          }}>
          {number}
        </Text>
        <Text
          style={{
            textAlign: 'right',
            fontSize: 12,
            marginTop: backgroundColor == color.white ? 25 : 5,
            color: timeColor,
          }}>
          {time}
        </Text>
      </View>
      {backgroundColor == color.white ? (
        <TouchableOpacity
          onPress={onContact}
          style={{
            backgroundColor: color.black,
            position: 'absolute',
            left: 5,
            bottom: 5,
            padding: 5,
            borderRadius: 5,
          }}>
          <Text style={{color: color.white, fontSize: 13, fontWeight: '700'}}>
            Add To Contact
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Contact;
