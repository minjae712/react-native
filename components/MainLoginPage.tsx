import React, { useState, useEffect, useRef } from "react";
import { View, Modal, TextInput, TouchableOpacity, Alert, StyleSheet, Text, Animated } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginAPI from "@/restAPIComponents/LoginAPI";
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "@/constants/Colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../utils/AuthContext";
import Login_bg from '../assets/images/login_bg.svg';
import CalApp_logo from '../assets/images/calApp_logo.svg';
export type RootStackParamList = {
    Day: undefined;
    // Add other screens here
};

const MainLoginPage = () => {
    const [modalVisible, setModalVisible] = useState(true);
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [buttonVisible, setButtonVisible] = useState(false);
    const translateX = useRef(new Animated.Value(0)).current;
    const buttonOnOff = (buttonVisible ? styles.buttonOn : styles.buttonOff);
    const { setIsLoggedIn } = useAuth();


    // 버튼 클릭 시 애니메이션 실행
    const StartAnimation = () => {
        if (buttonVisible === false) {
            setButtonVisible(true);

            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 10, // 오른쪽으로 이동할 거리
                    duration: 50, // 애니메이션 시간
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            setButtonVisible(false);
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 0, // 원래 위치로 복귀
                    duration: 50, // 애니메이션 시간
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const AutoLoginAnimation = () => {
        setButtonVisible(true);
        Animated.sequence([
            Animated.timing(translateX, {
                toValue: 10, // 오른쪽으로 이동할 거리
                duration: 50, // 애니메이션 시간
                useNativeDriver: true,
            })
        ]).start();
        autoLogin();
    }

    const LoginSubmit = async () => {
        const osName = Device.osName ? Device.osName : '';
        if (!userId) {
            Alert.alert('ID가 비어있습니다.');
            return;
        }
        if (!userPassword) {
            Alert.alert('PASSWORD가 비어있습니다.');
            return;
        }

        try {
            const loginResult = await LoginAPI(userId, userPassword, osName, buttonVisible,);
            //console.log('autoLogin', loginResult);
            if (loginResult == 0) {
                navigation.navigate('Day');
                setIsLoggedIn(true);
                setUserId('');
                setUserPassword('');
            } else {
                Alert.alert('아이디 또는 비밀번호가 틀립니다.');
                setButtonVisible(false);
                setUserId('');
                setUserPassword('');
            }
        } catch (error) {
            Alert.alert('로그인 중 오류가 발생했습니다.');
            console.error(error);
            setUserId('');
            setUserPassword('');
            setButtonVisible(false);
        }
    }

    const autoLogin = async () => {
        const savedUserId = await SecureStore.getItemAsync('saveUserId');
        const savedUserPass = await SecureStore.getItemAsync('saveUserPass');

        if (savedUserId && savedUserPass) {
            const osName = Device.osName ? Device.osName : '';
            try {
                const loginResult = await LoginAPI(savedUserId, savedUserPass, osName, true);
                //console.log('autoLogin', loginResult);
                if (loginResult == 0) {
                    navigation.navigate('Day');
                    setIsLoggedIn(true);
                    setUserId('');
                    setUserPassword('');
                } else {
                    Alert.alert('아이디 또는 비밀번호가 틀립니다.');
                    setModalVisible(true); // 로그인 실패 시 모달을 보여줍니다.
                    setUserId('');
                    setUserPassword('');
                }
            } catch (error) {
                Alert.alert('자동 로그인 중 오류가 발생했습니다.');
                console.error(error);
                setModalVisible(true);
                setUserId('');
                setUserPassword('');
            }
        } else {
            setModalVisible(true); // 저장된 로그인 정보가 없으면 모달을 보여줍니다.
        }
    };
    useEffect(() => {
        const passSave = async () => {
            const getPassSave = await AsyncStorage.getItem('passSave');
            if (getPassSave == '0') {
                AutoLoginAnimation();
            }
        }
        passSave();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: '#E3E8F7', }}>
            <View style={styles.loginBgContainer}>
                <Login_bg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                <View style={styles.overlay} />
            </View>
            <View style={styles.logoContainer}>
                <CalApp_logo />
            </View>
            <View style={styles.loginContainer}>
                <View style={styles.idView}>
                    <TextInput style={styles.textInput}
                        placeholder="아이디"
                        onChangeText={setUserId}
                        value={userId}>

                    </TextInput>
                </View>
                <View style={styles.passVIew}>
                    <TextInput style={styles.textInput}
                        secureTextEntry={true}
                        placeholder="비밀번호"
                        onChangeText={setUserPassword}
                        value={userPassword}>
                    </TextInput>
                </View>
                <TouchableOpacity onPress={LoginSubmit} style={styles.loginView}>
                    <Text style={styles.loginText}>
                        로그인
                    </Text>
                </TouchableOpacity>
                <View style={styles.touchable}>
                    <View style={styles.passView}>
                        <Text style={styles.textPass}>
                            비밀번호 저장
                        </Text>
                    </View>
                    <TouchableOpacity onPress={StartAnimation}>
                        <View style={{
                            justifyContent: 'center', borderRadius: 25,
                            width: 30, height: 20, top: 2, backgroundColor: buttonVisible ? Colors.skyBlue : Colors.dark
                        }}>
                            <Animated.View style={[buttonOnOff, { transform: [{ translateX }] }]}>
                            </Animated.View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    loginBgContainer: {
        position: 'absolute', // 부모 컨테이너를 화면 위에 고정
        top: 0,               // 위쪽 여백 제거
        left: 0,              // 왼쪽 여백 제거
        right: 0,             // 오른쪽 여백 제거
        bottom: 0,            // 아래쪽 여백 제거
        width: '100%',        // 가로 크기 100%
        height: '107%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black', // 어두운 색상
        opacity: 0.3,            // 투명도 (0.1 ~ 1.0)
    },
    logoContainer: {
        top: '20%',
    },
    textInput: {
        height: 40,
        marginLeft: 5,
    },
    loginContainer: {
        top: '20%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    idView: {
        top: '40%',
        borderWidth: 1,
        borderRadius: 8,
        width: '80%',
        borderColor: '#fff',
        backgroundColor: '#fff',
    },
    passVIew: {
        top: '50%',
        borderWidth: 1,
        borderRadius: 8,
        width: '80%',
        borderColor: '#fff',
        backgroundColor: '#fff',
    },
    loginView: {
        top: '72%',
        borderWidth: 1,
        borderRadius: 8,
        width: '80%',
        backgroundColor: '#003D90',
        borderColor: '#003D90',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    buttonOn: {
        width: 10,
        height: 10,
        backgroundColor: Colors.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    buttonOff: {
        width: 10,
        height: 10,
        backgroundColor: Colors.gray,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 5,
    },
    touchable: {
        top: '80%',
        flexDirection: 'row',
        left: '25%'
    },
    passView: {
        right: '2%'
    },
    textPass: {
        color: '#fff'
    }
});

export default MainLoginPage;