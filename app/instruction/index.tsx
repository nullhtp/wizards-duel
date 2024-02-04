import React from 'react';
import { router } from "expo-router";
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';

export default () => {
    return (
        <>
            <View style={styles.backButtonContainer}>
                <Button title="Back" onPress={() => router.replace('/')} />
            </View>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Wizard Duel Game Guide</Text>

                <View style={styles.section}>
                    <Text style={styles.text}>
                        In this wizard duel game, players stand over 3 meters away from their device's camera to ensure full visibility. The game uses the camera to track players' movements and recognize specific poses used to cast spells. Players must manage their health and magic points effectively to outwit and defeat their opponent.
                    </Text>
                </View>

                <Text style={styles.heading}>Getting Started</Text>
                <View style={styles.section}>
                    <Text style={styles.text}>1. Positioning: Stand at least 3 meters away from the camera with your body facing towards it. Ensure you're positioned so that your body is visible on only half of the screen to allow for accurate gesture recognition.</Text>
                    <Text style={styles.text}>2. Gameplay Poses: You'll perform three distinct poses to cast spells during the game:</Text>
                    <View style={styles.list}>
                        <Text style={styles.text}>- Attack Pose: Extend one arm straight out, pointing towards the camera to signify targeting your enemy.</Text>
                        <Text style={styles.text}>- Defence Pose: Cross your arms over your chest to activate a defensive shield.</Text>
                        <Text style={styles.text}>- Perk Pose: Raise one arm above your head, pointing towards the sky to invoke a beneficial perk.</Text>
                    </View>
                </View>

                <Text style={styles.heading}>Game Mechanics</Text>
                <View style={styles.section}>
                    <Text style={styles.text}>
                        - Each player starts with 100 health points (HP) and 100 magic points (MP).
                    </Text>
                    <Text style={styles.text}>
                        - Casting spells decreases your MP but can affect HP depending on the spell used:
                    </Text>
                    <View style={styles.list}>
                        <Text style={styles.text}>- Attack Spell: Costs 10 MP, deals 10-15 HP damage to the opponent.</Text>
                        <Text style={styles.text}>- Defence Spell: Costs 5 MP, reduces incoming damage by 10-15 HP.</Text>
                        <Text style={styles.text}>- Perk Spell: Costs 15 MP, heals the caster for 10-15 HP.</Text>
                    </View>
                    <Text style={styles.text}>
                        - Magic Point Recovery: Your MP recovers at a rate of 1 point per second, so timing and strategy are crucial for victory.
                    </Text>
                </View>

                <Text style={styles.heading}>Winning the Game</Text>
                <View style={styles.section}>
                    <Text style={styles.text}>
                        The objective is to deplete your opponent's health points through strategic use of attack, defence, and perk spells. The winner is the wizard who successfully reduces the enemy's HP to 0, while managing their own health and magic points effectively.
                    </Text>
                </View>

                <Text style={styles.heading}>Tips for Success</Text>
                <View style={styles.section}>
                    <Text style={styles.text}>
                        Balance your spells, manage your MP wisely, and adapt your strategy to your opponent's actions. Practice makes perfect. Experiment with different strategies to find what works best for you, and have fun!
                    </Text>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 30,
        backgroundColor: '#a3cef1', // Pastel blue background color
    },
    backButtonContainer: {
        backgroundColor: '#a3cef1', // Pastel blue background color
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    section: {
        marginBottom: 10,
    },
    list: {
        marginLeft: 20, // This adds indentation to list items
    },
});

