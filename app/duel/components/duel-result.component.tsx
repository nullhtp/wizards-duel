import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wizard } from '../../models/wizard';
import { ImageBackground } from 'react-native';

const DuelResultComponent = ({ win, onClose }: { win: Wizard | null, onClose: () => void }) => {

    return (
        <TouchableOpacity style={{ width: '100%' }} onPress={onClose}>
            <ImageBackground
                source={require('../../../assets/duel_final.png')}
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={[styles.centerText]}>
                    {win ? `${win.color} wizard win` : 'Draw'}
                </Text>

                <Text style={[styles.bottomText]}>
                    Tap to continue
                </Text>
            </ImageBackground>
        </TouchableOpacity>
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

export default DuelResultComponent;
