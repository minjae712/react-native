import React from "react";
import { Text, View, TouchableOpacity, Alert, StyleSheet, useColorScheme, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import CalendarsModal from "../CalendarsModal";
import AccountManager from "../AccountManager";
import { Colors } from "@/constants/Colors";



const TopNavigator = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation();

    const onClick = () => {
        navigation.navigate('HeaderStackNavigator');
    }

    return (
        <View style={styles.drawerHeaderContainer}>
            <TouchableOpacity
                style={styles.calendarButton}
                onPress={() => Alert.alert('This is a button!')}>
                <Text style={{ color: isDarkMode ? Colors.white : Colors.dark }}>button</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.etcButton}
                onPress={() => onClick()}>
                <Image
                    source={require('../../assets/images/icon_search.png')}
                    style={{ tintColor: isDarkMode ? Colors.white : Colors.dark, marginRight: 10, marginTop: 2 }}>
                </Image>
            </TouchableOpacity>
            <TouchableOpacity>
                <CalendarsModal />
            </TouchableOpacity>
            <AccountManager />
        </View>
    );
}

const styles = StyleSheet.create({
    drawerHeaderContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    calendarButton: {
        width: 100,
        alignItems: 'left',
        marginRight: 45
    },
    etcButton: {
        width: 50,
        marginHorizontal: 5
    }
})

export default TopNavigator;