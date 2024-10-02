import React, { useEffect, useState } from "react";
import { Text, View, Modal, StyleSheet, Pressable, TouchableOpacity, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";


const AccountManager = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [isModalVisible, setisModalVisible] = useState(false);

    useEffect(() => {

    }, []);

    const onPressModalOpen = () => {
        console.log('팝업이 열린다.');
        setisModalVisible(true);
    }

    const onPressModalClose = () => {
        console.log('팝업이 닫힌다.');
        setisModalVisible(false);
    }

    return (
        <View>
            <TouchableOpacity onPress={onPressModalOpen}>
                <Ionicons name="person-circle-outline" size={40} color={isDarkMode ? Colors.white : Colors.dark}
                    style={{
                        width: 40,
                        marginRight: 5,
                    }} />
            </TouchableOpacity>



            <Modal animationType="fade"
                visible={isModalVisible}
                transparent={true}>

                <View style={{
                    marginTop: 120,
                    margin: 20,
                    borderRadius: 20,
                    padding: 170,
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? Colors.dark : Colors.white
                }}>
                    <View style={{ position: 'absolute' }}>
                        <View style={{ position: 'absolute', marginLeft: 130 }}>
                            <Pressable onPress={onPressModalClose}>
                                <Ionicons name="close" size={35} color={isDarkMode ? Colors.white : Colors.dark} />
                            </Pressable>
                        </View>
                    </View>
                    <View>
                        <Text>계정관리.</Text>
                    </View>
                </View >
            </Modal >
        </View >
    );
}

export default AccountManager;