import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import {Icon} from '../Image/Icon';
import {color} from '../Image/Color/color';

const AiChat = props => {
  const [isType, setIsType] = useState(false);
  const [btd, setBbtd] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSendButtonPress = () => {
    if (inputText == '') {
      return;
    }
    setIsType(true);
    if (btd == false) {
      setBbtd(true);
    } else {
      setBbtd(false);
    }
    setBbtd(true);
    const message = {
      _id: uuid.v4(),
      text: inputText,
      createdAt: new Date(),
      user: {_id: 1},
    };

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [message]),
    );

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer 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', // Replace this with your actual OpenAI API key
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: inputText,
          },
        ],
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setInputText('');
        const replyMessage = {
          _id: uuid.v4(),
          text: 'Error', // data.choices[0].message.content.trim()
          createdAt: new Date(),
          user: {_id: 2, name: 'ChatGPT'},
        };

        setIsType(false);
        setBbtd(false);

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [replyMessage]),
        );
      })
      .catch(error => {
        console.error('Error:', error);
        setIsType(false);
        setBbtd(false);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: color.white}}>
      <StatusBar backgroundColor={color.black} barStyle={'light-content'} />
      <GiftedChat
        isTyping={isType}
        renderAvatar={null}
        messages={messages}
        onSend={messages =>
          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
          )
        }
        user={{
          _id: 1,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              textStyle={{
                left: styles.leftMsgTxt,
                right: styles.rightMsgTxt,
              }}
              wrapperStyle={{
                right: styles.rightMsg,
                left: styles.leftMsg,
              }}
            />
          );
        }}
        scrollToBottom={true}
        renderInputToolbar={() => {
          return (
            <View style={styles.MsgFooterView}>
              <View style={styles.inputAndPlusBtd}>
                <TextInput





                  value={inputText}
                  onChangeText={text => {
                    setInputText(text);
                  }}
                  placeholderTextColor={color.gray}
                  cursorColor={color.black}
                  style={styles.input}
                  placeholder="Message Type Here"
                />
              </View>
              <TouchableOpacity
                disabled={btd}
                onPress={() => {
                  handleSendButtonPress();
                }}
                style={styles.onSend}>
                <Image source={Icon.send} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default AiChat;
const styles = StyleSheet.create({
  scrollIcon: {height: 20, width: 20},
  leftMsgTxt: {color: color.black, fontWeight: '500', fontSize: 15},
  rightMsgTxt: {color: color.white, fontWeight: '500', fontSize: 15},
  rightMsg: {backgroundColor: '#1e2024', borderRadius: 5},
  leftMsg: {
    borderRadius: 5,
    backgroundColor: '#f0f0f2',
  },
  MsgFooterView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginHorizontal: 5,
  },
  inputAndPlusBtd: {
    backgroundColor: color.white,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusTxt: {
    fontSize: 24,
    color: color.black,
    marginLeft: 12,
    marginRight: 7,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 15,
    fontWeight: '700',
    alignItems: 'flex-start',
    color: color.black,
  },
  onSend: {
    backgroundColor: color.onSendBG,
    height: 46,
    width: 46,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 5,
  },
  sendIcon: {height: 15, width: 15, tintColor: color.white},
});
