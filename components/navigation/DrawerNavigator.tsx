import React from "react";

import { Button, View, StyleSheet, SafeAreaView, Text, Alert, Image, useColorScheme } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import TopNavigator from "./TopNavigator";
import { Colors } from "@/constants/Colors";
import Day from "../DayCalendar";
import DayBottomTabNavigator from "./DayBottomTabNavigator";
import Week from "../WeekCalendar";
import Month from "../MonthCalendar";
import CustomDrawer from "./CustomDrawer";
import HeaderStackNavigator from "./HeaderStackNavigator";

const Drawer = createDrawerNavigator();


const DrawerNavigator = () => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <Drawer.Navigator
            backBehavior="none"
            screenOptions={{
                headerStyle: {//헤더 백그라운드 컬러
                    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
                },
                //헤더 햄버거 및 버튼 컬러 
                headerTintColor: isDarkMode ? Colors.light : Colors.dark,
                //drawer header buttons
                headerRight: () => (
                    <TopNavigator />
                ),
                drawerActiveBackgroundColor: isDarkMode ? Colors.gray : Colors.skyBlue,
                drawerLabelStyle: {
                    color: isDarkMode ? Colors.white : Colors.dark,
                    fontSize: 15,
                }

            }}
            drawerContent={props => <CustomDrawer {...props} />}>
            <Drawer.Screen name="DayBottomTabNavigator" component={DayBottomTabNavigator} options={{
                title: '일', headerTitle: '',
                drawerIcon: () => (
                    <Image source={require('../../assets/images/icon_day.png')} style={{tintColor: isDarkMode ? Colors.white : Colors.dark}} />
                )
            }} />
            <Drawer.Screen name="Week" component={Week} options={{
                title: '주', headerTitle: '', drawerIcon: () => (
                    <Image source={require('../../assets/images/icon_week.png')} style={{tintColor: isDarkMode ? Colors.white : Colors.dark}} />
                )
            }} />
            <Drawer.Screen name="Month" component={Month} options={{
                title: '월', headerTitle: '',
                drawerIcon: () => (
                    <Image source={require('../../assets/images/icon_month.png')} style={{tintColor: isDarkMode ? Colors.white : Colors.dark}} />
                )
            }} />
            <Drawer.Screen name="HeaderStackNavigator" component={HeaderStackNavigator} options={{
                title: '', headerTitle: '',drawerItemStyle: {display: 'none'}
            }} />
        </Drawer.Navigator >
    );

}


const styles = StyleSheet.create({

})


export default DrawerNavigator;