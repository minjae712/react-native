import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SearchSchedule from "../SearchSchedule";

const Stack = createStackNavigator();

const HeaderStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="SearchSchedule" component={SearchSchedule}/>
        </Stack.Navigator>
    )
}

export default HeaderStackNavigator;