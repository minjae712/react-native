import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from "@react-navigation/drawer";
import { useNavigation, } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import GetGroupList from "../GetGroupList";
import { useAuth } from "../../utils/AuthContext"; // Context 불러오기

const CustomDrawer = (props: any) => {
    const [userName, setUserName] = useState<string>('');
    const navigation = useNavigation();
    const { isLoggedIn, setIsLoggedIn } = useAuth();

    useEffect(() => {
        async function loginCheckYn() {
            if (isLoggedIn) {
                const userName = await SecureStore.getItemAsync('saveUserName');
                if (userName) {
                    setUserName(userName);
                }
            }
        }
        loginCheckYn();
    }, [isLoggedIn]);

    return (
        <View style={{ flex: 1, }}>
            <DrawerContentScrollView
                {...props}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../assets/images/logo.png')} style={{ marginHorizontal: 20, width: 200, height: 24, padding: 0 }} />
                </View>
                <View style={{ borderBottomWidth: 1, marginTop: 20 }}></View>
                <Text
                    style={{ /*color: isDarkMode ? Colors.dark : Colors.dark,*/fontSize: 20, marginTop: 20, marginLeft: 20 }}>
                    {userName}
                </Text>
                <View style={{ borderBottomWidth: 1, marginTop: 20 }}></View>
                <View
                    style={{ flex: 1, paddingTop: 10, /*backgroundColor: isDarkMode ? Colors.dark : Colors.white */ }}>
                    <DrawerItemList {...props} />
                </View>

                <View style={{
                    borderTopWidth: 1,
                    /*borderTopColor: isDarkMode ? Colors.dark : Colors.dark,*/
                    /*borderBottomColor: isDarkMode ? Colors.dark : Colors.dark*/
                }}>
                </View>
                <GetGroupList />
                <View style={{
                    marginBottom: 220 /*borderTopColor: isDarkMode ? Colors.dark : Colors.dark,*/
                    /*borderBottomColor: isDarkMode ? Colors.dark : Colors.dark*/
                }}>
                </View>
            </DrawerContentScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    scheduleTypeContent: {
        flexDirection: 'row'
    },
    scheduleType: {
        fontSize: 15,
        marginLeft: 25,
    }
});

export default CustomDrawer;