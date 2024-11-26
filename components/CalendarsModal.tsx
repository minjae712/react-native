import React, { useState } from "react";
import { Text, View, Modal, StyleSheet, Pressable, TouchableOpacity, Image, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import IToday from '../assets/images/i_today.svg';
import moment from 'moment';


const CalendarsModal = ({ setStartDateVal, }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const toDay = dayjs(new Date()).format('D');

    const LongshowDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const currentDayMove = () => {
        const today = moment().format('YYYY-MM-DD');
        //console.log('오늘날짜 이동', today);
        setStartDateVal(today);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };

    return (
        <View style={{ marginLeft: '10%' }}>
            <TouchableOpacity onPress={currentDayMove} onLongPress={LongshowDatePicker}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <IToday />
                    <Text style={{
                        position: 'absolute',
                        textAlign: 'center',
                        //marginRight: 50,
                    }}>
                        {toDay}
                    </Text>
                </View>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
}

export default CalendarsModal;


const styles = StyleSheet.create({

})