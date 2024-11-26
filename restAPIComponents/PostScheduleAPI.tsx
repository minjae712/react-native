import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface PostScheduleParams {
    ownerId:          string;     // 스케줄 오너 아이디  ※ 일정관리 테이블 정의서 참조 필요
    ownerName:        string;     // 스케줄 오너 이름 ※ 일정관리 테이블 정의서 참조 필요
    scheduleType:     string;     // 스케줄 타입
    importance:       string;     // 중요도
    isPublic:         string;     // 공개여부
    dateType:         string;     // 날짜 타입 
    startDate:        string;     // 일정 시작일 (YYYY-MM-DD HH:MI 형식)
    endDate:          string;     // 일정 종료일 (YYYY-MM-DD HH:MI 형식)
    title:            string;     // 제목
    location:         string;     // 위치
    content:          string;     // 내용 ※ URL 인코딩 된 형식으로 전송 필요
    addDeptSch?:      string;     // 부서일정 등록 여부 (등록 : Y / 등록안함 : N) (default : N, 해당 데이터 Y로 들어올 경우에만 부서일정 등록)
    repetitionCycle?: string;     // 반복주기
    cycleSet?:        string;     // 반복주기 설정범위
}

const PostScheduleAPI = async ({
    ownerId,
    ownerName,
    scheduleType,
    importance,
    isPublic,
    dateType,
    startDate,
    endDate,
    title,
    location,
    content,
	addDeptSch,
    repetitionCycle,
    cycleSet
}: PostScheduleParams): Promise<any> => {
    const APIURL = process.env.EXPO_PUBLIC_API_URL;
    //const testAPI = process.env.EXPO_PUBLIC_TEST_API_URL;

    const url = APIURL + '/mobile/ezSchedule/mInsertSchedule.do';
    const loginCookie = await SecureStore.getItemAsync('loginCookie');
    //console.log(loginCookie);

    const params = {
        ownerId,                              // 스케줄 오너 아이디  ※ 일정관리 테이블 정의서 참조 필요
        ownerName,                            // 스케줄 오너 이름 ※ 일정관리 테이블 정의서 참조 필요
        scheduleType,                         // 스케줄 타입
        importance,                           // 중요도
        isPublic,                             // 공개여부
        dateType,                             // 날짜 타입 
        startDate,                            // 일정 시작일 (YYYY-MM-DD HH:MI 형식)
        endDate,                              // 일정 종료일 (YYYY-MM-DD HH:MI 형식)
        title,                                // 제목
        location,                             // 위치
        content: encodeURIComponent(content), // 내용 ※ URL 인코딩 된 형식으로 전송 필요
 		addDeptSch,                           // 부서일정 등록 여부 (등록 : Y / 등록안함 : N) (default : N, 해당 데이터 Y로 들어올 경우에만 부서일정 등록)
        repetitionCycle,                      // 반복주기
        cycleSet                              // 반복주기 설정범위
    };

    try {
        //alert('PostScheduleAPI start');
        const response = await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': loginCookie
            }
        });
        //console.log(response.status);
        console.log('response : ' + response.data);
        return response.data;
    } catch (error) {        
        alert('error :' + error);
        //throw error;

    }
}

export default PostScheduleAPI;