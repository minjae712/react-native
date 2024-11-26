import React, { useState, useCallback, useRef } from "react";
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, Animated, Easing, } from "react-native";
import { Colors } from "@/constants/Colors";
import moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import GetScheduleListsAPI from '../restAPIComponents/GetScheduleListsAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const holidays = [
    // { date: '2024-01-01', name: '신정' },
    // { date: '2024-02-09', name: '설날 연휴' },
    // { date: '2024-02-10', name: '설날' },
    // { date: '2024-02-11', name: '설날 연휴' },
    // { date: '2024-03-01', name: '삼일절' },
    // { date: '2024-05-05', name: '어린이날' },
    // { date: '2024-05-15', name: '부처님 오신 날' },
    // { date: '2024-06-06', name: '현충일' },
    // { date: '2024-08-15', name: '광복절' },
    // { date: '2024-09-17', name: '추석 연휴' },
    // { date: '2024-09-18', name: '추석' },
    // { date: '2024-09-19', name: '추석 연휴' },
    // { date: '2024-10-03', name: '개천절' },
    // { date: '2024-10-09', name: '한글날' },
    // { date: '2024-12-25', name: '성탄절' },
];

const Month = ({ setCurrentView, setStartDateVal, setMonthtDateVal, dayDateVal, weekDateVal,
    setDaytDateVal, setWeektDateVal }) => {
    const [currentMonth, setCurrentMonth] = useState(moment());
    const navigation = useNavigation();
    const [isSwiping, setIsSwiping] = useState(false);
    const route = useRoute();
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');
    const startOfWeek = startOfMonth.clone().startOf('week');
    const endOfWeek = endOfMonth.clone().endOf('week').add(8, 'days');
    const [events, setEvents] = useState([]);

    let { checkedItem } = route.params || {};
    let getCheckedItems = {};
    let getOwnerIds = {};

    useFocusEffect(
        useCallback(() => {
            const initialDate = dayDateVal ? moment(dayDateVal) : weekDateVal ? moment(weekDateVal) : currentMonth;
            setCurrentMonth(initialDate);
            setMonthtDateVal(initialDate.format('YYYY-MM-DD'));
            setDaytDateVal('');
            setWeektDateVal('');
        }, [dayDateVal, weekDateVal])
    );

    useFocusEffect(
        useCallback(() => {
            const settingCheckValue = async () => {
                await scheduleListSet();
            };
            settingCheckValue();
        }, [currentMonth, checkedItem])
    );


    async function scheduleListSet() {
        const selectedItems = await AsyncStorage.getItem('selectedItems');
        if (selectedItems) getCheckedItems = JSON.parse(selectedItems);

        const ownerData = await AsyncStorage.getItem('initialOwnerId');
        if (ownerData) getOwnerIds = JSON.parse(ownerData);

        let selectedEntries = [];

        selectedEntries = Object.entries(getCheckedItems);
        const ownerIds = Object.entries(getOwnerIds);

        const checkedType = [];

        if (ownerIds.length > 0) {
            selectedEntries.forEach(([key, value]) => {

                if (value) checkedType.push(ownerIds[Number(key)]);
            });

            const scheduleData = await GetScheduleListsAPI(
                String(startOfWeek.format('YYYY-MM-DD')),
                String(endOfWeek.format('YYYY-MM-DD')),
                checkedType
            );
            // 가져온 그룹 리스트를 각각 셋팅하여 newEvents 에 담아준다.
            const newEvents = scheduleData.map((item) => ({
                id: item.scheduleId,
                title: item.title,
                date: moment(item.startDate),
                endDate: moment(item.endDate),
                groupColor: item.groupColor,
            }));

            setEvents(newEvents);
        }
    };


    const getHolidayName = (date) => {
        const holiday = holidays.find(holiday => holiday.date === date);
        return holiday ? holiday.name : null;
    };

    const slideAnim = useRef(new Animated.Value(0)).current;

    const triggerAnimation = (direction) => {
        Animated.sequence([
            Animated.timing(slideAnim, {
                toValue: direction === 'left' ? -1 : 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.ease,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            })
        ]).start();
    };

    const goToPreviousMonth = () => {
        const newMonth = currentMonth.clone().subtract(1, "month");
        setMonthtDateVal(newMonth.format('YYYY-MM-DD'));
        triggerAnimation('left');
        setCurrentMonth(newMonth);
        setCurrentView(newMonth.format("YYYY-MM"));
    };

    const goToNextMonth = () => {
        const newMonth = currentMonth.clone().add(1, "month");
        setMonthtDateVal(newMonth.format('YYYY-MM-DD'));
        triggerAnimation('right');
        setCurrentMonth(newMonth);
        setCurrentView(newMonth.format("YYYY-MM"));
    };

    const renderDaysOfWeek = () => {
        const daysOfWeek = moment.weekdaysShort();
        return daysOfWeek.map((day, index) => (
            <View key={index} style={styles.dayOfWeekContainer}>
                <Text style={[
                    styles.dayOfWeekText,
                    index === 0 ? styles.sunday : index === 6 ? styles.saturday : null
                ]}>
                    {day}
                </Text>
            </View>
        ));
    };

    const renderDaysInMonth = () => {
        const days = [];
        let day = startOfWeek.clone();
        while (day.isBefore(endOfWeek, 'day')) {
            const formattedDate = day.format('YYYY-MM-DD');
            const isSunday = day.day() === 0;
            const isSaturday = day.day() === 6;

            // 공휴일 확인
            const holidayName = getHolidayName(formattedDate);
            days.push(
                <TouchableOpacity
                    key={day.format('YYYY-MM-DD')}
                    style={styles.dayContainer}
                    onPress={() => handleDayPress(formattedDate)}
                >
                    <View>
                        <Text style={[
                            styles.dayText,
                            day.isSame(currentMonth, 'month') ?
                                (isSunday ? styles.sunday : isSaturday ? styles.saturday : { color: Colors.darker }) :
                                styles.otherMonthDay
                        ]}>
                            {day.format('D')}
                        </Text>
                    </View>

                    {/* 공휴일 이름 표시 */}
                    {holidayName && (
                        <View style={styles.holidayDot}>
                            <Text style={{ color: 'red', fontSize: 10 }}>
                                {holidayName}
                            </Text>
                        </View>
                    )}
                    <View style={{ marginBottom: 80 }}>
                        {renderEventsForDay(day)}
                    </View>
                </TouchableOpacity>
            );
            day.add(1, 'day');
        }

        return days;
    };

    const handleDayPress = (formattedDate) => {
        navigation.navigate('Day');
        setStartDateVal(formattedDate);
    };

    const renderEventsForDay = (day) => {
        const dayEvents = events.filter(event => event.date.isSame(day, 'day'));
        const maxVisibleEvents = 5;

        return (
            <>
                {dayEvents.slice(0, maxVisibleEvents).map(event => (
                    <View key={event.id} style={[styles.eventDot, { backgroundColor: event.groupColor }]}>
                        <Text style={styles.eventDotText} numberOfLines={1} ellipsizeMode="clip">
                            {event.title}
                        </Text>
                    </View>
                ))}
                {dayEvents.length > maxVisibleEvents && (
                    <Text style={styles.moreEventsText}>+{dayEvents.length - maxVisibleEvents} more</Text>
                )}
            </>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.daysOfWeekContainer}>
                {renderDaysOfWeek()}
            </View>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PanGestureHandler
                    onGestureEvent={(event) => {
                        const { translationX } = event.nativeEvent;

                        if (!isSwiping) {
                            if (translationX > width / 4) { // 오른쪽 스와이프
                                setIsSwiping(true);
                                goToPreviousMonth();
                            } else if (translationX < -width / 4) { // 왼쪽 스와이프
                                setIsSwiping(true);
                                goToNextMonth();
                            }
                        }
                    }}
                    onEnded={() => setIsSwiping(false)} // 스와이프 종료 시 상태 복구
                >
                    <View style={styles.daysContainer}>
                        {renderDaysInMonth()}
                    </View>
                </PanGestureHandler>
            </GestureHandlerRootView>
        </View>
    );
};

const styles = StyleSheet.create({
    daysOfWeekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayOfWeekContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
    },
    dayOfWeekText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
    },
    dayText: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    otherMonthDay: {
        color: '#aaa',
    },
    sunday: {
        color: 'red',
    },
    saturday: {
        color: 'blue',
    },
    eventDot: {
        width: 56,
        height: 15,
        borderRadius: 3,
        margin: 1,

    },
    eventDotText: {
        fontSize: 10,
        bottom: 2,
        color: '#fff',
        fontWeight: '600'
    },
    holidayDot: {
        width: 50,
        height: 14,
        backgroundColor: '#f1c40f',
        borderRadius: 3,
    },
    dayContainer: {
        width: '14.28%',
        height: 122,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: '#E9E9E9',
    },
    moreEventsText: {
        fontSize: 10,
        fontWeight: '600',

    },
});

export default Month;
