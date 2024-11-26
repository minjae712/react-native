import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';

/*interface ScheduleType {
    scheduleType: string; // 스케줄 타입
    ownerId: string;      // 스케줄 오너 아이디 
}

interface SearchScheduleListParams {
    startDate: string;            // 시작 시간 (YYYY-MM-DD 형식)
    endDate: string;              // 종료 시간 (YYYY-MM-DD 형식)
    searchTitle?: string;         // 검색 – 제목
    searchLocation?: string;      // 검색 – 위치
    searchAll?: string;           // 검색 – 전체
    typeList?: ScheduleType[];    // 일정 타입 리스트
    chk_usersearch?: string;      // 사용자 일정검색 여부 (사용자 일정검색 시 userSearch 값 필수)
    SuserId?: string;             // 검색할 사용자 사번
    SuserDeptId?: string;         // 검색할 사용자 부서 아이디
    SuserCompanyId?: string;      // 검색할 사용자 회사 아이디
}*/

const SearchScheduleListAPI = async (startDate, endDate, searchAll) => {

    const APIURL = process.env.EXPO_PUBLIC_API_URL;
    //const testAPI = process.env.EXPO_PUBLIC_TEST_API_URL;

    const url = `${APIURL}/mobile/ezSchedule/scheduleLists.do`;
    const loginCookie = await SecureStore.getItemAsync('loginCookie');

    // if (!loginCookie) {
    //     throw new Error('Login cookie error.');
    // }
    //const startDate = moment().subtract(1, 'months');
    //const endDate = moment();
    //console.log(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    const param = { startDate: startDate, endDate: endDate, searchAll: searchAll };
    try {
        const response = await axios.post(url, param, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': loginCookie,
            }
        });
        //console.log(response.data.data);
        if (response.data.code == 0) {
            return response.data.data.scheduleList;
        }
    } catch (error) {
        //console.error('Error');
        //throw error; // Rethrow error for the caller to handle
    }
};

export default SearchScheduleListAPI;