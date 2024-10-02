import React from "react";
import { Button, View, SafeAreaView, TextInput, StyleSheet, Image, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

const SearchSchedule = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [text, onChangeText] = React.useState('');
    console.log(text);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? Colors.dark : Colors.white }}>
            <TextInput
                style={{
                    height: 40,
                    margin: 12,
                    borderWidth: 1,
                    padding: 10,
                    borderColor: isDarkMode ? Colors.white : Colors.dark,
                    color: isDarkMode ? Colors.white : Colors.dark,
                }}
                onChangeText={onChangeText}
                value={text}
                placeholder='검색'
                placeholderTextColor={isDarkMode ? Colors.white : Colors.dark}
                keyboardType="email-address"
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
});


export default SearchSchedule;