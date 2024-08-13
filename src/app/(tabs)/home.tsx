import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions, TouchableOpacity, ActivityIndicator, Image, ToastAndroid } from 'react-native';
import { MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../services/config';
import { collection, getDocs, DocumentData, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { SwipeListView } from 'react-native-swipe-list-view';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<DocumentData[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const user = FIREBASE_AUTH.currentUser;
  const categories = ['All', 'Work', 'Personal', 'Shopping', 'Others']; // Define categories

  useFocusEffect(
    React.useCallback(() => {
      const getTasks = async () => {
        try {
          const querySnapshot = await getDocs(collection(FIREBASE_DB, `users/${user?.uid}/tasks`));
          const tasksData: DocumentData[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            tasksData.push({
              id: doc.id,  // Use Firebase's unique ID
              title: data.title || 'Untitled Task',
              description: data.description || 'No Description',
              category: data.category || 'Uncategorized',
              isFinished: data.isFinished || false,
              dateAdded: data.dateAdded ? data.dateAdded.toDate() : new Date(),  // Convert Firestore Timestamp to Date
              dueDate: data.dueDate ? data.dueDate.toDate() : new Date(),  // Convert Firestore Timestamp to Date
              dateFinished: data.dateFinished ? data.dateFinished.toDate() : null,
            });
          });
          setTasks(tasksData);
          setFilteredTasks(tasksData); // Initially show all tasks
        } catch (error) {
          console.error('Error fetching tasks: ', error);
        } finally {
          setIsLoading(false); // Stop loading once data is fetched
        }
      };

      getTasks();

      return () => { };
    }, [user])
  );

  const markAsComplete = async (taskId: string) => {
    try {
      // Find the task to be updated and toggle its completion status
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
  
      const newIsFinishedStatus = !taskToUpdate.isFinished;
  
      // Optimistically update the UI
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, isFinished: newIsFinishedStatus } : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks.filter(task => selectedCategory === 'All' || task.category === selectedCategory));
  
      // Update Firestore with the new status
      const taskRef = doc(FIREBASE_DB, `users/${user?.uid}/tasks/${taskId}`);
      await updateDoc(taskRef, {
        isFinished: newIsFinishedStatus,
      });
  
      console.log(`Marked task ${taskId} as complete`);
    } catch (error) {
      console.error('Error marking task as complete: ', error);
      alert('Failed to update task. Please try again.');
    }
  };
  

  

  const deleteTask = async (taskId: string) => {
    try {
      
      // Update the local state to reflect the deletion
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setFilteredTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      // Remove the task from Firestore
      const taskRef = doc(FIREBASE_DB, `users/${user?.uid}/tasks/${taskId}`);
      await deleteDoc(taskRef);

      

      console.log(`Deleted task ${taskId}`);
    } catch (error) {
      console.error('Error deleting task: ', error);
      alert('Failed to delete task. Please try again');
    }
  };

  const filterTasksByCategory = (category: string) => {
    if (category === 'All') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.category === category));
    }
  };

  const changeCategory = (category: string) => {
    setSelectedCategory(category);
    filterTasksByCategory(category);
    console.log('Category changed to:', category);
  }

  const today = new Date().setHours(0, 0, 0, 0);
  const todayTasks = filteredTasks.filter(task => new Date(task.dueDate).setHours(0, 0, 0, 0) === today);
  const futureTasks = filteredTasks.filter(task => new Date(task.dueDate).setHours(0, 0, 0, 0) > today);
  const prevTasks = filteredTasks.filter(task => new Date(task.dueDate).setHours(0, 0, 0, 0) < today);
  const isEmpty = todayTasks.length === 0 && futureTasks.length === 0;

  if (isLoading) {
    return (
      <View style={[styles.background, styles.centered]}>
        <ActivityIndicator size="large" color="#583491" />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.background}>
        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} onPress={() => changeCategory(category)}>
              <Text style={styles.categoryButton}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View> 
        <Text style={{ fontSize: 20, color: '#583491', marginTop: 50 }}>No tasks found</Text>
      </View> 
    );
  }

  const combinedData = [
    { id: 'header-today', title: "Due Today", isHeader: true },
    ...todayTasks,
    { id: 'header-future', title: 'Future Tasks', isHeader: true },
    ...futureTasks
  ];

  const renderItem = ({ item }) => {
    if (item.isHeader) {
      return <Text style={styles.header}>{item.title}</Text>;
    }

    return (
      <Pressable
        onPress={() => navigation.navigate("Task", {
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          isFinished: item.isFinished,
          dateAdded: item.dateAdded.toISOString(),  // Convert to string
          dateFinished: item.dateFinished ? item.dateFinished.toISOString() : null,
          dueDate: item.dueDate.toISOString(),  // Convert to string
        })}
        style={styles.task}
      >
        <Text style={[
          styles.title,
          item.isFinished && styles.titleCompleted
        ]}>
          {item.title}
        </Text>
        <MaterialIcons
          name={item.isFinished ? "task-alt" : "radio-button-unchecked"}
          onPress={() => markAsComplete(item.id)}
          size={24}
          color="black"
          style={[
            styles.check,
            { opacity: item.isFinished ? 0.5 : 1 }
          ]}
        />
      </Pressable>
    );
  };

  const renderHiddenItem = (data: { item: { isHeader: any; id: string; }; }, rowMap: any) => {
    if (data.item.isHeader) {
      return null;
    }
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => deleteTask(data.item.id)}>
          <FontAwesome name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.background}>
      <View style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} onPress={() => changeCategory(category)}>
            <Text style={styles.categoryButton}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SwipeListView
        data={combinedData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        contentContainerStyle={styles.taskcontainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  categoryButton: {
    width: screenWidth / 5 - 20,
    height: 30,
    textAlign: 'center',
    borderRadius: 20,
    textAlignVertical: 'center',
    marginVertical: 5,
    borderWidth: 1.3,
    borderColor: '#583491',
    color: '#583491',
    marginHorizontal: 5, // Added horizontal margin to add space between categories
  },
  title: {
    left: 30,
    bottom: 4,
    fontSize: 16,
    color: '#583491'
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  header: {
    top: -5,
    fontSize: 20,
    opacity: 0.8,
    marginTop: 20,
    width: screenWidth - 60,
    color: '#583491',
  },
  check: {
    position: 'absolute',
    left: 10,
    top: 10,
    color: '#583491',
  },
  background: {
    backgroundColor: 'white',
    width: screenWidth,
    height: screenHeight,
    alignItems: 'center',
    flex: 1, // This ensures the container takes up the full screen height
  },
  task: {
    padding: 15,
    borderWidth: 1.3,
    borderRadius: 20,
    borderColor: '#583491',
    marginVertical: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: screenWidth - 60,
  },
  taskcontainer: {
    alignItems: 'center',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginVertical: 5,
    borderRadius: 20,
    marginBottom: 6,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 20,
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
});
