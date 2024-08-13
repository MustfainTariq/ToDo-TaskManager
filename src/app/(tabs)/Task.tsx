import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { ToastAndroid, ActivityIndicator } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../services/config';
import { Dropdown } from 'react-native-element-dropdown';

export default function TaskScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, title, description, category, isFinished, dateFinished, dueDate } = route.params;
  const user = FIREBASE_AUTH.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const [editableDescription, setEditableDescription] = useState(description);
  const [editableCategory, setEditableCategory] = useState(category);
  const [editableDueDate, setEditableDueDate] = useState(new Date(dueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const dateFinishedDate = dateFinished ? new Date(dateFinished) : null;

  const categories = [
    { label: 'Work', value: 'Work' },
    { label: 'Personal', value: 'Personal' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Others', value: 'Others' },
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Saving changes...');
      const taskRef = doc(FIREBASE_DB, `users/${user?.uid}/tasks/${id}`);

      // Updated task object with editable fields
      const updatedTask = {
        title: editableTitle,
        description: editableDescription,
        category: editableCategory,
        dueDate: Timestamp.fromDate(editableDueDate), // Save date as Firebase Timestamp
      };

      // Update the task document in Firestore
      await updateDoc(taskRef, updatedTask);

      ToastAndroid.show('Task updated successfully', ToastAndroid.SHORT);
      // Back to the Home screen
      navigation.goBack();


    } catch (e) {
      console.error("Error updating document: ", e);
      alert('Failed to update task. Please try again');
    } finally {
      setIsEditing(false);
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || editableDueDate;
    setShowDatePicker(false);
    setEditableDueDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={80} color="#583491" />
        </View>
      ) : (
        <>
          <Pressable onPress={() => navigation.goBack()} style={{ width: 20 }}>
            <Feather name="arrow-left" size={24} color="#583491" />
          </Pressable>
  
          <View style={styles.iconContainer}>
            {isEditing ? (
              <Pressable style={styles.editIcon} onPress={handleSave}>
                <FontAwesome6 name="save" size={24} color="#583491" />
              </Pressable>
            ) : (
              <Pressable style={styles.editIcon} onPress={() => setIsEditing(true)}>
                <FontAwesome6 name="edit" size={24} color="#583491" />
              </Pressable>
            )}
          </View>
  
          <Text style={styles.label}>Task Title:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editableTitle}
              onChangeText={setEditableTitle}
            />
          ) : (
            <Text style={styles.text}>{editableTitle}</Text>
          )}
  
          <Text style={styles.label}>Description:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editableDescription}
              onChangeText={setEditableDescription}
            />
          ) : (
            <Text style={styles.text}>{editableDescription || 'No description provided'}</Text>
          )}
  
          <Text style={styles.label}>Category:</Text>
          {isEditing ? (
            <Dropdown
              style={styles.dropdown}
              data={categories}
              labelField="label"
              valueField="value"
              placeholder="Select Category"
              value={editableCategory} // Correctly bind the editableCategory state
              onChange={item => {
                setEditableCategory(item.value); // Update the state with the selected category
              }}
            />
          ) : (
            <Text style={styles.text}>{editableCategory || 'Uncategorized'}</Text>
          )}
  
          <Text style={styles.label}>Due Date:</Text>
          {isEditing ? (
            <>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.text}>{editableDueDate.toDateString()}</Text>
                <AntDesign name="calendar" size={28} color="#583491" style={styles.calender} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={editableDueDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </>
          ) : (
            <Text style={styles.text}>{editableDueDate.toDateString()}</Text>
          )}
  
          {dateFinishedDate && (
            <>
              <Text style={styles.label}>Date Finished:</Text>
              <Text style={styles.text}>{dateFinishedDate.toDateString()}</Text>
            </>
          )}
          {isEditing && <View style={styles.line} />}
  
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.text}>{isFinished ? 'Completed' : 'Pending'}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // to cover the content
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#583491',
    marginTop: 20, // Lowered text from the top
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  editIcon: {
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  line: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  calender: {
    position: 'absolute',
    bottom: 15,
    left: 150,
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
});
