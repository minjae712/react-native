import axios from 'axios';
import * as SecureStore from 'expo-secure-store';




const GetGroupListAPI = async () => {
    const APIURL = process.env.EXPO_PUBLIC_API_URL;
    //const testAPI = process.env.EXPO_PUBLIC_TEST_API_URL;

    try {
        const getGroupListUrl = APIURL + '/mobile/ezSchedule/groupLists.do';
        const loginCookie = await SecureStore.getItemAsync('loginCookie');
        //console.log(loginCookie);
        //console.log('getGroupList start', getGroupListUrl);
        const response = await axios.get(getGroupListUrl, {
            headers: {
                'Cookie': loginCookie
            }
        });
        //console.log(response.status);

        return response.data;

    } catch (error) {
        console.error('error', error);
    }
}

export default GetGroupListAPI;