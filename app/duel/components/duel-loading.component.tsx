import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ImageBackground } from 'react-native';

const DuelLoadingComponent = () => {
    return (
        <ImageBackground
            source={require('../../../assets/game_instruction.png')}
            style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={[styles.bottomText]}>Loading</Text>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
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

export default DuelLoadingComponent;
