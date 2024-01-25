import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  PermissionsAndroid,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {Icon} from '../Image/Icon';
import Contacts from 'react-native-contacts';
import {color} from '../Image/Color/color';
import {useSelector} from 'react-redux';
import Theme from './Theme';

const HomeScreen = props => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState('');
  const THEME = useSelector(state => state.theme.data);
  const Dark = THEME == 'DARK';
  useFocusEffect(
    React.useCallback(() => {
      const get = async () => {
        getUsers();
        const dataa = await AsyncStorage.getItem('theme');
        let DARK = JSON.parse(dataa);
        if (DARK == true) {
          dispatch(changeTheme('DARK'));
        } else {
          dispatch(changeTheme('LIGHT'));
        }
      };
      get();
    }, []),
  );

  const createTwoButtonAlert = () =>
    Alert.alert('Alert', 'Are you sure for logout', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => onLogOut()},
    ]);

  const getUsers = async () => {
    const tempData = [];
    const res = await AsyncStorage.getItem('userData');
    const info = JSON.parse(res);
    setId(info.id);
    await firestore()
      .collection('User')
      .where('email', '!=', info.email)
      .get()
      .then(res => {
        if (res.docs != []) {
          res.docs.map(item => {
            tempData.push(item.data());
          });
          setData(tempData);
        }
      })
      .catch(() => {});
  };

  const onLogOut = async () => {
    await AsyncStorage.clear();
    props.navigation.navigate('splash');
  };

  const list = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('chat', {data: item, myid: id});
        }}
        style={{
          marginTop: 10,
          padding: 10,
          marginHorizontal: 10,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Dark ? color.lightgray : color.white,
        }}>
        <Image
          source={Icon.profile}
          style={{height: 45, width: 45, borderRadius: 100}}
        />
        <Text style={{fontSize: 16, marginLeft: 20, color: color.black}}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
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
          justifyContent: 'space-between',
          paddingVertical: 30,

          borderBottomRightRadius: 50,
        }}>
        <Text
          style={{
            color: color.white,
            fontSize: 20,
            fontWeight: '700',
          }}>
          Chatbes
        </Text>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Image
            source={Icon.menu}
            style={{
              tintColor: color.white,
              height: 22,
              width: 22,
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      </View>
      <FlatList data={data} renderItem={list} />
      <Modal visible={visible} transparent>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <View
              style={{
                backgroundColor: color.white,
                position: 'absolute',
                right: 0,
                padding: 10,
                width: '35%',
                top: 10,
                borderRadius: 5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('group', {myid: id});
                  setVisible(false);
                }}>
                <Text
                  style={{color: color.black, fontWeight: '700', fontSize: 15}}>
                  New Group
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  createTwoButtonAlert();
                  setVisible(false);
                }}>
                <Text
                  style={{
                    color: color.black,
                    fontWeight: '700',
                    fontSize: 15,
                    marginTop: 10,
                  }}>
                  Logout
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  props.navigation.navigate('theme');
                }}>
                <Text
                  style={{
                    color: color.black,
                    fontWeight: '700',
                    fontSize: 15,
                    marginTop: 10,
                  }}>
                  Theme
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default HomeScreen;
