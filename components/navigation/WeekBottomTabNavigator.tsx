import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Week from "../WeekCalendar";
import { TextInput, View, Modal, TouchableOpacity, useColorScheme, Image, Text, ScrollView, Button, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import StartDayCalendar from "../StartDayCalendar";
import RepeatSchedule from "../RepeatSchedule";
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

const WeekBottomTabNavigator = ({ setCurrentView, setWeektDateVal, dayDateVal, setDaytDateVal,
    monthDateVal, setMonthtDateVal }) => {
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
                <Tab.Screen name="WeekScreen"
                    options={{
                        tabBarButton: () => null
                    }}>
                    {(props) => <Week {...props}
                        setCurrentView={setCurrentView}
                        setWeektDateVal={setWeektDateVal}
                        dayDateVal={dayDateVal}
                        setDaytDateVal={setDaytDateVal}
                        monthDateVal={monthDateVal}
                        setMonthtDateVal={setMonthtDateVal}
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

export default WeekBottomTabNavigator;