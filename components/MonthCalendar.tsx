import React, { useState, useEffect, useRef } from "react";
import { View, useWindowDimensions, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from "@react-navigation/native";


const events = [
    { id: 1, title: 'Meeting with Bob', date: moment().set({ date: 5, month: moment().month() }) },
    { id: 2, title: 'Project Deadline', date: moment().set({ date: 10, month: moment().month() }) },
    { id: 3, title: 'Dinner with Alice', date: moment().set({ date: 15, month: moment().month() }) },
];

const Month = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [currentMonth, setCurrentMonth] = useState(moment());
    const navigation = useNavigation();

    // 애니메이션 값 정의
    const slideAnim = useRef(new Animated.Value(0)).current;

    const onClick = (key) => {
        navigation.navigate('Day', {selectedKey: key});
    }

    // 애니메이션 실행 함수
    const triggerAnimation = (direction) => {
        console.log(direction);
        Animated.timing(slideAnim, {
            toValue: direction === 'left' ? -1 : 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start(() => {
            slideAnim.setValue(0);  // 애니메이션 종료 후 값 초기화
        });
    };


    const goToPreviousMonth = () => {
        triggerAnimation('left');
        setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
    };

    const goToNextMonth = () => {
        triggerAnimation('right');
        setCurrentMonth(currentMonth.clone().add(1, 'month'));
    };

    const renderDaysOfWeek = () => {
        const daysOfWeek = moment.weekdaysShort();
        return daysOfWeek.map((day, index) => (
            <View key={index} style={styles.dayOfWeekContainer}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: isDarkMode ? Colors.white : Colors.darker
                }}>{day}</Text>
            </View>
        ));
    };

    const renderDaysInMonth = () => {
        const startOfMonth = currentMonth.clone().startOf('month');
        const endOfMonth = currentMonth.clone().endOf('month');
        const startOfWeek = startOfMonth.clone().startOf('week');
        const endOfWeek = endOfMonth.clone().endOf('week') + 1;

        const days = [];
        let day = startOfWeek.clone();

        while (day.isBefore(endOfWeek, 'day')) {
            const formattedDate = day.format('YYYY-MM-DD');
            days.push(
                <TouchableOpacity
                    key={day.format('YYYY-MM-DD')}
                    style={[
                        {
                            width: '14.28%',
                            height: 110,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: isDarkMode ? Colors.white : Colors.darker
                        },
                        {
                            backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                        },
                    ]}
                    onPress={() => handleDayPress(formattedDate, day)}
                >
                    <View style={{ alignSelf: 'stretch' }}>
                        <Text style={[styles.dayText, day.isSame(currentMonth, 'month') ? { color: isDarkMode ? Colors.white : Colors.darker } : styles.otherMonthDay]}>
                            {day.format('D')}
                        </Text>
                    </View>
                    <View style={{ marginBottom: 80 }}>
                        {renderEventsForDay(day)}
                    </View>
                </TouchableOpacity>
            );
            day.add(1, 'day');
        }

        return days;
    };

    const handleDayPress = (formattedDate, day) => {
        onClick(formattedDate);
    };

    const renderEventsForDay = (day) => {
        const dayEvents = events.filter(event => event.date.isSame(day, 'day'));
        return dayEvents.map(event => (
            <View key={event.id} style={styles.eventDot}>
                <Text style={{ fontSize: 10 }}>
                    {event.title}
                </Text>
            </View>
        ));
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
            {/* Month Navigation */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goToPreviousMonth}>
                    <Text style={styles.navButton}>‹</Text>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: isDarkMode ? Colors.white : Colors.black
                }}>{currentMonth.format('MMMM YYYY')}</Text>
                <TouchableOpacity onPress={goToNextMonth}>
                    <Text style={styles.navButton}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Days of the Week */}
            <View style={styles.daysOfWeekContainer}>
                {renderDaysOfWeek()}
            </View>

            {/* Animated View for Days in Month */}
            <ScrollView>
                <Animated.View
                    style={[
                        styles.daysContainer,
                        {
                            transform: [
                                {
                                    translateX: slideAnim.interpolate({
                                        inputRange: [-1, 0, 1],
                                        outputRange: [-300, 0, 300],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    {renderDaysInMonth()}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    navButton: {
        fontSize: 30,
        color: '#007AFF',
    },
    daysOfWeekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayOfWeekContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    dayOfWeekText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    dayText: {
        fontSize: 16,
    },
    otherMonthDay: {
        color: '#aaa',
    },
    eventDot: {
        width: 50,
        height: 15,
        backgroundColor: '#f1c40f',
        borderRadius: 3,
    },
});


export default Month;