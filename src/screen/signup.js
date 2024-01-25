import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useState} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Text,
  StatusBar,
  ScrollView,
} from 'react-native';
import uuid from 'react-native-uuid';
import {color} from '../Image/Color/color';

const LoginScreen = props => {
  const [loding, setLoding] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ConfirmPass, setConfirmPass] = useState('');
  const [name, setName] = useState('');
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const userId = uuid.v4();
  const onCreateUser = () => {
    if (name == '' || password == '' || username == '' || ConfirmPass == '') {
      Alert.alert('Enter details');
    } else if (!emailRegex.test(username)) {
      Alert.alert('invalid Email ');
    } else if (password.length <= 8) {
      Alert.alert('maximum 8 character password');
    } else if (password !== ConfirmPass) {
      Alert.alert('Wrong Password');
    } else {
      onAddUser();
      setName(''), setUsername(''), setConfirmPass(''), setPassword('');
      setLoding(true);
    }
  };
  const onAddUser = async () => {
    try {
      await auth()
        .createUserWithEmailAndPassword(username, password)
        .then(async () => {
          await firestore().collection('User').doc(userId).set({
            id: userId,
            name: name,
            email: username,
            password: password,
          });
          setLoding(false);
        })
        .catch(e => {
          console.log(e);
          setLoding(false);
        });
      await props.navigation.navigate('login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('email-already-in-use');
      }
    }
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
          <ActivityIndicator size={40} color={color.white} />
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView style={{flex: 1}}>
            <StatusBar backgroundColor={color.black} />
            <Text
              style={{
                color: color.white,
                fontSize: 25,
                textAlign: 'center',
                marginTop: '30%',
                marginBottom: '15%',
                fontWeight: 'bold',
              }}>
              Sign In
            </Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={text => setName(text)}
              style={{
                backgroundColor: color.white,
                color: color.black,
                fontSize: 16,
                borderRadius: 10,
                paddingHorizontal: 15,
                marginBottom: 20,
              }}
            />
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
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              value={ConfirmPass}
              onChangeText={text => setConfirmPass(text)}
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
              onPress={onCreateUser}
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
                Sign In{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center', marginTop: 10}}
              onPress={() => props.navigation.navigate('login')}>
              <Text
                style={{
                  color: color.white,
                  textAlign: 'center',
                  letterSpacing: 1,
                }}>
                You have an alrady Account ?{' '}
                <Text style={{color: 'skyblue'}}> Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 16,
    backgroundColor: color.black,
  },
});

export default LoginScreen;
