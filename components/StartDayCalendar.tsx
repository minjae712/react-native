import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useColorScheme, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import dayjs from "dayjs";

const StartDayCalendar = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}: {
    startDate: Date;
    setStartDate: (date: Date) => void;
    endDate: Date;
    setEndDate: (date: Date) => void;
}) => {
    const isDarkMode = useColorScheme() === "dark";

    // Picker visibility states
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

    // Show/Hide Pickers
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const showTimePicker = () => setTimePickerVisibility(true);
    const hideTimePicker = () => setTimePickerVisibility(false);

    const showEndDatePicker = () => setEndDatePickerVisibility(true);
    const hideEndDatePicker = () => setEndDatePickerVisibility(false);
    const showEndTimePicker = () => setEndTimePickerVisibility(true);
    const hideEndTimePicker = () => setEndTimePickerVisibility(false);

    // Function to calculate 1 hour later
    const calculateOneHourLater = (date: Date) => {
        const oneHourLater = new Date(date);
        oneHourLater.setHours(date.getHours() + 1);
        return oneHourLater;
    };

    // Round minutes to either 00 or 30
    const roundMinutes = (date: Date): Date => {
        const minutes = date.getMinutes();
        date.setMinutes(minutes < 15 || minutes >= 45 ? 0 : 30);
        date.setSeconds(0, 0); // Clear seconds and milliseconds
        return date;
    };

    // Confirm Handlers for Start Date and Time
    const handleConfirmStartDate = (date: Date) => {
        const combinedDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startDate.getHours(),
            startDate.getMinutes()
        );
        setStartDate(combinedDate);

        // Automatically update 종료시간 to 1 hour later
        const newEndDate = calculateOneHourLater(combinedDate);
        setEndDate(newEndDate);

        hideDatePicker();
    };

    const handleConfirmStartTime = (time: Date) => {
        const combinedTime = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            time.getHours(),
            time.getMinutes()
        );

        const roundedTime = roundMinutes(combinedTime);
        setStartDate(roundedTime);

        // Automatically update 종료시간 to 1 hour later
        const newEndTime = calculateOneHourLater(roundedTime);
        setEndDate(newEndTime);

        hideTimePicker();
    };

    // Confirm Handlers for End Date and Time
    const handleConfirmEndDate = (date: Date) => {
        const combinedDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            endDate.getHours(),
            endDate.getMinutes()
        );
        setEndDate(combinedDate);
        hideEndDatePicker();
    };

    const handleConfirmEndTime = (time: Date) => {
        const combinedTime = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            time.getHours(),
            time.getMinutes()
        );

        const roundedTime = roundMinutes(combinedTime);
        setEndDate(roundedTime);
        hideEndTimePicker();
    };

    return (
        <View>
            {/* Start Date and Time */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                    <Text style={styles.dateText}>
                        시작일: {dayjs(startDate).format("YYYY-MM-DD")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateButton} onPress={showTimePicker}>
                    <Text style={styles.dateText}>
                        시작시간: {dayjs(startDate).format("HH:mm")}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* End Date and Time */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.dateButton} onPress={showEndDatePicker}>
                    <Text style={styles.dateText}>
                        종료일: {dayjs(endDate).format("YYYY-MM-DD")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateButton} onPress={showEndTimePicker}>
                    <Text style={styles.dateText}>
                        종료시간:{" "}
                        {endDate <= startDate
                            ? dayjs(startDate).add(1, "hour").format("HH:mm") // Dynamically display 1 hour later if endDate is invalid
                            : dayjs(endDate).format("HH:mm")}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Date and Time Pickers */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={hideDatePicker}
                date={startDate}
            />
            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmStartTime}
                onCancel={hideTimePicker}
                date={startDate}
            />
            <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmEndDate}
                onCancel={hideEndDatePicker}
                date={endDate}
            />
            <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmEndTime}
                onCancel={hideEndTimePicker}
                date={endDate}
            />
        </View>
    );
};

export default StartDayCalendar;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    dateButton: {
        padding: 10,
    },
    dateText: {
        fontSize: 18,
        color: Colors.dark,
    },
});