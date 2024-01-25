import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {Icon} from '../Image/Icon';
import {color} from '../Image/Color/color';

const Group = props => {
  const [groupname, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const myid = props?.route?.params?.myid;
  console.log(myid);

  const createGroup = async () => {
    try {
      // Create the group
      const groupRef = await firestore().collection('Group').add({
        name: groupname,
        description: description,
        members: [], // Initialize an empty array for members
      });

      console.log('Group added with ID: ', groupRef.id);

      // Add the creator as the first member (you can adjust this based on your authentication logic)
      await firestore()
        .collection('Group')
        .doc(groupRef.id)
        .update({
          members: firestore.FieldValue.arrayUnion({
            userId: myid, // Replace with the actual user ID of the creator
            // You can add more user details as needed
          }),
        });
    } catch (error) {
      console.error('Error adding group: ', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: color.black,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
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
            fontSize: 18,
            fontWeight: '500',
          }}>
          Create New Group
        </Text>
      </View>
      <TextInput
        placeholder="Enter Group Name"
        value={groupname}
        onChangeText={txt => setGroupName(txt)}
        cursorColor={color.black}
        style={{
          borderRadius: 20,
          borderWidth: 1,
          borderColor: color.black,
          marginHorizontal: 20,
          marginTop: 20,
          paddingLeft: 10,
          fontWeight: '600',
          color: color.black,
        }}
      />
      <TextInput
        placeholder="Enter Group Description"
        value={description}
        onChangeText={txt => setDescription(txt)}
        cursorColor={color.black}
        style={{
          borderRadius: 20,
          borderWidth: 1,
          borderColor: color.black,
          marginHorizontal: 20,
          marginTop: 20,
          paddingLeft: 10,
          marginBottom: 20,
          fontWeight: '600',
          color: color.black,
        }}
      />
      <TouchableOpacity
        onPress={createGroup}
        style={{
          backgroundColor: color.black,
          alignSelf: 'center',
          padding: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
        }}>
        <Text style={{color: color.white}}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Group;
