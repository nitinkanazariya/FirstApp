import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {color} from '../Image/Color/color';
const LoginScreen = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loding, setLoding] = useState(false);
  const handleLogin = () => {
    if (username == '' || password == '') {
      Alert.alert('Enter Details');
    } else {
      onhandleLoginn();
      setLoding(true);
      setPassword('');
      setUsername('');
    }
  };
  const onhandleLoginn = async () => {
    try {
      await auth()
        .signInWithEmailAndPassword(username, password)
        .then(() => {
          firestore()
            .collection('User')
            .where('email', '==', username)
            .get()
            .then(async res => {
              const data = res.docs[0].data();
              await AsyncStorage.setItem('userData', JSON.stringify(data));
              await props.navigation.navigate('home');
              setLoding(false);
            })
            .catch(err => {
              console.log(err);
              setLoding(false);
              Alert.alert('invalid email or password');
            });
        })
        .catch(e => {
          Alert.alert('invalid email or password');
          setLoding(false);
        });
    } catch (error) {}
  };

  return (
    <View style={{flex: 1}}>
      {loding ? (
        <View
          style={{
            flex: 1,
            backgroundColor: color.black,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <StatusBar backgroundColor={color.black} barStyle={'light-content'} />
          <ActivityIndicator size={30} color={color.white} />
        </View>
      ) : (
        <View style={styles.container}>
          <StatusBar backgroundColor={color.black} />

          <Text
            style={{
              color: color.white,
              fontSize: 25,
              textAlign: 'center',

              marginBottom: '15%',
              fontWeight: 'bold',
            }}>
            Login
          </Text>

          <TextInput
            placeholder="Email"
            value={username}
            onChangeText={text => setUsername(text)}
            style={{
              backgroundColor: color.white,
              color: color.black,
              fontSize: 16,
              borderRadius: 10,
              paddingHorizontal: 15,
            }}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
            style={{
              backgroundColor: color.white,
              color: color.black,
              fontSize: 16,
              borderRadius: 10,
              paddingHorizontal: 15,
              marginTop: 20,
            }}
          />

          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: 'pink',
              alignSelf: 'center',
              marginTop: 40,
              padding: 10,
              width: '50%',
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: color.black,
                fontWeight: '700',
                fontSize: 16,
                textAlign: 'center',
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: 10}}
            onPress={() => props.navigation.navigate('signup')}>
            <Text
              style={{
                color: color.white,
                textAlign: 'center',
                letterSpacing: 1,
              }}>
              Create new Account ?{' '}
              <Text style={{color: 'skyblue'}}> SignUp</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: color.black,
  },
});

export default LoginScreen;
