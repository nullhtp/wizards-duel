import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { observer } from 'mobx-react';

const DuelHeader = observer(({ duelStore, onTimerEnd }: any) => {
    const { leftHealth, leftMana, rightHealth, rightMana } = duelStore;
    const [currentTimer, setCurrentTimer] = useState(70);

    useEffect(() => {
        const subscription = setInterval(() => {
            const newTimer = currentTimer - 1;
            if (newTimer >= 0) {
                setCurrentTimer(newTimer);

            } else {
                onTimerEnd();
            }
        }, 1000)

        return () => clearInterval(subscription);
    }, [currentTimer]);

    return (
        <View style={styles.container}>
            <View style={styles.timerContainer}>
                <Text style={styles.readableTextOnColoredBackground}>{currentTimer}</Text>
            </View>
            <WizardStatus side="left" health={leftHealth} mana={leftMana} />
            <WizardStatus side="right" health={rightHealth} mana={rightMana} />
        </View>
    );
});

const WizardStatus = ({ side, health, mana }: any) => (
    <View style={[styles.wizardStatus, { backgroundColor: side === 'left' ? "rgba(199, 0, 57  , 0.35)" : "rgba(57, 0, 199, 0.35)" }]}>
        <View style={[styles.containerMerge, { flexDirection: side === "left" ? "row" : "row-reverse" }]}>

            <Text style={[styles.readableTextOnColoredBackground]}>
                {health}
            </Text>
        </View>
        <View style={[styles.containerMana, { right: side === "right" ? 0 : null }]}>

            <Text style={[styles.readableTextOnColoredBackground]}>
                {mana}
            </Text>
        </View>
    </View >
);

const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
    timerContainer: {
        position: 'absolute',
        top: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        zIndex: 100,
    },
    container: {
        position: 'relative',
        width: width,
        height: height,
        flex: 1,
        flexDirection: 'row'
    },
    wizardStatus: {
        position: 'relative',
        width: width / 2,
        height: height,
    },
    readableTextOnColoredBackground: {
        fontSize: 32,          // Appropriate font size for readability
        fontWeight: 'bold',    // Bold text for better visibility
        color: 'white',        // White color for high contrast
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Black shadow for depth
        textShadowOffset: { width: 1, height: 1 }, // Shadow offset
        textShadowRadius: 4,   // Soft shadow for better legibility
        paddingHorizontal: 40
    },

    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // Align items to the start
        marginVertical: 2,
    },
    statsMerge: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
    },

    containerMerge: {
        alignItems: 'center',
    },

    containerMana: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
    }

});

export default DuelHeader;
