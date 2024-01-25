import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../screen/home';
import LoginScreen from '../../screen/login';
import SignUp from '../../screen/signup';
import ChatScreen from '../../screen/chat';
import SplashScreen from '../../screen/Splash';
import AiLogin from '../../AiScreen/AiLogin';
import AiSplash from '../../AiScreen/AiSplash';
import AiChat from '../../AiScreen/AiChat';
import Group from '../../screen/Group';
import Theme from '../../screen/Theme';

const Stack = createNativeStackNavigator();

const StackScreen = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName="contact"
        screenOptions={{headerShown: false, animation: 'fade_from_bottom'}}>
        <Stack.Screen name="splash" component={SplashScreen} />
        <Stack.Screen name="signup" component={SignUp} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="chat" component={ChatScreen} />
        <Stack.Screen name="group" component={Group} />
        <Stack.Screen name="theme" component={Theme} />

        {/* <Stack.Screen name="splash" component={AiSplash} />
        <Stack.Screen name="login" component={AiLogin} />
        <Stack.Screen name="chat" component={AiChat} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackScreen;
