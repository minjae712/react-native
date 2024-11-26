import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, } from "react-native";
import moment from 'moment';



const CurrentDate = ({ currentView, }) => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        setCurrentDate(moment().format('YYYY-MM'));
    }, []);

    return (
        <View style={styles.drawerHeaderContainer}>
            <Text style={styles.calendarView}>{currentView == '' ? currentDate : currentView}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    drawerHeaderContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    calendarView: {
        marginRight: '40%',
        width: '30%'
    },
})

export default CurrentDate;