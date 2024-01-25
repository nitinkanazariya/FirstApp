import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  LogBox,
  Modal,
  ActivityIndicator,
  PermissionsAndroid,
  FlatList,
  BackHandler,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import Contacts from 'react-native-contacts';

import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ChatMediaModal} from '../custom/ChatMediaModal';
import {Icon} from '../Image/Icon';
import Contact from '../ChatBubble/contact';
import TextMessage from '../ChatBubble/Text';
import ChatImage from '../ChatBubble/Image';
import RNFetchBlob from 'rn-fetch-blob';
import ImageViewModal from '../custom/ImageViewModal';
import {color} from '../Image/Color/color';
import {useSelector} from 'react-redux';

LogBox.ignoreAllLogs();
const ChatScreen = props => {
  const [visible, setVisible] = useState(false);
  const [loding, setLoding] = useState(false);
  const [media, setMedia] = useState(false);
  const [inputvisible, setInputVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [hide, setHide] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [inputText, setInputText] = useState('');
  const [contact, setContact] = useState(null);
  const [imageDownload, setImageDownload] = useState('');
  const [img, setImg] = useState(''); //choose image
  const [vid, setVid] = useState(''); //choose video
  const [image, setImage] = useState(''); //firebase image url
  const userData = props?.route?.params?.data;
  const myId = props?.route?.params?.myid;
  const THEME = useSelector(state => state.theme.data);
  const Dark = THEME == 'DARK';
  const closeModal = () => {
    setMedia(false);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      closeModal,
    );

    return () => backHandler.remove();
  }, [media]);

  const renderScrollButton = () => (
    <View style={{backgroundColor: color.white, padding: 10, borderRadius: 50}}>
      <Image source={Icon.scroll} style={styles.scrollIcon} />
    </View>
  );
  useEffect(() => {
    const UserMsg = firestore()
      .collection('chat')
      .doc(myId + userData.id)
      .collection('Message')
      .orderBy('createdAt', 'desc');

    UserMsg.onSnapshot(res => {
      const allmsg = res.docs.map(item => {
        return {
          ...item._data,
          createdAt: item._data.createdAt,
          image: item._data.image,
          contact: item._data.contact,
        };
      });
      setMessages(allmsg);
    });
    return () => UserMsg;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const pickImage = async () => {
    const result = await launchImageLibrary();
    if (result?.assets[0]?.uri) {
      setImg(result.assets[0]?.uri);
      setVisible(true);
    }
    setMedia(false);
  };
  const CapturePhoto = async () => {
    const result = await launchCamera();
    if (result?.assets[0]?.uri) {
      setImg(result.assets[0]?.uri);
      setVisible(true);
    }
    setMedia(false);
  };
  const PickVideo = async () => {
    const options = {
      mediaType: 'video',
    };

    await launchImageLibrary(options, response => {
      let videourl = response.uri || response.assets?.[0]?.uri;
      setVid(videourl);
    });
  };
  const CaptureVideo = async () => {
    const options = {
      mediaType: 'video',
    };

    await launchCamera(options, response => {
      let videourl = response.uri || response.assets?.[0]?.uri;
      setVid(videourl);
    });
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const handleSendButtonPress = () => {
    if (inputText === '' && img == '' && contact == null) {
      return;
    }

    const allmsg = {
      _id: uuid.v4(),
      text: inputText,
      sendBy: myId,
      sendTo: userData.id,
      createdAt: Date.parse(new Date()),
      image: image,
      contact:
        contact == null ? '' : {name: contact.name, number: contact.number},
      chackbox: false,

      user: {
        _id: myId,
      },
    };

    firestore()
      .collection('chat')
      .doc(myId + userData.id)
      .collection('Message')
      .add(allmsg);
    firestore()
      .collection('chat')
      .doc(userData.id + myId)
      .collection('Message')
      .add(allmsg);
    onSend([allmsg]);
    setInputText('');
    setImg('');
    setImage('');
    setContact(null);
  };
  const upload = async () => {
    const imageName = uuid.v4();
    const result = Object.values(imageName).join('');
    const reference = storage().ref(result);
    const filePath = img;
    await reference.putFile(filePath);
    const url = await storage().ref(result).getDownloadURL();
    setImage(url);
    setVisible(false);
    setLoding(false);
  };
  useEffect(() => {
    setTimeout(() => {
      DownloadImageWithUrl();
    }, 1000);
  }, [imageDownload]);
  const downloadImage = () => {
    let image_URL = imageDownload;

    const {config, fs} = RNFetchBlob.fs.st;
    const dirs = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${dirs}/image${new Date().getSeconds()}.jpg`,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        console.log(res);
        Alert.alert('Image Downloaded Successfully.');
        setImageDownload('');
      });
  };
  const DownloadImageWithUrl = async () => {
    if (imageDownload !== '') {
      downloadImage();
    } else {
      null;
    }
  };
  //   var newPerson = {
  //   emailAddresses: [{
  //     label: "work",
  //     email: "mrniet@example.com",
  //   }],
  //   familyName: "Nietzsche",
  //   givenName: "Friedrich",
  // }

  // Contacts.addContact(newPerson)
  const renderMessage = props => {
    const {currentMessage} = props;
    const myChat = currentMessage?.sendTo == myId;
    let Mycontact = currentMessage?.contact;
    const dateString = currentMessage.createdAt;
    const dateObject = new Date(dateString);

    const h = dateObject.getHours();
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    const amOrPm = h >= 12 ? 'PM' : 'AM';
    const hours = h % 12 || 12;
    return (
      <View style={{marginBottom: 4, marginTop: 4}}>
        {currentMessage?.image == '' ? null : (
          <ChatImage
            marginRight={myChat ? '25%' : 5}
            marginLeft={myChat ? 5 : '25%'}
            uri={currentMessage?.image}
            alignSelf={myChat ? 'flex-start' : 'flex-end'}
            backgroundColor={
              myChat ? color.white : Dark ? color.lightblack : color.black
            }
            color={myChat ? color.gray : color.lightgray}
            timeColor={myChat ? color.gray : color.lightgray}
            time={hours + ':' + minutes + ' ' + amOrPm}
            icon={myChat ? Icon.download : null}
            onDownload={() => {
              setImageDownload(props.currentMessage.image);
              setHide(true);
            }}
            onImage={() => {
              setViewImage(true);
              setImageDownload(props.currentMessage.image);
            }}
          />
        )}
        {currentMessage.text == '' ? null : (
          <TextMessage
            backgroundColor={
              myChat ? color.white : Dark ? color.lightblack : color.black
            }
            color={myChat ? color.black : color.white}
            alignSelf={myChat ? 'flex-start' : 'flex-end'}
            marginRight={myChat ? '25%' : 5}
            marginLeft={myChat ? 5 : '25%'}
            Message={currentMessage?.text}
            timeColor={myChat ? color.gray : color.lightgray}
            time={hours + ':' + minutes + ' ' + amOrPm}
          />
        )}
        {currentMessage?.contact == '' ? null : (
          <Contact
            alignSelf={myChat ? 'flex-start' : 'flex-end'}
            backgroundColor={
              myChat ? color.white : Dark ? color.lightblack : color.black
            }
            numbercolor={myChat ? color.gray : color.lightgray}
            namecolor={myChat ? color.black : color.white}
            timeColor={myChat ? color.gray : color.lightgray}
            time={hours + ':' + minutes + ' ' + amOrPm}
            name={
              Mycontact?.name?.length > 18
                ? Mycontact?.name.slice(0, 18) + '...'
                : Mycontact?.name
            }
            number={Mycontact?.number}
            marginLeft={myChat ? 5 : '25%'}
            marginRight={myChat ? '25%' : 5}
            onContact={() => {
              var newPerson = {
                thumbnailPath: Mycontact.image,
                phoneNumbers: [
                  {
                    label: 'phone',
                    number: Mycontact.number,
                  },
                ],
                displayName: Mycontact.name,
              };

              Contacts.openContactForm(newPerson).then(contact => {
                // contact has been saved
              });
            }}
          />
        )}
      </View>
    );
  };
  useEffect(() => {
    requestContectPermission();
  }, []);

  const requestContectPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getContactData();
      } else {
        console.log('Contect permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getContactData = () => {
    Contacts.getAll()
      .then(item => {
        setContactData(item);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const list = ({item, index}) => {
    let number = item?.phoneNumbers[0]?.number;
    let name = item?.displayName;
    let image = item?.thumbnailPath;
    return (
      <TouchableOpacity
        onPress={() => {
          setInputVisible(false);
          setContactVisible(false);
          setContact({name, number, image});
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Dark ? color.lightgray : color.contactListBg,
          marginTop: 10,
          padding: 10,
          marginHorizontal: 10,
          borderRadius: 20,
        }}>
        <Image
          source={{
            uri: image
              ? image
              : 'https://www.iimrohtak.ac.in/panel/assets/images/advisory-body/16881262508687Prof.%20S%20Sivakumar.jpeg',
          }}
          style={{height: 45, width: 45, borderRadius: 50, marginRight: 15}}
        />
        <View>
          <Text style={{color: color.black, fontWeight: '700', fontSize: 15}}>
            {name}
          </Text>
          <Text style={{color: color.gray, fontWeight: '700', fontSize: 13}}>
            {number}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const searchFilterFunction = text => {
    const filteredData = contactData.filter(item =>
      item.displayName.toLowerCase().includes(text.toLowerCase()),
    );

    setSearchData(filteredData);
    setSearchInput(text);
  };

  return (
    <View style={{flex: 1, backgroundColor: Dark ? color.black : color.chatBg}}>
      <StatusBar backgroundColor={Dark ? color.lightblack : color.black} />
      {!contactVisible ? (
        <View style={{flex: 1}}>
          <View
            style={{
              backgroundColor: Dark ? color.lightblack : color.black,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomRightRadius: 50,
            }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image
                source={Icon.back}
                style={{height: 20, width: 20, tintColor: color.white}}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: color.white,
                marginLeft: 20,
                fontSize: 16,
                fontWeight: '500',
              }}>
              {userData.name}
            </Text>
          </View>
          <GiftedChat
            imageStyle={{height: 150, width: 200}}
            renderMessage={props => renderMessage(props)}
            renderAvatar={null}
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: myId,
            }}
            // renderBubble={props => {
            //   return (
            //     <View style={{flex: 1}}>
            //       <Bubble
            //         // onLongPress={() => {
            //         //   const id = {...props.currentMessage._id};
            //         //   const result = Object.values(id).join('');

            //         //   return console.log(result);
            //         // }}
            //         {...props}
            //         textStyle={{
            //           left: styles.leftMsgTxt,
            //           right: styles.rightMsgTxt,
            //         }}
            //         wrapperStyle={{
            //           right: styles.rightMsg,
            //           left: styles.leftMsg,
            //         }}
            //       />
            //     </View>
            //   );
            // }}
            scrollToBottom={true}
            scrollToBottomComponent={renderScrollButton}
            renderInputToolbar={() => {
              return (
                <View style={styles.MsgFooterView}>
                  <View style={styles.inputAndPlusBtd}>
                    <TouchableOpacity onPress={() => setMedia(true)}>
                      <Text style={styles.plusTxt}>+</Text>
                    </TouchableOpacity>
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
                    onPress={handleSendButtonPress}
                    style={styles.onSend}>
                    <Image source={Icon.send} style={styles.sendIcon} />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={() => setInputVisible(false)}>
          <View
            style={{
              backgroundColor: Dark ? color.black : color.white,
              flex: 1,
            }}>
            {!inputvisible ? (
              <View
                style={{
                  backgroundColor: Dark ? color.lightblack : color.black,
                  padding: 20,
                  height: 80,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottomRightRadius: 50,
                }}>
                <TouchableOpacity onPress={() => setContactVisible(false)}>
                  <Image
                    source={Icon.back}
                    style={{height: 20, width: 20, tintColor: color.white}}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: color.white,

                    fontSize: 20,
                    fontWeight: '700',
                  }}>
                  Contact
                </Text>
                <TouchableOpacity onPress={() => setInputVisible(true)}>
                  <Image
                    source={Icon.search}
                    style={{height: 20, width: 20, tintColor: color.white}}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: Dark ? color.lightblack : color.black,
                  padding: 10,
                  height: 80,

                  borderBottomRightRadius: 50,
                }}>
                <View
                  style={{
                    backgroundColor: color.white,
                    flexDirection: 'row',
                    borderRadius: 20,
                    height: 45,
                    width: '90%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    marginTop: 8,
                  }}>
                  <TextInput
                    value={searchInput}
                    onChangeText={searchFilterFunction}
                    autoFocus
                    onEndEditing={() => setInputVisible(false)}
                    placeholder="Search"
                    cursorColor={color.black}
                    style={{
                      backgroundColor: color.white,
                      height: 45,
                      borderRadius: 20,
                      fontSize: 15,
                      flex: 1,
                      color: color.black,
                      fontWeight: '700',
                    }}
                  />
                  <TouchableOpacity onPress={() => setInputVisible(false)}>
                    <Image
                      source={Icon.search}
                      style={{height: 20, width: 20, tintColor: color.black}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <FlatList
              data={searchInput == '' ? contactData : searchData}
              renderItem={list}
            />
            {/* <Contact name={contact?.name} number={contact?.number} /> */}
          </View>
        </TouchableWithoutFeedback>
      )}
      <Modal visible={visible} transparent={true}>
        <View style={{flex: 1}}>
          <Image source={{uri: img}} style={{flex: 1}} />
          {loding == true ? (
            <View
              style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <ActivityIndicator
                color={color.black}
                size={30}
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  top: '45%',
                  padding: 40,
                  backgroundColor: color.white,
                  borderRadius: 20,
                }}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                bottom: 50,
                left: 0,
                right: 0,
                marginHorizontal: '15%',
              }}>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{
                  height: 50,
                  width: 50,

                  backgroundColor: color.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 50,
                }}>
                <Image source={Icon.cancel} style={{height: 25, width: 25}} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  upload(), setLoding(true);
                }}
                style={{
                  height: 50,
                  width: 50,

                  backgroundColor: color.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 50,
                }}>
                <Image source={Icon.true} style={{height: 25, width: 25}} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
      {image == '' ? (
        ''
      ) : (
        <View
          style={{
            height: 200,
            width: 250,
            position: 'absolute',
            bottom: 52,
            right: 5,
          }}>
          <Image
            source={{uri: image}}
            style={{
              flex: 1,
              borderRadius: 10,
            }}
          />
          <TouchableOpacity
            onPress={() => setImage('')}
            style={{
              position: 'absolute',
              right: 3,
              top: 3,
              padding: 5,
              backgroundColor: color.white,
              borderRadius: 5,
            }}>
            <Image
              source={Icon.cancel}
              style={{
                height: 15,
                width: 15,
                tintColor: color.black,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      <ChatMediaModal
        visible={media}
        onPhoto={pickImage}
        onClose={() => setMedia(false)}
        onCamera={() => {
          CapturePhoto();
          requestCameraPermission();
        }}
        onVideo={() => {
          PickVideo();
        }}
        onCaptureVideo={() => {
          CaptureVideo();
          requestCameraPermission();
        }}
        onContact={() => {
          setContactVisible(true);
          setMedia(false);
        }}
      />
      <ImageViewModal
        visible={viewImage}
        uri={imageDownload}
        closeModal={() => setViewImage(false)}
      />
    </View>
  );
};
export default ChatScreen;
const styles = StyleSheet.create({
  scrollIcon: {height: 20, width: 20},
  leftMsgTxt: {color: color.black, fontWeight: '500', fontSize: 15},
  rightMsgTxt: {color: color.white, fontWeight: '500', fontSize: 15},
  rightMsg: {backgroundColor: color.black, borderRadius: 10},
  leftMsg: {
    borderRadius: 10,
    backgroundColor: color.white,
  },
  MsgFooterView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
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
