import React, { useState } from "react";
import {
    TouchableOpacity,
    View,
    SafeAreaView,
    TextInput,
    StyleSheet,
    Text,
    Modal,
    Alert,
    FlatList,
} from "react-native";
import SearchScheduleListAPI from '../restAPIComponents/SearchScheduleListAPI'
import DetailModal from './DetailModal';
import moment from 'moment';
import IClose from "../assets/images/i_close.svg";
import ISearchClose from "../assets/images/i_searchClose.svg";
import ISearch from "../assets/images/i_search.svg";

const SearchSchedule = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [text, onChangeText] = useState('');
    const [getSearchList, setGetSearchList] = useState([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndtDate, setSelectedEndtDate] = useState(null);
    const [selectedGroupColor, setSelectedGroupColor] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onPressModalOpen = () => setModalVisible(true);
    const onPressModalClose = () => {
        setModalVisible(false);
        onChangeText('');
        setGetSearchList([]);
    };

    const onPressReset = () => onChangeText('');

    const onPressSearch = async () => {
        const startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        if (text === '') {
            Alert.alert('검색어를 입력하세요.');
        } else {
            const getSearchLists = await SearchScheduleListAPI(startDate, endDate, text);
            setGetSearchList(getSearchLists);
        }
    };

    const detailEventPress = (item) => {
        setSelectedScheduleId(item.scheduleId);
        setSelectedStartDate(item.startDate);
        setSelectedEndtDate(item.endDate);
        setSelectedGroupColor(item.groupColor);
        setIsModalVisible(true);
    }

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedScheduleId(null);
        setSelectedStartDate(null);
        setSelectedEndtDate(null);
        setSelectedGroupColor(null);
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => detailEventPress(item)}>
            <View style={styles.itemContainer}>
                <View style={{ borderWidth: 7, borderColor: item.groupColor }}></View>
                <Text style={styles.itemType}>
                    {moment(item.startDate).format('MM')}월 {moment(item.startDate).format('DD')}일
                </Text>
                <Text style={styles.itemType}>
                    {item.scheduleType === '1' ? '개인'
                        : item.scheduleType === '2' ? '부서'
                            : item.scheduleType === '3' ? '회사'
                                : item.scheduleType === '7' ? '그룹일정'
                                    : '겸직부서'}
                </Text>
                <Text style={styles.itemText}>{item.ownerName}</Text>
                <Text style={styles.itemText}>{item.creatorName}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onPressModalOpen}>
                <View>
                    <ISearch />
                </View>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={onPressModalClose}
                statusBarTranslucent={true}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <TouchableOpacity onPress={onPressModalClose}>
                            <View style={styles.closeView}>
                                <IClose />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textContainer}>
                        <TextInput
                            placeholder="검색어를 입력하세요."
                            maxLength={30}
                            onChangeText={onChangeText}
                            value={text}
                            style={styles.textInput}
                        />
                        {text ? (
                            <TouchableOpacity onPress={onPressReset}>
                                <View style={styles.resetButton}>
                                    <ISearchClose />
                                </View>
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity onPress={onPressSearch} style={styles.searchButton}>
                            <ISearch />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.borderLine} />
                    <FlatList
                        data={getSearchList}
                        keyExtractor={(item) => item.scheduleId.toString()}
                        renderItem={renderItem}
                    />
                </SafeAreaView>
                {isModalVisible && (
                    <DetailModal
                        scheduleId={selectedScheduleId}
                        startDate={selectedStartDate}
                        endDate={selectedEndtDate}
                        groupColor={selectedGroupColor}
                        closeModal={closeModal}
                    />
                )}
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 25,
    },
    modalView: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#E9E9E9',
    },
    closeView: {
        marginTop: 5,
        marginLeft: 5,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 5,
    },
    resetButton: {
        padding: 5,
    },
    borderLine: {
        borderTopWidth: 1,
        borderColor: '#E9E9E9',
        marginVertical: 10,
    },
    searchButton: {
        padding: 5,
    },
    itemContainer: {
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#E9E9E9',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemType: {
        fontWeight: 'bold',
        marginLeft: '2%',
        textAlign: 'center',
    },
    itemText: {
        fontSize: 14,
        textAlign: 'center',
        marginLeft: '2%'
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: '2%',
        textAlign: 'center',
    },
});

export default SearchSchedule;
