import { View } from 'react-native';
import React from 'react';
import DuelComponent from './app/duel/components/duel.component'; // Import the new component
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native';
import MenuComponent from './app/menu/menu.component';

// Create the stack navigator
// const Stack = createNativeStackNavigator();

const App = () => {
  console.log("App>>>");

  return (
    <DuelComponent></DuelComponent>
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Main" screenOptions={{ headerBackTitleVisible: false, statusBarHidden: true, headerShown: false }}>
    //     <Stack.Screen name="Main" component={MenuComponent} />
    //     <Stack.Screen name="Duel" component={DuelComponent} />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default App;