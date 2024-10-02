import React from "react";
import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Colors } from "@/constants/Colors";


const CustomDrawer = props => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? Colors.dark : Colors.white }}>
            <DrawerContentScrollView
                {...props}>
                <Image source={require('../../assets/images/logo.png')} style={{ marginHorizontal: 20 }} />
                <Text
                    style={{ color: isDarkMode ? Colors.white : Colors.dark, marginHorizontal: 20, fontSize: 20 }}>
                    userName
                </Text>
                <View
                    style={{ flex: 1, paddingTop: 10, backgroundColor: isDarkMode ? Colors.dark : Colors.white }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{
                padding: 20, borderTopWidth: 1, borderBottomWidth: 1,
                borderTopColor: isDarkMode ? Colors.white : Colors.dark,
                borderBottomColor: isDarkMode ? Colors.white : Colors.dark
            }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../assets/images/icon_refresh.png')} style={{ tintColor: isDarkMode ? Colors.white : Colors.dark }} />
                        <Text style={{ fontSize: 15, marginLeft: 25, color: isDarkMode ? Colors.white : Colors.dark }}>
                            새로고침
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{
                padding: 20, borderTopColor: isDarkMode ? Colors.white : Colors.dark,
                borderBottomColor: isDarkMode ? Colors.white : Colors.dark
            }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, marginLeft: 25, color: isDarkMode ? Colors.white : Colors.dark }}>
                            모든일정
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{
                padding: 20, borderTopColor: isDarkMode ? Colors.white : Colors.dark,
                borderBottomColor: isDarkMode ? Colors.white : Colors.dark
            }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, marginLeft: 25, color: isDarkMode ? Colors.white : Colors.dark }}>
                            개인일정
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{
                padding: 20, borderTopColor: isDarkMode ? Colors.white : Colors.dark,
                borderBottomColor: isDarkMode ? Colors.white : Colors.dark
            }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, marginLeft: 25, color: isDarkMode ? Colors.white : Colors.dark }}>
                            부서일정
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{
                padding: 20, borderTopColor: isDarkMode ? Colors.white : Colors.dark,
                borderBottomColor: isDarkMode ? Colors.white : Colors.dark
            }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, marginLeft: 25, color: isDarkMode ? Colors.white : Colors.dark }}>
                            회사일정
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{
                padding: 20, borderTopColor: isDarkMode ? Colors.white : Colors.dark,
                borderBottomColor: isDarkMode ? Colors.white : Colors.dark
            }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, marginLeft: 25, color: isDarkMode ? Colors.white : Colors.dark }}>
                            협업일정
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View >
    );
}

export default CustomDrawer;