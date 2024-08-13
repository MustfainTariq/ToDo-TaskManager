import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, Pressable, Text, Dimensions, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../services/config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Login({ navigation }: { navigation: NavigationProp<any> }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
            if (user) {
                navigation.navigate('TabNavigator');
            }
        });

        return () => unsubscribe();
    }, [navigation]);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        } catch (error) {
            Alert.alert('Login Error', (error as Error).message);
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
            <View style={styles.bottomContainer}>
                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
            </View>
            <View style={styles.bottomContainer1}>
                <Pressable onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.buttonText1}>Create Account?</Text>
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
        marginBottom: 20,
    }
});
