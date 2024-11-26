import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const DeleteScheduleAPI = async (scheduleId, delType, selectDate, startDate, dateType) => {
    const APIURL = process.env.EXPO_PUBLIC_API_URL;
    let params = {}
    try {
        const deleteScheduleUrl = APIURL + '/mobile/ezSchedule/' + scheduleId + '/mDeleteSchedule.do';
        const loginCookie = await SecureStore.getItemAsync('loginCookie');

        if (delType == '1') {
            params = { delType: delType, selectDate: selectDate, startDate: startDate, dateType: dateType };
        }

        const response = await axios.post(deleteScheduleUrl, params, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': loginCookie
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


export default DeleteScheduleAPI;