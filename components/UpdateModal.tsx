import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, ScrollView, TextInput } from "react-native";
import IClose from '../assets/images/i_close.svg'
import { Colors } from "@/constants/Colors";
import { Picker } from '@react-native-picker/picker';
import StartDayCalendar from "./StartDayCalendar";
import RepeatSchedule from "./RepeatSchedule";
import WriteGetGroupList from "./WriteGetGroupList";

const UpdateModal = ({ getCloseModal, scheduleId, title, creatorName, createDate, isPublic, importance, startDate, endDate }) => {
    console.log(getCloseModal, scheduleId, title, creatorName, createDate, isPublic, importance, startDate, endDate);
    const [modalVisible, setModalVisivle] = useState(true);
    const [priority, setPriority] = useState("보통");

    const closeModal = () => {
        setModalVisivle(false);
        getCloseModal();
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
            statusBarTranslucent={true}
        >

            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: Colors.white }}>
                <View style={{ flex: 1, width: '100%' }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                        <TouchableOpacity
                            style={{ marginLeft: 15, marginTop: 50 }}
                            onPress={closeModal}
                        >
                            <IClose />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                marginRight: 15,
                                borderRadius: 50,
                                width: 50,
                                height: 35,
                                marginTop: 50,
                            }}

                        >
                            <Text style={{ marginLeft: 11, marginTop: 5, color: '#003D90', fontSize: 17 }}>
                                등록
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomWidth: 1, marginTop: 10, borderColor: '#E9E9E9' }} />
                    <ScrollView style={{ flex: 1, }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderColor: '#E9E9E9' }}>
                            <Text style={{ borderRightWidth: 1, borderColor: '#E9E9E9', fontSize: 15, width: 20, marginLeft: 5 }}>
                                위치
                            </Text>
                            <TextInput
                                keyboardType="default"
                                maxLength={30}
                                style={{
                                    marginHorizontal: 5, // 좌우 간격 설정
                                    fontSize: 15,
                                    textAlignVertical: 'center', // 세로 중앙 정렬
                                    width: '75%'
                                }}
                            />
                            <Picker
                                selectedValue={priority}
                                style={{ width: 110 }}
                                onValueChange={(itemValue) => setPriority(itemValue)}
                            >
                                <Picker.Item label="낮음" value="1" />
                                <Picker.Item label="보통" value="2" />
                                <Picker.Item label="높음" value="3" />
                            </Picker>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#E9E9E9' }} />
                        <View style={{}}>
                            <TextInput
                                placeholder="제목을 입력하세요."
                                maxLength={30}
                                multiline={true}
                                keyboardType="default"
                                style={{
                                    marginHorizontal: 20, // 좌우 간격 설정
                                    marginTop: 10,        // 위쪽 간격 추가
                                    fontSize: 20,
                                    textAlignVertical: 'center', // 세로 중앙 정렬
                                }}
                            />
                        </View>
                        <View style={{ borderBottomWidth: 1, padding: 5, borderColor: '#E9E9E9' /*borderBottomColor: Colors.gray*/ }}>
                        </View>
                        <StartDayCalendar />
                        <View style={{ borderBottomWidth: 1, padding: 10, borderColor: '#E9E9E9' }} />
                        <RepeatSchedule />
                        <View style={{ borderBottomWidth: 1, padding: 10, borderColor: '#E9E9E9' }} />
                        <WriteGetGroupList />
                    </ScrollView>
                </View>
            </View >
        </Modal >
    )
}


export default UpdateModal;