import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PreparationChecklist } from '../model/duel-preparation-checker';


const DuelPreparation = ({ leftChecklist, rightChecklist }: { leftChecklist: PreparationChecklist | null, rightChecklist: PreparationChecklist | null }) => {

    return (
        <View style={styles.container}>
            <PoseChecklist side="left" checklist={leftChecklist} />
            <PoseChecklist side="right" checklist={rightChecklist} />
        </View>
    );
};



const PoseChecklist = ({ side, checklist }: any) => (
    <View style={[styles.poseChecklistContainer, { backgroundColor: side === 'left' ? "rgba(199, 0, 57  , 0.35)" : "rgba(57, 0, 199, 0.35)" }]}>
        <View style={[styles.containerMerge, { flexDirection: "column" }]}>

            <Text style={[styles.readableTextOnColoredBackground]}>
                Attack {checklist?.attack ? 'X' : ''}
            </Text>
            <Text style={[styles.readableTextOnColoredBackground]}>
                Defense {checklist?.defense ? 'X' : ''}
            </Text>
            <Text style={[styles.readableTextOnColoredBackground]}>
                Perk {checklist?.perk ? 'X' : ''}
            </Text>
        </View>
    </View >
);

const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: width,
        height: height,
        flex: 1,
        flexDirection: 'row',
    },
    poseChecklistContainer: {
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

    containerMerge: {
        alignItems: 'center',
        top: '20%',
    },

});

export default DuelPreparation;
