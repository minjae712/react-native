import React from "react";
import { View, Button, Text, StyleSheet, FlatList, Pressable, ScrollView, Dimensions, useColorScheme } from "react-native";

import { Colors } from "@/constants/Colors";

const { height } = Dimensions.get('window');

// 예시 일정 데이터
const events = [
    { title: '회의', startTime: '09:00', endTime: '10:00' },
    { title: '점심 식사', startTime: '12:00', endTime: '13:00' },
    { title: '프로젝트 미팅', startTime: '15:00', endTime: '16:00' },
  ];

const Day = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';

    // 시간을 시간대별로 나열하는 배열
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {hours.map((hour, index) => (
        <View key={index} style={styles.hourRow}>
          <Text style={styles.hourText}>{hour}</Text>
          <View style={styles.eventContainer}>
            {/* 현재 시간에 해당하는 이벤트가 있는지 확인 */}
            {events.map((event, eventIndex) => {
              if (event.startTime.startsWith(hour.split(':')[0])) {
                return (
                  <View key={eventIndex} style={styles.event}>
                    <Text style={styles.eventText}>
                      {event.title} ({event.startTime} - {event.endTime})
                    </Text>
                  </View>
                );
              }
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: height / 12, // 각 시간대의 높이 설정 (화면 높이에 따라 조정 가능)
  },
  hourText: {
    width: 50,
    fontSize: 16,
    color: '#333',
  },
  eventContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  event: {
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
    padding: 5,
    marginVertical: 2,
  },
  eventText: {
    color: '#00796b',
  },
});


export default Day;