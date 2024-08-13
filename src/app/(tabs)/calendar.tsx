// Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../services/config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { collection, getDocs, DocumentData } from "firebase/firestore";

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<DocumentData[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [tasksByDate, setTasksByDate] = useState<DocumentData[]>([]);
  const user = FIREBASE_AUTH.currentUser;

  useFocusEffect(
    React.useCallback(() => {
      const fetchTasks = async () => {
        try {
          const querySnapshot = await getDocs(collection(FIREBASE_DB, `users/${user?.uid}/tasks`));
          const tasksData: DocumentData[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            tasksData.push({
              id: doc.id,
              title: data.title || 'Untitled Task',
              description: data.description || 'No Description',
              category: data.category || 'Uncategorized',
              isFinished: data.isFinished || false,
              dueDate: data.dueDate ? data.dueDate.toDate() : new Date(),
            });
          });
          setTasks(tasksData);
        } catch (error) {
          console.error('Error fetching tasks: ', error);
        }
      };

      fetchTasks();
    }, [user])
  );

  useEffect(() => {
    if (selectedDate) {
      const tasksForDate = tasks.filter(task => {
        const taskDate = task.dueDate.toISOString().split('T')[0];
        return taskDate === selectedDate;
      });
      setTasksByDate(tasksForDate);
    }
  }, [selectedDate, tasks]);

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout Error: ', error);
      alert('Logout Error');
    }
  };

  const handleTaskPress = (task: DocumentData) => {
    navigation.navigate("Task", {
      id: task.id,
      title: task.title,
      description: task.description,
      category: task.category,
      isFinished: task.isFinished,
      dueDate: task.dueDate.toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="logout" size={24} color="black" style={styles.logout} onPress={handleLogout} />
      
      <Calendar
        onDayPress={(day: { dateString: React.SetStateAction<string>; }) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#583491' },
        }}
        theme={{
          selectedDayBackgroundColor: '#583491',
          todayTextColor: '#583491',
          arrowColor: '#583491',
        }}
      />

      <View style={styles.taskContainer}>
        <Text style={styles.taskHeader}>Tasks for {selectedDate}</Text>
        {tasksByDate.length > 0 ? (
          tasksByDate.map(task => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.task} 
              onPress={() => handleTaskPress(task)}
            >
              <Text style={[
                styles.taskTitle,
                task.isFinished && styles.taskTitleCompleted
              ]}>
                {task.title}
              </Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noTasksText}>No tasks for this date</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logout: {
  alignSelf: 'flex-end',
  marginRight: 20,
  marginBottom: 20,
  top: 10,
  },
  taskContainer: {
    padding: 20,
  },
  taskHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#583491',
  },
  task: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#583491',
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#583491',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#333',
  },
  noTasksText: {
    fontSize: 16,
    color: '#999',
  },
});
