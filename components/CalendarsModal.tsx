import React, { useEffect, useState } from "react";
import { Text, View, Modal, StyleSheet, Pressable, TouchableOpacity, Image, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";

const CalendarsModal = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const toDay = dayjs(new Date()).format('D');

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };

    return (
        <View>
            <TouchableOpacity onLongPress={showDatePicker}>
                <View>
                    <Image
                        source={require('../assets/images/icon_calendar.png')}
                        style={{ tintColor: isDarkMode ? Colors.white : Colors.dark, marginRight: 10, marginTop: 2 }}>
                    </Image>

                    <Text style={{ position: 'absolute', marginLeft: 9, marginTop: 9, color: isDarkMode ? Colors.white : Colors.dark }}>
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