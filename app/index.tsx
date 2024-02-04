import React from 'react';
import { StyleSheet, Button, View } from 'react-native';
import { ImageBackground } from 'react-native';
import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';

const MenuComponent = () => {

    return (
        <View>
            <StatusBar hidden={true} />
            <ImageBackground
                source={require('../assets/start_screen.jpg')}
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={styles.container}>

                    <View style={styles.buttonsContainer}>
                        <Button onPress={() => router.replace('/duel')} title='Start'></Button>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button onPress={() => router.replace('/instruction')} title='Instruction'></Button>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};


const styles = StyleSheet.create({
    centerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        textAlign: 'center',
        position: 'absolute',
    },

    container: {
        top: 130,
    },

    buttonsContainer: {
        margin: 5,
    },

    bottomText: {
        fontSize: 12,
        fontWeight: '400',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        textAlign: 'center',
        bottom: 20,
        position: 'absolute',
    },

});

export default MenuComponent;
