import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MainLoginPage from '../MainLoginPage';
import DrawerNavigator from "./DrawerNavigator";
const Stack = createStackNavigator();

const MainLoginPageNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={MainLoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="MainApp" component={DrawerNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default MainLoginPageNavigator;