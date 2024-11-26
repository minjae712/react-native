import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import GetGroupListAPI from "@/restAPIComponents/GetGroupListAPI";
import IArrowWrite from '../assets/images/i_arrow_write.svg'
import { Colors } from "@/constants/Colors";

const WriteGetGroupList = ({ }) => {
    const [groupList, setGroupList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const translateX = useRef(new Animated.Value(0)).current;
    const [buttonVisible, setButtonVisible] = useState(true);

    const buttonOnOff = (buttonVisible ? styles.buttonOn : styles.buttonOff);

    // 버튼 클릭 시 애니메이션 실행
    const StartAnimation = () => {
        if (buttonVisible === true) {
            setButtonVisible(false);

            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 10, // 오른쪽으로 이동할 거리
                    duration: 50, // 애니메이션 시간
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            setButtonVisible(true);
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 0, // 원래 위치로 복귀
                    duration: 50, // 애니메이션 시간
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const toggleModal = useCallback(() => {
        setModalVisible((prevState) => !prevState);
    }, []);

    useEffect(() => {
        const fetchGroupList = async () => {
            try {
                const getGroupList = await GetGroupListAPI();
                const validGroups = getGroupList.data.filter(group =>
                    group.scheduleType !== '');
                if (validGroups.length > 0) {
                    setGroupList(validGroups);
                    setSelectedGroup(validGroups[0]);
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchGroupList();
    }, []);

    const handleGroupSelect = (group) => {
        console.log(group);
        setSelectedGroup(group);
        toggleModal();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleModal} style={styles.selectedGroup}>
                <View style={[styles.colorBar, { backgroundColor: selectedGroup.typeColor }]} />
                <Text style={styles.groupName}>{selectedGroup.typeName}</Text>
                <IArrowWrite style={modalVisible ? styles.arrowUp : styles.arrowDown} />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                visible={modalVisible}
                transparent={true}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {groupList.map((group, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.groupItem}
                                    onPress={() => handleGroupSelect(group)}
                                >
                                    <View style={[styles.colorBar, { backgroundColor: group.typeColor }]} />
                                    <Text style={styles.groupName}>{group.typeName}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            {selectedGroup.scheduleType == '1' ?
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <View style={{ alignItems: 'flex-end', marginTop: -5 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700' }}>
                            부서일정 등록 여부
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.touchable} onPress={StartAnimation}>
                        <View style={{
                            justifyContent: 'center', borderRadius: 25,
                            width: 30, height: 20, backgroundColor: buttonVisible ? Colors.skyBlue : Colors.dark
                        }}>
                            <Animated.View style={[buttonOnOff, { transform: [{ translateX }] }]}>
                            </Animated.View>
                        </View>
                    </TouchableOpacity>
                </View> : ''}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    selectedGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
    },
    colorBar: {
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 4,
    },
    groupName: {
        flex: 1,
        fontSize: 15,
    },
    arrowDown: {
        transform: [{ rotate: '0deg' }],
    },
    arrowUp: {
        transform: [{ rotate: '180deg' }],
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '65%',
        maxHeight: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Android 그림자
        elevation: 5,
    },
    groupItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
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
        width: '15%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WriteGetGroupList;