import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';

const AiSplash = props => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('chat');
    }, 3000);
  });
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: color.white,
      }}>
      <Image
        style={{height: 200, width: 200}}
        source={{
          uri: 'https://static.wixstatic.com/media/3eee0b_4b35343d765945a5b8f2e3f9f8589dea~mv2.gif',
        }}
      />
    </View>
  );
};

export default AiSplash;
