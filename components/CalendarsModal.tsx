import React, { useState } from "react";
import { Text, View, Modal, StyleSheet, Pressable, TouchableOpacity, Image, useColorScheme } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import IToday from '../assets/images/i_today.svg';
import moment from 'moment';


const CalendarsModal = ({ setGoToDay, }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const toDay = moment(new Date()).format('YYYY-MM-DD');

    const LongshowDatePicker = () => {
        setDatePickerVisibility(true);
    };

    function currentDayMove() {
        console.log('오늘날짜 이동', toDay);
        setGoToDay(toDay);
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
                        {moment(toDay).format('D')}
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