import React, { useEffect, useState } from "react";
import { Text, View, Modal, StyleSheet, Pressable, TouchableOpacity, useColorScheme, Button, Image, Alert } from "react-native";
import { Colors } from "@/constants/Colors";

import IUser from '../assets/images/i_user.svg';
import IClose from '../assets/images/i_close.svg'
import { Logout } from "@/utils/Logout";
import { useNavigation } from '@react-navigation/native';

const AccountManager = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigation = useNavigation();

    const onPressModalOpen = () => {
        setIsModalVisible(true);
    }

    const onPressModalClose = () => {
        setIsModalVisible(false);
    };

    const handleLogout = async () => {
        await Logout();
        setIsModalVisible(false);
        navigation.navigate('Login');
    };

    return (
        <View>
            <TouchableOpacity onPress={onPressModalOpen}>
                <View style={{ marginRight: 15 }}>
                    <IUser />
                </View>
            </TouchableOpacity>


            <Modal animationType="fade"
                visible={isModalVisible}
                transparent={true}>

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '70%',
                    height: '65%',
                    padding: 20,
                    borderRadius: 20,
                    top: '20%',
                    left: '15%',
                    backgroundColor: Colors.white
                }}>
                    <View style={{
                        position: 'absolute', top: 20, left: 20
                    }}>
                        <Pressable onPress={onPressModalClose}>
                            <IClose />
                        </Pressable>
                    </View>

                    <Pressable style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Button title="로그아웃" onPress={handleLogout} />
                    </Pressable>
                </View >
            </Modal >
        </View >
    );
}

export default AccountManager;