import React, { useRef, useState } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, View, useColorScheme, Image } from 'react-native';
import { Colors } from "@/constants/Colors";
import IAllDay from '../assets/images/i_allday.svg'

const MovingButton = ({ ButtonOnOffParam }) => {
    // 애니메이션 값 초기화
    const translateX = useRef(new Animated.Value(0)).current;
    const [buttonVisible, setButtonVisible] = useState(false);
    const buttonOnOff = (buttonVisible ? styles.buttonOn : styles.buttonOff);

    // 버튼 클릭 시 애니메이션 실행
    const StartAnimation = () => {
        if (buttonVisible === false) {
            setButtonVisible(true);

            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 30, // 오른쪽으로 이동할 거리
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
        return (
            ButtonOnOffParam(buttonVisible)
        )
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={StartAnimation}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '5%', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                        <IAllDay />
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 200 }}>
                        <Text style={{ fontSize: 20, color: Colors.dark }}>
                            종일
                        </Text>
                    </View>
                    <View style={{
                        justifyContent: 'center', borderRadius: 25,
                        width: '15%', height: 30, marginLeft: 20, backgroundColor: buttonVisible ? Colors.skyBlue : Colors.dark
                    }}>
                        <Animated.View style={[buttonOnOff, { transform: [{ translateX }] }]}>
                            <Text style={styles.text}></Text>
                        </Animated.View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonOn: {
        width: 20,
        height: 20,
        backgroundColor: Colors.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: - 5,
    },
    buttonOff: {
        width: 20,
        height: 20,
        backgroundColor: Colors.gray,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 5,
    },
    touchable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MovingButton;
