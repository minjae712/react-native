import { Colors } from "@/constants/Colors";
import React, { useState, useMemo } from "react";
import { useColorScheme, TouchableOpacity, Modal, View, Text, Image, SafeAreaView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RadioGroup from 'react-native-radio-buttons-group';
import Checkbox from 'expo-checkbox';
import dayjs from "dayjs";
import DropDownPicker from 'react-native-dropdown-picker';
import IRepetition from '../assets/images/i_repetition.svg';

const RepeatSchedule = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [modalVisible, setModalVisivle] = useState(false);
    const [selectBoxOpen, setSelectBoxOpen] = useState(false);
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const [date, setDate] = useState(new Date());
    const [selectValue, setSelectValue] = useState('1');
    const [selectValue1, setSelectValue1] = useState(days[date.getDay()]);
    const [repetitionCycleId, setRepetitionCycleId] = useState('0');
    const [selectDay, setSelectDay] = useState('0d');
    const [dayValue, setDayValue] = useState('1');
    const [weekValue, setWeekValue] = useState('1');
    const [selectMonth, setSelectMonth] = useState('1');
    const [monthValue, setMonthValue] = useState('1');
    const [monthDayValue, setMonthDayValue] = useState(String(dayjs(new Date()).format('DD')));
    const [monthvalue1, setMonthValue1] = useState('1');

    const [isChecked0, setChecked0] = useState(false);
    const [isChecked1, setChecked1] = useState(false);
    const [isChecked2, setChecked2] = useState(false);
    const [isChecked3, setChecked3] = useState(false);
    const [isChecked4, setChecked4] = useState(false);
    const [isChecked5, setChecked5] = useState(false);
    const [isChecked6, setChecked6] = useState(false);

    const [items, setItems] = useState([
        { label: '첫째', value: '1' },
        { label: '둘째', value: '2' },
        { label: '셋째', value: '3' },
        { label: '마지막', value: '4' }
    ]);


    const radioButtons = useMemo(() => ([
        {
            id: '0',
            label: '매일',
            value: '0'
        },
        {
            id: '1',
            label: '매주',
            value: '1'
        },
        {
            id: '2',
            label: '매월',
            value: '2'
        },
        {
            id: '3',
            label: '매년',
            value: '3'
        }
    ]), []);

    const selectDays = useMemo(() => ([
        {
            id: '0d',
            value: '0'
        },
        {
            id: 'everyDay',
            value: '0'
        }
    ]), []);

    const selectMonths = useMemo(() => ([
        {
            id: '1',
            value: '1'
        },
        {
            id: '2',
            value: '2'
        }
    ]), []);
    // 매일, 매주, 매월, 매년 라디오 버튼
    function onPressRadioButton(buttonVal: string) {
        setRepetitionCycleId(buttonVal);
    };

    // 매일의 라디오 버튼
    function onPressRadioEveryDayButton(buttonVal: string) {
        setSelectDay(buttonVal);
    };

    // 매월의 라디오 버튼
    function onPressRadioMonthButton(buttonVal: string) {
        setSelectMonth(buttonVal);
    };

    const onChangeDayText = (inputText: string) => {
        setDayValue(inputText);
    };

    const onChangeWeekText = (inputText: string) => {
        setWeekValue(inputText);
    };

    const onChangeMonthText = (inputText: string) => {
        setMonthValue(inputText);
    }

    const onChangeMonth1Text = (inputText: string) => {
        setMonthValue1(inputText);
    }

    const onChangeMonthDayText = (inputText: string) => {
        setMonthDayValue(inputText);
    }

    const opneModal = () => {
        setModalVisivle(true);
    }
    const closeModal = () => {
        setModalVisivle(false);
    }

    return (
        <SafeAreaView>
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={opneModal}>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View style={{ marginLeft: 20 }}>
                            <IRepetition />
                        </View>
                        <View style={{ marginLeft: 20, marginTop: '-2%' }}>
                            <Text style={{ fontSize: 20 }}>
                                반복 설정
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                    statusBarTranslucent={true}
                >
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
                                <TouchableOpacity
                                    style={{ marginLeft: 15, marginTop: 50 }}
                                    onPress={closeModal}
                                >
                                    <IRepetition />
                                </TouchableOpacity>
                                <Text style={{ color: isDarkMode ? Colors.dark : Colors.dark, fontSize: 20, marginTop: 50, marginLeft: 20 }}>
                                    반복 설정
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        marginLeft: 180,
                                        borderRadius: 50,
                                        width: 50,
                                        height: 35,
                                        marginTop: 50,
                                        backgroundColor: isDarkMode ? Colors.skyBlue : Colors.primary
                                    }}
                                    onPress={closeModal}
                                >
                                    <Text style={{ marginLeft: 11, marginTop: 5, color: isDarkMode ? Colors.black : Colors.white, fontSize: 15 }}>
                                        완료
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ marginTop: 20, color: isDarkMode ? Colors.white : Colors.black, fontSize: 15 }}>
                                반복주기
                            </Text>
                            <View style={{ borderWidth: 1, width: 380, height: 200, borderColor: isDarkMode ? Colors.white : Colors.black, marginTop: 10 }}>
                                <View style={{ borderBottomWidth: 1, width: 380, borderColor: isDarkMode ? Colors.white : Colors.black }}>
                                    <RadioGroup layout="row"
                                        radioButtons={radioButtons.map(rb => ({ ...rb, size: 30, labelStyle: { color: isDarkMode ? Colors.white : Colors.black } }))}
                                        onPress={onPressRadioButton}
                                        selectedId={repetitionCycleId}
                                    />
                                </View>
                                {repetitionCycleId === '0' &&
                                    <View>
                                        <View style={{ alignItems: 'flex-start', marginTop: 25, flexDirection: 'row' }}>
                                            <RadioGroup
                                                radioButtons={selectDays.map(rb => ({ ...rb, size: 30, labelStyle: { color: isDarkMode ? Colors.white : Colors.black } }))}
                                                onPress={onPressRadioEveryDayButton}
                                                selectedId={selectDay}
                                            />

                                            <TextInput style={{
                                                color: isDarkMode ? Colors.white : Colors.black,
                                                borderWidth: 1,
                                                borderColor: isDarkMode ? Colors.white : Colors.black,
                                                width: 60, fontSize: 20, marginTop: 5
                                            }}
                                                keyboardType="number-pad"
                                                maxLength={2}
                                                onChangeText={onChangeDayText}
                                                value={dayValue}
                                                textAlign="center"
                                            >
                                            </TextInput>
                                            <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontSize: 20, marginLeft: 10, marginTop: 5 }}>
                                                일마다
                                            </Text>
                                        </View>
                                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontSize: 20, marginLeft: 50, marginTop: 70, position: 'absolute' }}>
                                            매일(평일)
                                        </Text>
                                    </View>
                                }
                                {repetitionCycleId === '1' &&
                                    <View style={{ margin: 20 }}>
                                        <Text style={{
                                            color: isDarkMode ? Colors.white : Colors.black,
                                            fontSize: 20,
                                        }} >
                                            매             주 마다 다음 요일에 되풀이
                                        </Text>
                                        <TextInput style={{
                                            borderWidth: 1, width: 60, borderColor: isDarkMode ? Colors.white : Colors.black,
                                            position: 'absolute', marginLeft: 20, color: isDarkMode ? Colors.white : Colors.black, fontSize: 20
                                        }}
                                            keyboardType="number-pad"
                                            maxLength={2}
                                            onChangeText={onChangeWeekText}
                                            value={weekValue}
                                            textAlign="center"
                                        >
                                        </TextInput>
                                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                            <Checkbox style={{ marginTop: 5 }}
                                                value={isChecked0} onValueChange={setChecked0}
                                            />
                                            <Text style={{
                                                color: isDarkMode ? Colors.white : Colors.black,
                                                fontSize: 20, marginLeft: 5
                                            }} >
                                                일요일
                                            </Text>
                                            <Checkbox style={{ marginTop: 5, marginLeft: 10 }}
                                                value={isChecked1} onValueChange={setChecked1}
                                            />
                                            <Text style={{
                                                color: isDarkMode ? Colors.white : Colors.black,
                                                fontSize: 20, marginLeft: 5
                                            }} >
                                                월요일
                                            </Text>
                                            <Checkbox style={{ marginTop: 5, marginLeft: 10 }}
                                                value={isChecked2} onValueChange={setChecked2}
                                            />
                                            <Text style={{
                                                color: isDarkMode ? Colors.white : Colors.black,
                                                fontSize: 20, marginLeft: 5
                                            }} >
                                                화요일
                                            </Text>
                                            <Checkbox style={{ marginTop: 5, marginLeft: 10 }}
                                                value={isChecked3} onValueChange={setChecked3}
                                            />
                                            <Text style={{
                                                color: isDarkMode ? Colors.white : Colors.black,
                                                fontSize: 20, marginLeft: 5
                                            }} >
                                                수요일
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <Checkbox style={{ marginTop: 5 }}
                                                value={isChecked4} onValueChange={setChecked4}
                                            />
                                            <Text style={{
                                                color: isDarkMode ? Colors.white : Colors.black,
                                                fontSize: 20, marginLeft: 5
                                            }} >
                                                목요일
                                            </Text>
                                            <Checkbox style={{ marginTop: 5, marginLeft: 10 }}
                                                value={isChecked5} onValueChange={setChecked5}
                                            />
                                            <Text style={{
                                                color: isDarkMode ? Colors.white : Colors.black,
                                                fontSize: 20, marginLeft: 5
                                            }} >
                                                금요일
                                            </Text>
                                            <Checkbox style={{ marginTop: 5, marginLeft: 10 }}
                                                value={isChecked6} onValueChange={setChecked6}
                                            />
                                            <Text style={{
                                                color: isDarkMode ? Colors.white : Colors.black,
                                                fontSize: 20, marginLeft: 5
                                            }} >
                                                토요일
                                            </Text>
                                        </View>
                                    </View>
                                }
                                {repetitionCycleId === '2' &&
                                    <View style={{ alignItems: 'flex-start', marginTop: 25, flexDirection: 'row' }}>
                                        <RadioGroup
                                            radioButtons={selectMonths.map(rb => ({ ...rb, size: 30, labelStyle: { color: isDarkMode ? Colors.white : Colors.black } }))}
                                            onPress={onPressRadioMonthButton}
                                            selectedId={selectMonth}
                                        />
                                        <Text style={{
                                            color: isDarkMode ? Colors.white : Colors.black,
                                            fontSize: 20, marginTop: 5
                                        }}>
                                            날짜           개월마다           일에
                                        </Text>
                                        <TextInput style={{
                                            color: isDarkMode ? Colors.white : Colors.black, position: 'absolute',
                                            borderWidth: 1, marginLeft: 90,
                                            borderColor: isDarkMode ? Colors.white : Colors.black,
                                            width: 50, fontSize: 20, marginTop: 5
                                        }}
                                            keyboardType="number-pad"
                                            maxLength={2}
                                            onChangeText={onChangeMonthText}
                                            value={monthValue}
                                            textAlign="center"
                                        ></TextInput>
                                        <TextInput style={{
                                            color: isDarkMode ? Colors.white : Colors.black, position: 'absolute',
                                            borderWidth: 1, marginLeft: 220,
                                            borderColor: isDarkMode ? Colors.white : Colors.black,
                                            width: 50, fontSize: 20, marginTop: 5
                                        }}
                                            keyboardType="number-pad"
                                            maxLength={2}
                                            onChangeText={onChangeMonthDayText}
                                            value={monthDayValue}
                                            textAlign="center"
                                        ></TextInput>
                                        <Text style={{
                                            position: 'absolute',
                                            color: isDarkMode ? Colors.white : Colors.black,
                                            fontSize: 20, marginTop: 40, marginLeft: 50
                                        }}>
                                            요일           개월마다           에
                                        </Text>
                                        <TextInput style={{
                                            color: isDarkMode ? Colors.white : Colors.black, position: 'absolute',
                                            borderWidth: 1, marginLeft: 90,
                                            borderColor: isDarkMode ? Colors.white : Colors.black,
                                            width: 50, fontSize: 20, marginTop: 40
                                        }}
                                            keyboardType="number-pad"
                                            maxLength={2}
                                            onChangeText={onChangeMonth1Text}
                                            value={monthvalue1}
                                            textAlign="center"
                                        ></TextInput>
                                        <View style={{
                                            backgroundColor: isDarkMode ? Colors.white : Colors.black,
                                            position: 'absolute', width: 100, marginLeft: 100, marginTop: 70, height: 0
                                        }}>
                                            <DropDownPicker
                                                open={selectBoxOpen}
                                                value={selectValue}
                                                items={items}
                                                placeholder="첫째"
                                                setOpen={setSelectBoxOpen}
                                                setValue={setSelectValue}
                                                setItems={setItems}
                                            />
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Modal>
            </View >
        </SafeAreaView >
    )
}



export default RepeatSchedule;