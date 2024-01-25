// import {View, Text, StatusBar, Image, Animated} from 'react-native';
// import React, {useEffect} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useFocusEffect} from '@react-navigation/native';

// const SplashScreen = props => {
//   const scaleValue = new Animated.Value(1);

//   useEffect(() => {
//     Animated.timing(scaleValue, {
//       toValue: 2,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   }, [scaleValue]);

//   useFocusEffect(
//     React.useCallback(() => {
//       setTimeout(() => {
//         getLocalData();
//       }, 3000);
//     }, []),
//   );

//   const getLocalData = async () => {
//     const data = await AsyncStorage.getItem('userData');
//     // if (data !== null) {
//     //   props.navigation.navigate('home');
//     // } else {
//     //   props.navigation.navigate('login');
//     // }
//   };
//   return (
//     <View
//       style={{
//         backgroundColor: color.white,
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}>
//       <StatusBar backgroundColor={color.white} />
//       <Animated.Image
//         source={require('../assets/logo.png')}
//         style={{height: 80, width: 80, transform: [{scale: scaleValue}]}}
//       />

//       <Animated.Text
//         style={{
//           color: color.black,
//           fontSize: 10,
//           marginTop: 40,
//           letterSpacing: 4,
//           fontWeight: 'bold',
//           transform: [{scale: scaleValue}],
//         }}>
//         Chatbes
//       </Animated.Text>
//     </View>
//   );
// };

// export default SplashScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import React, {useEffect, useRef} from 'react';
import {View, Animated, Easing, StyleSheet, StatusBar} from 'react-native';
import {Icon} from '../Image/Icon';
import {color} from '../Image/Color/color';
import {useDispatch} from 'react-redux';
import {changeTheme} from '../Redux/ThemeSlice';

const SplashScreen = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const dispatch = useDispatch();
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.elastic(10),
        useNativeDriver: true,
      }),
    ]).start();

    [];
  });

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        getLocalData();
        getTheme();
      }, 3000);
    }, []),
  );

  const getLocalData = async () => {
    const data = await AsyncStorage.getItem('userData');
    if (data !== null) {
      props.navigation.reset({
        routes: [{name: 'home'}],
      });
    } else {
      props.navigation.navigate('login');
    }
  };
  const getTheme = async () => {
    const gettheme = await AsyncStorage.getItem('theme');
    const Theme = JSON.parse(gettheme);
    dispatch(changeTheme(Theme.data));
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={color.white} barStyle={'dark-content'} />

      <Animated.Image
        style={[
          styles.logo,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}
        source={Icon.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  logo: {
    width: 175,
    height: 175,
  },
});

export default SplashScreen;
