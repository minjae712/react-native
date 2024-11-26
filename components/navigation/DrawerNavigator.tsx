import React, { useState, useEffect } from "react";

import { View, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import CurrentDate from "../CurrentDate";
//import { Colors } from "@/constants/Colors";
//import Day from "../DayCalendar";
import DayBottomTabNavigator from "./DayBottomTabNavigator";
import Day from "../DayCalendar";
import Week from "../WeekCalendar";
import WeekBottomTabNavigator from "./WeekBottomTabNavigator";
import Month from "../MonthCalendar";
import MonthBottomTabNavigator from "./MonthBottomTabNavigator";
import CustomDrawer from "./CustomDrawer";
//import HeaderStackNavigator from "./HeaderStackNavigator";
import MainLoginPage from "../MainLoginPage";
import CalendarsModal from "../CalendarsModal";
import IDaliy from '../../assets/images/i_DailyReport.svg';
import IWeek from '../../assets/images/i_WeekReport.svg';
import IMonth from '../../assets/images/i_MonthlyReport.svg';
import AccountManager from "../AccountManager";
import SearchSchedule from "../SearchSchedule";

type DrawerNavigatorProps = {
    currentView: string;
    setCurrentView: React.Dispatch<React.SetStateAction<string>>;
};

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC<DrawerNavigatorProps> = () => {
    const [currentView, setCurrentView] = useState('');
    const [startDateVal, setStartDateVal] = useState('');

    const [dayDateVal, setDaytDateVal] = useState('');
    const [weekDateVal, setWeektDateVal] = useState('');
    const [monthDateVal, setMonthtDateVal] = useState('');

    return (
        <>
            <Drawer.Navigator
                initialRouteName="Login"
                backBehavior="none"
                screenOptions={{
                    headerStyle: {
                        borderBottomWidth: 1,
                        height: 110,
                    },
                    headerLeftContainerStyle: {
                        marginTop: -5, // 햄버거 아이콘을 위로 이동
                    },
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CurrentDate currentView={currentView} />
                            <TouchableOpacity style={{ top: '30%' }}>
                                <SearchSchedule />
                            </TouchableOpacity>
                            <View>
                                <CalendarsModal
                                    setStartDateVal={setStartDateVal}
                                />
                            </View>
                            <View>
                                <AccountManager />
                            </View>
                        </View>
                    ),
                    drawerStyle: {
                        width: Dimensions.get('window').width / 1.2,
                    },
                }}
                drawerContent={(props) => <CustomDrawer {...props} />}
            >
                <Drawer.Screen
                    name="Login"
                    component={MainLoginPage}
                    options={{
                        title: '',
                        headerTitle: '',
                        drawerItemStyle: { display: 'none' },
                        headerShown: false,
                    }}
                />
                <Drawer.Screen
                    name="Day"
                    options={{
                        title: '일보기',
                        headerTitle: '',
                        drawerLabelStyle: { color: '#000000', fontSize: 16 },
                        drawerIcon: () => <IDaliy />,
                    }}
                >
                    {(props) => (
                        <DayBottomTabNavigator
                            {...props}
                            setCurrentView={setCurrentView}
                            startDateVal={startDateVal}
                            setDaytDateVal={setDaytDateVal}
                            weekDateVal={weekDateVal}
                            setWeektDateVal={setWeektDateVal}
                            monthDateVal={monthDateVal}
                            setMonthtDateVal={setMonthtDateVal}
                        />
                    )}
                </Drawer.Screen>
                <Drawer.Screen
                    name="Week"
                    options={{
                        title: '주보기',
                        headerTitle: '',
                        drawerLabelStyle: { color: '#000000', fontSize: 16 },
                        drawerIcon: () => <IWeek />,
                    }}
                >
                    {(props) => (
                        <WeekBottomTabNavigator
                            {...props}
                            setCurrentView={setCurrentView}
                            setWeektDateVal={setWeektDateVal}
                            dayDateVal={dayDateVal}
                            setDaytDateVal={setDaytDateVal}
                            monthDateVal={monthDateVal}
                            setMonthtDateVal={setMonthtDateVal}
                        />
                    )}
                </Drawer.Screen>
                <Drawer.Screen
                    name="Month"
                    options={{
                        title: '월보기',
                        headerTitle: '',
                        drawerLabelStyle: { color: '#000000', fontSize: 16 },
                        drawerIcon: () => <IMonth />,
                    }}
                >
                    {(props) => (
                        <MonthBottomTabNavigator
                            {...props}
                            setCurrentView={setCurrentView}
                            setStartDateVal={setStartDateVal}
                            setMonthtDateVal={setMonthtDateVal}
                            dayDateVal={dayDateVal}
                            weekDateVal={weekDateVal}
                            setDaytDateVal={setDaytDateVal}
                            setWeektDateVal={setWeektDateVal}
                        />
                    )}
                </Drawer.Screen>
            </Drawer.Navigator>
        </>
    );
};


const styles = StyleSheet.create({

})


export default DrawerNavigator;