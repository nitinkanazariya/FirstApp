import {LogBox, View} from 'react-native';
import React from 'react';
import StackScreen from './src/navigation/stack/stack';
import Store from './src/Redux/Store';
import {Provider} from 'react-redux';
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Provider store={Store}>
        <StackScreen />
      </Provider>
    </View>
  );
};
export default App;

// import {Image, View} from 'react-native';
// import {SvgXml} from 'react-native-svg';
// import React from 'react';
// import {elips} from './src/assets/elips';

// // const svgContent = `
// // <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
// // <circle id="Ellipse 17" cx="38" cy="38.3795" r="37.5" fill="#01D6C9"/>
// // </svg>

// // `;

// const App = () => {
//   return (
//     <View style={{flex: 1}}>
//       <Image
//         source={require('./src/assets/17.png')}
//         style={{height: 20, width: 20}}
//       />
//     </View>
//   );
// };

// export default App;
