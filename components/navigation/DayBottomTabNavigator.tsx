import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Day from "../DayCalendar";
import {
  View,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import InsertScheduleModal from "../InsertScheduleModal";

const Tab = createBottomTabNavigator();

const TabInsertModal = ({ openModal }: { openModal: () => void }) => (
  <TouchableOpacity onPress={openModal}>
    <View
      style={{
        alignItems: "center",
        marginBottom: 100,
        backgroundColor: "transparent",
        width: 60,
        height: 60,
      }}
    >
      <Ionicons name="add-circle" size={60} color={Colors.primary} />
    </View>
  </TouchableOpacity>
);

const DayBottomTabNavigator = ({ setCurrentView, startDateVal, setDaytDateVal, weekDateVal,
  setWeektDateVal, monthDateVal, setMonthtDateVal }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Modal controls
  const openModal = () => setModalVisible(true);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            width: 0,
            position: "absolute",
            marginLeft: 350,
          },
        })}
      >
        <Tab.Screen
          name="DayScreen"
          options={{
            tabBarButton: () => null,
          }}
        >
          {(props) => (
            <Day {...props}
              setCurrentView={setCurrentView}
              startDateVal={startDateVal}
              setDaytDateVal={setDaytDateVal}
              weekDateVal={weekDateVal}
              setWeektDateVal={setWeektDateVal}
              monthDateVal={monthDateVal}
              setMonthtDateVal={setMonthtDateVal}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="AddSchedule"
          options={{
            tabBarIcon: () => <TabInsertModal openModal={openModal} />,
            tabBarShowLabel: false,
          }}
        >
          {() => null}
        </Tab.Screen>
      </Tab.Navigator>

      <InsertScheduleModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default DayBottomTabNavigator;