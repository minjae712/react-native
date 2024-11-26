import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Month from "../MonthCalendar";
import { TextInput, View, Modal, TouchableOpacity, useColorScheme, Image, Text, ScrollView, Button, Pressable } from "react-native";
import moment from 'moment';
import InsertScheduleModal from "../InsertScheduleModal";

const Tab = createBottomTabNavigator();

const TabInsertModal = ({ openModal }: { openModal: () => void }) => (
    <TouchableOpacity onPress={openModal}>
        <View style={{
            alignItems: 'center',
            marginBottom: 100,
            backgroundColor: 'transparent',
            width: 60, height: 60,
        }}
        >
            <Image source={require('../../assets/images/add-schedule.png')}
                style={{

                }}
            />
        </View>
    </TouchableOpacity>
)

//const InsertApiSchedule = (allDay, StartDay, endDay, StartTime, endTime) => {

//}

const MonthBottomTabNavigator = ({ setCurrentView,
    setStartDateVal, setMonthtDateVal, dayDateVal, weekDateVal, setDaytDateVal, setWeektDateVal }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [modalVisible, setModalVisible] = useState(false);

    // Modal controls
    const openModal = () => setModalVisible(true);


    // `setCurrentView` 호출
    useEffect(() => {
        if (setCurrentView) {
            setCurrentView(moment().format('YYYY-MM')); // 원하는 텍스트를 전달
        }
    }, [setCurrentView]);

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        width: 0,
                        position: 'absolute',
                        marginLeft: 350
                    }
                })}
            >
                <Tab.Screen name="MonthScreen"
                    options={{
                        tabBarButton: () => null
                    }}>
                    {(props) => <Month {...props}
                        setCurrentView={setCurrentView}
                        setStartDateVal={setStartDateVal}
                        setMonthtDateVal={setMonthtDateVal}
                        dayDateVal={dayDateVal}
                        weekDateVal={weekDateVal}
                        setDaytDateVal={setDaytDateVal}
                        setWeektDateVal={setWeektDateVal}
                    />}
                </Tab.Screen>
                <Tab.Screen
                    name="AddSchedule"
                    options={{
                        tabBarIcon: () => (
                            <TabInsertModal openModal={openModal} />
                        ),
                        tabBarShowLabel: false
                    }}>
                    {() => null}
                </Tab.Screen>
            </Tab.Navigator>
            <InsertScheduleModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        </View >
    );
}

export default MonthBottomTabNavigator;