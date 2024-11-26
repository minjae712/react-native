import React, { useState, useCallback } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import Iclose from '../assets/images/i_close.svg';
import GetDetailScheduleAPI from '../restAPIComponents/GetDetailScheduleAPI';
import DeleteScheduleAPI from "@/restAPIComponents/DeleteScheduleAPI";
import UpdateModal from "./UpdateModal";
import InsertScheduleModal from "./InsertScheduleModal";

const DetailModal = ({ scheduleId, startDate, endDate, groupColor, closeModal }) => {
    const [modalVisible, setModalVisible] = useState(true);
    const [getLocation, setGetLocation] = useState('');
    const [getTitle, setGetTitle] = useState('');
    const [getDetail, setGetDetail] = useState('');
    const [getAttendantNames, setGetAttendantNames] = useState([]);
    const [createName, setCreateName] = useState('');
    const [isPublic, setIsPublic] = useState('');
    const [importance, setImportance] = useState('');
    const [createDate, setCreateDate] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [detailList, setDetailList] = useState({});

    const month = moment(startDate).format('MM');
    const week = moment(startDate).format('DD');
    const toDay = moment(startDate).format('dd');
    const startTime = moment(startDate).format('HH:mm');
    const endTime = moment(endDate).format('HH:mm');

    const handleClose = () => {
        setModalVisible(false);
        closeModal();
    };


    useFocusEffect(
        useCallback(() => {
            const getDetailSchedule = async () => {
                try {
                    const getDetailList = await GetDetailScheduleAPI(scheduleId);
                    setDetailList(getDetailList.scheduleInfo);
                    const regex = />([^<]*)</g;
                    const matchGetDetail = getDetailList.scheduleInfo.content.match(regex);
                    // 정규식으로 텍스트 추출
                    if (getDetailList.attendantList) {
                        const attendantNames = getDetailList.attendantList.map(item =>
                        ({
                            name: item.attendantName,
                            status: item.status
                        }));
                        setGetAttendantNames(attendantNames);
                    }
                    if (matchGetDetail) {
                        const extractedText = matchGetDetail.map(item => item.replace(/>|</g, '').trim());
                        setGetDetail(extractedText.join("\n").trim());
                    }
                    setGetLocation(getDetailList.scheduleInfo.location);
                    setGetTitle(getDetailList.scheduleInfo.title);
                    setIsPublic(getDetailList.scheduleInfo.isPublic);
                    setCreateName(getDetailList.scheduleInfo.creatorName);
                    setImportance(getDetailList.scheduleInfo.importance);
                    setCreateDate(moment(getDetailList.scheduleInfo.createDate).format('YYYY-MM-DD HH:mm'));

                } catch (error) {
                    console.error('API 호출 에러:', error);
                }
            };
            getDetailSchedule();
        }, [scheduleId])
    );

    const detailDelete = () => {
        Alert.alert(
            "삭제 확인",
            "이 일정을 삭제하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                },
                {
                    text: "확인",
                    onPress: async () => {
                        const deleteYn = await DeleteScheduleAPI(scheduleId, '', '', '', '');
                        if (deleteYn == 'ok') {
                            console.log("일정이 삭제되었습니다.");
                            handleClose(); // 삭제 후 모달 닫기
                        } else {
                            Alert.alert('삭제에 실패하였습니다.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );

    };

    const detailUpdate = () => {
        setIsModalVisible(true);
    }

    const getCloseModal = () => {
        setIsModalVisible(false);

    };


    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleClose}
                statusBarTranslucent={true}
            >
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    <View style={{ flexDirection: 'row', marginTop: '15%', }}>
                        <View style={{ marginLeft: '5%' }}>
                            <TouchableOpacity onPress={handleClose} style={{}}>
                                <Iclose />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: '60%' }}>
                            <TouchableOpacity onPress={detailUpdate}>
                                <Text>
                                    수정
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: '5%' }}>
                            <TouchableOpacity onPress={detailDelete}>
                                <Text>
                                    삭제
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: '5%', marginLeft: '5%' }}>
                        <View style={{ marginTop: -7 }}>
                            <Text>위치: </Text>
                        </View>
                        <View style={{ marginTop: -7 }}>
                            <Text>{getLocation}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: '5%', marginLeft: '5%' }}>
                        <View style={{ backgroundColor: groupColor, width: 20, height: 20, borderRadius: 5 }} />
                        <View style={{ marginLeft: '5%', marginTop: -7 }}>
                            <Text style={{ fontSize: 20, textAlign: 'center' }}>
                                {getTitle}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.viewContainer, { flexDirection: 'row' }]}>
                        <View>
                            <Text style={{ fontSize: 12 }}>
                                작성자: {createName}
                            </Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 12, marginLeft: '45%' }}>
                                {createDate}
                            </Text>
                        </View>
                    </View>
                    <View style={{ marginTop: '1%', marginLeft: '10%' }}>
                        <Text style={{ fontSize: 12, }}>
                            {isPublic == 'N' ? '비공개' : '공개'}
                        </Text>
                    </View>
                    <View style={{ marginTop: '1%', marginLeft: '10%' }}>
                        <Text style={{ fontSize: 12, }}>
                            {importance == '1' ? '낮음' : importance == '2' ? '보통' : '높음'}
                        </Text>
                    </View>
                    <View style={styles.viewContainer}>
                        <Text style={{ fontSize: 12, }}>기간 : {month}월 {week}일 {toDay}요일  {startTime} ~ {endTime}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: '10%', marginTop: '5%', maxHeight: 60 }}>
                        {getAttendantNames.length > 0 && (
                            getAttendantNames.map((attendant, index) => (
                                <Text key={index} style={{ fontSize: 12, }} numberOfLines={3}>
                                    {index === 0 ? '참석자 : ' : ''}
                                    {attendant.name}{
                                        attendant.status === "0" ? "(미정)" :
                                            attendant.status === "1" ? "(초대수락)," :
                                                attendant.status === "2" ? "(초대거절)," : ""
                                    }
                                    {index < getAttendantNames.length - 1 ? ',' : ''}
                                </Text>
                            ))
                        )}
                    </View>
                    <View style={{ borderBottomWidth: 1, marginTop: '5%', marginLeft: '5%', width: '90%' }} />
                    <View style={{ marginTop: '5%', marginLeft: '5%' }}>
                        <Text>
                            {getDetail}
                        </Text>
                    </View>
                </View>
            </Modal >
            {
                isModalVisible && (
                    <InsertScheduleModal
                        visible={isModalVisible}
                        onClose={getCloseModal}
                        mode="edit"
                        existingData={{
                            scheduleId: detailList.scheduleId,
                            title: detailList.title,
                            location: detailList.location,
                            content: getDetail,
                            startDate: detailList.startDate,
                            endDate: detailList.endDate,
                            isPublic: detailList.isPublic === "Y",
                            importance: detailList.importance,
                        }}
                    />
                )
            }

        </>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        marginTop: '5%',
        marginLeft: '10%',
    },
});

export default DetailModal;