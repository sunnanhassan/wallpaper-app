import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { FadeIn } from 'react-native-reanimated'

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='home/index'
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='home/image'
                options={{
                    headerShown: false,
                    presentation: 'transparentModal',
                    animation: 'fade'
                }}
            />
        </Stack>

    )
}

export default Layout