import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Day from "../DayCalendar";
import { View, Modal, TouchableOpacity, useColorScheme, Image, Text, ScrollView, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const BottomTabBase = () => <View style={{ flex: 1, backgroundColor: "red" }} />

const TabInsertModal = ({ opneModal, focused, isDarkMode }) => (
    <TouchableOpacity onPress={opneModal}>
        <View style={{
            alignItems: 'flex-end',
            marginBottom: 30,
            backgroundColor: isDarkMode ? Colors.white : Colors.dark,
            borderRadius: 10, padding: 5
        }}
        >
            <Image source={require('../../assets/images/add-schedule.png')}
                style={{
                    tintColor: isDarkMode ? Colors.dark : Colors.white,
                }}
            />
        </View>
    </TouchableOpacity>
)


const DayBottomTabNavigator = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [modalVisible, setModalVisivle] = useState(false);

    const opneModal = () => {
        setModalVisivle(true);
    }
    const closeModal = () => {
        setModalVisivle(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                initialRouteName='Day'
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
                <Tab.Screen name="Day" component={Day}
                    options={{
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="AddSchedule"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabInsertModal opneModal={opneModal} focused={focused} />
                        ),
                        tabBarShowLabel: false
                    }}>
                    {() => null}
                </Tab.Screen>
            </Tab.Navigator>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >

                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', margin: 0 }}>
                    <View style={{ flex: 1, width: '100%', borderRadius: 100 }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', backgroundColor: isDarkMode ? Colors.dark : Colors.white }}>
                            <TouchableOpacity
                                onPress={closeModal}
                            >
                                <Ionicons name="close" size={35} color={isDarkMode ? Colors.white : Colors.dark} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                button
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ flex: 1, backgroundColor: isDarkMode ? Colors.dark : Colors.white }}>

                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View >
    );
}

export default DayBottomTabNavigator;