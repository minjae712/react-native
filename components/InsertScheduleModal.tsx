import React, { useState, useEffect } from "react";
import {
    View,
    Modal,
    TextInput,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import StartDayCalendar from "./StartDayCalendar";
import RepeatSchedule from "./RepeatSchedule";
import WriteGetGroupList from "./WriteGetGroupList";
import dayjs from "dayjs"; // Use dayjs for date formatting
import PostScheduleAPI from "../restAPIComponents/PostScheduleAPI";
import GetGroupListAPI from "../restAPIComponents/GetGroupListAPI";
import UpdateScheduleAPI from "@/restAPIComponents/UpdateScheduleAPI";
import IClose from '../assets/images/i_close.svg'

interface InsertScheduleModalProps {
    visible: boolean;
    onClose: () => void;
}
// 기본값 "add", 수정 모드일 때 "edit"
const InsertScheduleModal = ({ visible, onClose, mode = "add", existingData = null, // 수정 시 전달될 기존 데이터
}: {
    visible: boolean; onClose: () => void; mode?: "add" | "edit";
    existingData?: {
        scheduleId: string;
        title: string;
        location: string;
        content: string;
        startDate: string;
        endDate: string;
        isPublic: boolean;
        importance: string;
    } | null;
}) => {
    const [scheduleId, setScheduleId] = useState("");
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [content, setContent] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(
        new Date(new Date().getTime() + 60 * 60 * 1000)
    ); // Default to 1 hour later
    const [priority, setPriority] = useState("보통");

    useEffect(() => {
        if (visible && mode === "edit" && existingData) {
            setTitle(existingData.title || "");
            setLocation(existingData.location || "");
            setContent(existingData.content || "");
            setStartDate(new Date(existingData.startDate));
            setEndDate(new Date(existingData.endDate));
            setScheduleId(existingData.scheduleId);
            console.log();
        } else if (visible && mode === "add") {
            // Reset fields for new schedule
            const now = new Date();
            now.setSeconds(0, 0);
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
            setTitle("");
            setLocation("");
            setContent("");
            setStartDate(now);
            setEndDate(oneHourLater);
        }
        console.log(mode, existingData);
    }, [visible, mode, existingData]);


    const formatDate = (date: Date): string => dayjs(date).format("YYYY-MM-DD HH:mm");

    const insertSchedule = async () => {
        if (!title || !startDate || !endDate) {
            alert("제목, 시작일, 종료일은 필수 입력 사항입니다.");
            return;
        }

        const groupList = await GetGroupListAPI();
        if (groupList.code === 0) {
            const ownerIds = groupList.data.map((item) => item.ownerId);
            console.log("ownerIds:", ownerIds);
        }

        const payload = {
            ownerId: "gisa1",
            ownerName: "기사일",
            scheduleType: "1",
            importance: "2",
            isPublic: 2,
            dateType: "1",
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            title,
            location,
            content,
            addDeptSch: "Y",
            repetitionCycle: "",
            cycleSet: "",
        };

        try {
            let response = {}
            if (mode === 'edit' && scheduleId) {
                payload.scheduleId = scheduleId;
                console.log('sd', content);
                response = await UpdateScheduleAPI(payload);
            } else if (mode === 'add') {
                response = await PostScheduleAPI(payload);
            }
            console.log("Schedule added successfully:", response);
            alert("Schedule registered successfully!");
            onClose(); // Close the modal
        } catch (error) {
            console.error("Failed to insert schedule:", error);
            alert("Failed to register schedule. Please try again.");
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    backgroundColor: Colors.white,
                }}
            >
                <View style={{ flex: 1, marginTop: 15, width: "100%" }}>
                    <View
                        style={{
                            width: "100%",
                            justifyContent: "space-between",
                            flexDirection: "row",
                        }}
                    >
                        <TouchableOpacity style={{ marginLeft: 15, marginTop: 50 }} onPress={onClose}>
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
                            onPress={insertSchedule}
                        >
                            <Text
                                style={{
                                    marginLeft: 11,
                                    marginTop: 5,
                                    color: "#003D90",
                                    fontSize: 17,
                                }}
                            >
                                등록
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        borderBottomWidth: 1,
                        marginTop: 15,
                        width: "100%",
                        borderColor: Colors.skyBlue,
                    }}
                    />
                    <ScrollView style={{ width: "100%", flex: 1 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                borderColor: Colors.skyBlue,
                                borderWidth: 0,
                                height: 50,
                                alignItems: "center",
                            }}
                        >
                            <TextInput
                                placeholder="위치를 입력하세요."
                                value={location}
                                onChangeText={setLocation}
                                style={{
                                    fontSize: 20,
                                    color: Colors.black,
                                    height: 50,
                                    paddingHorizontal: 20,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                borderColor: Colors.skyBlue,
                                borderWidth: 0,
                                height: 50,
                                alignItems: "center",
                            }}
                        >
                            <TextInput
                                placeholder="제목을 입력하세요."
                                value={title}
                                onChangeText={setTitle}
                                style={{
                                    fontSize: 20,
                                    color: Colors.black,
                                    height: 50,
                                    paddingHorizontal: 20,
                                }}
                            />
                        </View>
                        <StartDayCalendar
                            startDate={startDate}
                            setStartDate={(date) => {
                                const updatedDate = new Date(date);
                                const minutes = updatedDate.getMinutes();
                                updatedDate.setMinutes(
                                    minutes < 15 || minutes >= 45 ? 0 : 30
                                );
                                updatedDate.setSeconds(0, 0); // Normalize seconds and milliseconds
                                setStartDate(updatedDate);

                                // Ensure endDate is at least 1 hour after startDate
                                const minimumEndDate = new Date(updatedDate.getTime() + 60 * 60 * 1000);
                                if (endDate <= updatedDate) {
                                    setEndDate(minimumEndDate);
                                }
                            }}
                            endDate={endDate}
                            setEndDate={(date) => {
                                const updatedDate = new Date(date);
                                const minutes = updatedDate.getMinutes();
                                updatedDate.setMinutes(
                                    minutes < 15 || minutes >= 45 ? 0 : 30
                                );
                                updatedDate.setSeconds(0, 0); // Normalize seconds and milliseconds

                                // Prevent endDate from being earlier than or equal to startDate
                                if (updatedDate > startDate) {
                                    setEndDate(updatedDate);
                                } else {
                                    alert("종료일은 시작일보다 늦어야 합니다.");
                                }
                            }}
                        />

                        <View
                            style={{
                                borderBottomWidth: 1,
                                padding: 10,
                                borderColor: Colors.skyBlue,
                            }}
                        />
                        <RepeatSchedule />
                        <View
                            style={{
                                borderBottomWidth: 1,
                                padding: 10,
                                borderColor: Colors.skyBlue,
                            }}
                        />
                        <WriteGetGroupList />
                        <View>
                            <TextInput
                                placeholder="본문을 입력하세요."
                                value={content}
                                onChangeText={setContent}
                                style={{
                                    fontSize: 20,
                                    color: Colors.black,
                                    height: 50,
                                    paddingHorizontal: 20,
                                }}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default InsertScheduleModal;
