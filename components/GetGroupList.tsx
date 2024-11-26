import React, { useState, useEffect, useCallback } from 'react';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { useNavigation, DrawerActions, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import GetGroupListAPI from "../restAPIComponents/GetGroupListAPI";
import { useAuth } from "../utils/AuthContext"; // Context 불러오기


interface GroupItem {
    ownerId: string;
    ownerName: string;
    scheduleType: string;
    typeName: string;
    typeColor: string;
}

type RootStackParamList = {
    Day: { checkedItem: { [x: number]: boolean } };
    Week: { checkedItem: { [x: number]: boolean } };
    Month: { checkedItem: { [x: number]: boolean } };
};

const GetGroupList = () => {
    const [getGroupList, setGetGroupList] = useState<GroupItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});
    const [ownerId, setOwnerId] = useState<{ [key: number]: string }>({});
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { isLoggedIn, setIsLoggedIn } = useAuth();


    useEffect(() => {
        if (isLoggedIn) {
            loginCheckYn();
        }
    }, [isLoggedIn]);


    async function loginCheckYn() {

        const groupList = await GetGroupListAPI();
        //console.log(groupList.code);
        if (groupList.code == 0) {
            setGetGroupList(groupList.data);

            const initialSelectedItems = groupList.data.reduce((acc, item, index) => {
                acc[index] = true;  // 모든 항목을 선택 상태로 설정
                return acc;
            }, {});
            const ownerId = groupList.data.reduce((acc, item) => {
                acc[Number(item.scheduleType)] = item.ownerId;
                return acc;
            }, {});

            setSelectedItems(initialSelectedItems);
            setOwnerId(ownerId);

            await AsyncStorage.setItem('selectedItems', JSON.stringify(initialSelectedItems));
            await AsyncStorage.setItem('initialOwnerId', JSON.stringify(ownerId));
        }

    }

    // 체크박스 선택 상태 변경 함수
    const toggleCheckbox = (index) => {
        setSelectedItems((prevSelectedItems) => {
            const updatedSelectedItems = { ...prevSelectedItems };

            if (index === 0) {
                // "모두 선택" 체크박스를 클릭한 경우: 전체 체크 또는 해제
                const allChecked = !prevSelectedItems[0];
                Object.keys(updatedSelectedItems).forEach((key) => {
                    updatedSelectedItems[key] = allChecked;
                });
            } else {
                // 개별 체크박스를 클릭한 경우: 해당 체크박스의 상태를 반전
                updatedSelectedItems[index] = !prevSelectedItems[index];

                // 모든 개별 체크박스가 선택되었는지 확인
                const allChecked = getGroupList.every((_, i) => i === 0 || updatedSelectedItems[i] === true);
                updatedSelectedItems[0] = allChecked; // 모든 체크박스가 선택되었으면 "모두 선택" 체크박스도 체크
            }
            //console.log('updatedSelectedItems', updatedSelectedItems);
            // AsyncStorage에 업데이트된 선택 상태를 저장
            AsyncStorage.setItem('selectedItems', JSON.stringify(updatedSelectedItems));

            const state = navigation.getState();
            const navigationName = String(state.history[0].key).split('-')[0];
            setTimeout(() => {
                if (navigationName == 'Day') {
                    (navigation.setParams as any)({ 'checkedItem': updatedSelectedItems });
                } else if (navigationName == 'Week') {
                    (navigation.setParams as any)({ 'checkedItem': updatedSelectedItems });
                } else {
                    (navigation.setParams as any)({ 'checkedItem': updatedSelectedItems });
                }

            }, 0);
            navigation.dispatch(DrawerActions.openDrawer());
            return updatedSelectedItems;
        });
    };



    return (
        <View>
            {getGroupList.map((item, index) => (
                <View key={index} >
                    <View style={{ padding: 15, flexDirection: 'row' }}>
                        <Checkbox
                            value={selectedItems[index]}
                            onValueChange={() => toggleCheckbox(index)}
                            color={selectedItems[index] ? item.typeColor : undefined}
                            style={{ backgroundColor: item.typeColor }} />
                        <View>
                            <Text style={styles.displayNone}>ID: {item.ownerId}</Text>
                            <Text style={styles.displayNone}>Name: {item.ownerName}</Text>
                            <Text style={styles.displayNone}>Schedule Type: {item.scheduleType}</Text>
                            <Text style={styles.textStyle}>{item.typeName}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    displayNone: {
        display: 'none'
    },
    textStyle: {
        fontWeight: '600',
        marginLeft: 10
    }
});

export default GetGroupList;