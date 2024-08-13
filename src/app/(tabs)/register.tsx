import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, Pressable, Text, Dimensions, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../services/config';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Register({ navigation }: { navigation: NavigationProp<any> }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
            if (user) {
                navigation.navigate('Home');
            }
        });

        return () => unsubscribe();
    }, [navigation]);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            alert('Passwords do not match');
            return;
        }
        try {
            await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Registration Error', (error as Error).message);
            alert('Registration Error' + (error as Error).message);

            console.error(error);
        }
    };

    return (
        <View style={styles.background}>
            <Image
                source={require('../../../assets/images/logo.png')}
                style={styles.image}
            />
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
            />
            <View style={styles.bottomContainer}>
                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
            </View>
            <View style={styles.bottomContainer1}>
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText1}>Already have an account? Login</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        width: screenWidth,
        height: screenHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        width: 300,
        borderRadius: 10,
        padding: 10,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 150,
        width: 300,
        alignItems: 'center',
    },
    bottomContainer1: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 100,
    },
    button: {
        backgroundColor: "#583491",
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        width: 300,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    buttonText1: {
        color: "#583491",
        textAlign: 'center',
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        position: 'absolute',
        top: 50,
    }
});
