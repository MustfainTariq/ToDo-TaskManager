import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Pressable, ActivityIndicator, ToastAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { FIREBASE_DB,FIREBASE_AUTH } from '../../services/config';
import { collection, addDoc, doc } from 'firebase/firestore';

import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AddTask() {
  const navigation = useNavigation();
  const categories = [
    { label: 'Work', value: 'Work' },
    { label: 'Personal', value: 'Personal' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Others', value: 'Others' },
  ];

  const [task, setTask] = useState({
    id: 1,
    title: '',
    description: '',
    isFinished: false,
    dateAdded: new Date(),
    dateFinished: null,
    dueDate: new Date(),
    category: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = FIREBASE_AUTH.currentUser;
  //store task in firestore under task and user collection
  const addTaskToFirestore = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(FIREBASE_DB,`users/${user?.uid}/tasks`), task);
      console.log("Document written with ID: ", docRef.id);
      ToastAndroid.show('Task added successfully', ToastAndroid.SHORT);
      navigation.navigate('Home');
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || task.dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setTask({ ...task, dueDate: currentDate });
  };

  const onWebDateChange = (event: { target: { value: string | number | Date; }; }) => {
    const selectedDate = new Date(event.target.value);
    setTask({ ...task, dueDate: selectedDate });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={task.title}
        onChangeText={(text) => setTask({ ...task, title: text })}
      />
      <Dropdown
        style={styles.dropdown}
        data={categories}
        labelField="label"
        valueField="value"
        placeholder="Select Category"
        value={task.category}
        onChange={item => {
          setTask({ ...task, category: item.value });
        }}
      />
      <TextInput
        style={styles.inputDescription}
        placeholder="Description"
        value={task.description}
        onChangeText={(text) => setTask({ ...task, description: text })}
      />
      <View style={styles.datePickerContainer}>
        {Platform.OS === 'web' ? null : (<Text>{task.dueDate.toDateString()}</Text>)}
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={task.dueDate.toISOString().split('T')[0]}
            onChange={onWebDateChange}
            style={styles.webDatePicker}
          />
        ) : (
          <Pressable style={styles.button} onPress={() => setShowDatePicker(true)}>
            <AntDesign name="calendar" size={28} color="#583491" />
          </Pressable>
        )}
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={task.dueDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <Pressable style={styles.button1} onPress={addTaskToFirestore}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText1}>Add Task</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#583491',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    opacity: 0.7,
  },
  inputDescription: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top',
  },
  datePickerContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
  },
  button1: {
    backgroundColor: "#583491",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: 'auto',
  },
  buttonText1: {
    color: 'white',
    textAlign: 'center',
  },
  webDatePicker: {
    height: 40,
    borderColor: 'black',
    color: '#583491',
    width: 'auto',
  },
});
