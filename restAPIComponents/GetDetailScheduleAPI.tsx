import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


const GetDetailScheduleAPI = async (scheduleId) => {
    const APIURL = process.env.EXPO_PUBLIC_API_URL;
    try {
        const getDetailScheduleUrl = APIURL + '/mobile/ezSchedule/' + scheduleId + '/mDetailSchedule.do';
        const loginCookie = await SecureStore.getItemAsync('loginCookie');
        const response = await axios.get(getDetailScheduleUrl, {
            headers: {
                'Cookie': loginCookie
            }
        });
        //console.log(response)
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}

export default GetDetailScheduleAPI;