import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const GetScheduleLists = async (startDate: string, endDate: string, scheduleType: []) => {
    //console.log('값이 들어왔냐, GetScheduleLists',startDate, endDate, scheduleType);
    try {
        const APIURL = process.env.EXPO_PUBLIC_API_URL;
        //const testURL = process.env.EXPO_PUBLIC_TEST_API_URL;
        const typeList = [];
        let params = {};
        //console.log('scheduleType', scheduleType);
        if (Array.isArray(scheduleType) && scheduleType.length > 0) {
            if (scheduleType[0][0] == 0) {
                //console.log('전체 가져오기');
                params = { startDate: startDate, endDate: endDate, };
            } else {
                //console.log('부분가져오기');
                scheduleType.forEach((item, index) => {
                    const objValue = { 'scheduleType': item[0], 'ownerId': item[1] };
                    typeList.push(objValue);
                });
                params = { startDate: startDate, endDate: endDate, typeList: typeList }
                //console.log('params', params);
            }
        } else {
            //console.log('빈껍데기');
            params = {}
        }
        //console.log('params', params);
        const getScheduleListUrl = APIURL + '/mobile/ezSchedule/scheduleLists.do';

        const loginCookie = await SecureStore.getItemAsync('loginCookie');
        const response = await axios.post(getScheduleListUrl, params, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': loginCookie
            }
        });

        //console.log('response.data.code', response.data.code);
        if (response.data.code == 0) {
            //console.log(response.data.data.scheduleList);
            //console.log(response.data.data.scheduleList.length);
            return response.data.data.scheduleList;
        } else {

        }

    } catch (error) {
        console.error(error);
    }
}

export default GetScheduleLists;