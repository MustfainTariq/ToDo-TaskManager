# Task Manager App

Welcome to the Task Manager App, a React Native application that helps you manage your daily tasks effectively. This app allows users to create, categorize, and manage tasks with real-time updates, all synced with Firebase Firestore.

## Features

- **Task Management:** Create, edit, delete, and mark tasks as complete or incomplete.
- **Task Categorization:** Organize tasks into predefined categories such as Work, Personal, Shopping, and Others.
- **Real-Time Synchronization:** Data is synced in real-time with Firebase Firestore, ensuring consistent updates across devices.
- **Swipe Actions:** Use intuitive swipe gestures to delete tasks.
- **Optimistic UI Updates:** Experience smooth and immediate UI feedback when updating tasks.

## Technologies Used

- **React Native:** Cross-platform mobile application framework.
- **Firebase Firestore:** Real-time database for storing and synchronizing task data.
- **Firebase Authentication:** Secure user authentication and management.
- **Expo:** Toolset for developing, building, and deploying React Native apps.
- **SwipeListView:** Component for handling swipe gestures on list items.

## Screenshots

![Screenshot 1](https://firebasestorage.googleapis.com/v0/b/tododb-579ba.appspot.com/o/1.jpg?alt=media&token=8b7b8845-0c96-427b-b943-281edb80ffb0)
![Screenshot 2](https://firebasestorage.googleapis.com/v0/b/tododb-579ba.appspot.com/o/5.jpg?alt=media&token=dd5b9837-a599-4ce2-a014-6ad1a7a44441)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/task-manager-app.git
    cd task-manager-app
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add your Firebase configuration to `services/config.js`:
     ```javascript
     export const FIREBASE_CONFIG = {
       apiKey: "your-api-key",
       authDomain: "your-auth-domain",
       projectId: "your-project-id",
       storageBucket: "your-storage-bucket",
       messagingSenderId: "your-messaging-sender-id",
       appId: "your-app-id",
     };
     ```
   - Initialize Firebase in your project.

4. Start the Expo development server:
    ```bash
    expo start
    ```

## Usage

- **Add a Task:** Use the '+' button to create a new task.
- **Categorize Tasks:** Select a category to filter and view tasks under specific categories.
- **Mark as Complete:** Tap on the checkbox icon to mark a task as complete or incomplete.
- **Delete a Task:** Swipe left on a task to reveal the delete option.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or suggestions, feel free to reach out to:

- **Email:** mustfaintariq@gmail.com
- **GitHub:** [Mustfain](https://github.com/MustfainTariq)

---

Thank you for checking out the Task Manager App! We hope it helps you stay organized and productive.
