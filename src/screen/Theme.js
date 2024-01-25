import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {color} from '../Image/Color/color';
import {Icon} from '../Image/Icon';
import {useDispatch, useSelector} from 'react-redux';
import {changeTheme} from '../Redux/ThemeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Theme = props => {
  const [light, setlight] = useState(false);
  const THEME = useSelector(state => state.theme.data);
  const Dark = THEME == 'DARK';

  const dispatch = useDispatch();
  const ThemeChange = async () => {
    if (light == true) {
      dispatch(changeTheme('DARK'));
      await AsyncStorage.setItem('theme', JSON.stringify({data: 'DARK'}));
    } else {
      dispatch(changeTheme('LIGHT'));
      await AsyncStorage.setItem('theme', JSON.stringify({data: 'LIGHT'}));
    }
  };

  useEffect(() => {
    ThemeChange();
  }, [light]);

  useEffect(() => {
    setlight(Dark == true ? true : false);
  }, []);

  return (
    <View style={{backgroundColor: Dark ? color.black : color.chatBg, flex: 1}}>
      <StatusBar
        backgroundColor={Dark ? color.lightblack : color.black}
        barStyle={'light-content'}
      />
      <View
        style={{
          backgroundColor: Dark ? color.lightblack : color.black,
          padding: 15,
          alignItems: 'center',
          flexDirection: 'row',
          paddingVertical: 30,
          borderBottomRightRadius: 50,
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            source={Icon.back}
            style={{
              tintColor: color.white,
              height: 22,
              width: 22,
              marginRight: 20,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: color.white,
            fontSize: 20,
            fontWeight: '700',
          }}>
          Chatbes
        </Text>
      </View>
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={Icon.theme}
            style={{
              tintColor: Dark ? color.white : color.black,
              height: 22,
              width: 22,
              marginRight: 10,
            }}
          />
          <Text
            style={{
              color: Dark ? color.white : color.black,
              fontWeight: '600',
              fontSize: 16,
            }}>
            {'Dark Theme'}
          </Text>
        </View>
        <Switch
          value={light}
          onValueChange={() => setlight(!light)}
          thumbColor={light ? '#1dc278' : color.lightgray}
        />
      </View>
    </View>
  );
};

export default Theme;
