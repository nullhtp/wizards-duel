// src/pages/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

const Layout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false,
            statusBarHidden: true,
            navigationBarHidden: true,
            statusBarTranslucent: true,
            headerTransparent: true,
            fullScreenGestureEnabled: true,
        }} >
        </Stack>
    );
};


export default Layout;
