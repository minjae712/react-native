import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, useColorScheme } from "react-native";

import { Colors } from '@/constants/Colors';
import moment from 'moment';
import 'moment/locale/ko';

const events = [
    {
      id: 1,
      title: 'Meeting with Bob',
      start: moment().set({ hour: 9, minute: 0 }),
      end: moment().set({ hour: 10, minute: 30 }),
    },
    {
      id: 2,
      title: 'Lunch with Sarah',
      start: moment().set({ hour: 12, minute: 0 }),
      end: moment().set({ hour: 13, minute: 0 }),
    },
    {
      id: 3,
      title: 'Project review',
      start: moment().set({ hour: 15, minute: 30 }),
      end: moment().set({ hour: 16, minute: 30 }),
    },
  ];
  

const Week = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [selectedDate, setSelectedDate] = useState(moment());

    const renderWeekDays = () => {
        const startOfWeek = selectedDate.clone().startOf('week');
        const days = [];

        for (let i = 0; i < 7; i++) {
            const day = startOfWeek.clone().add(i, 'days');
            days.push(
                <TouchableOpacity key={i} style={styles.dayContainer} onPress={() => setSelectedDate(day)}>
                    <Text style={styles.dayText}>{day.format('ddd')}</Text>
                    <Text style={styles.dateText}>{day.format('D')}</Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

    const renderTimeSlots = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            times.push(
                <View key={hour} style={styles.timeSlot}>
                    <Text style={styles.timeText}>{moment({ hour }).format('HH:mm')}</Text>
                </View>
            );
        }
        return times;
    };

    const renderEventsForTime = (hour) => {
        const currentDate = selectedDate.clone().startOf('day').set({ hour });
        
        const filteredEvents = events.filter(
          event => event.start.isSameOrAfter(currentDate) && event.start.isBefore(currentDate.clone().add(1, 'hour'))
        );
    
        return filteredEvents.map(event => (
          <View key={event.id} style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventTime}>
              {event.start.format('HH:mm')} - {event.end.format('HH:mm')}
            </Text>
          </View>
        ));
      };

    return (
        <View style={{
            flex: 1,
            padding: 10,
            backgroundColor: Colors.darker
        }}>
            {/* Week Days */}
            <View style={styles.weekContainer}>
                {renderWeekDays()}
            </View>

            {/* Time Slots */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
                <View style={styles.timeSlotsContainer}>
                    {renderTimeSlots()}
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
      weekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    dayContainer: {
        alignItems: 'center',
    },
    dayText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
        color: '#555',
    },
    scrollContainer: {
        flex: 1,
    },
    timeSlotsContainer: {
        paddingVertical: 10,
    },
    timeSlot: {
        height: 60,
        justifyContent: 'center',
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    timeText: {
        fontSize: 14,
        color: '#555',
    },

    eventContainer: {
        backgroundColor: '#f1c40f',
        padding: 5,
        borderRadius: 5,
        marginVertical: 2,
      },
      eventTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
      },
      eventTime: {
        fontSize: 12,
        color: '#fff',
      },
});


export default Week;