import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import LoginEncrypt from '@/crypto/LoginEncrypt';


const LoginAPI = async (id: string, pass: string, deviceId: string, passSave: boolean) => {
    //console.log(id, pass, deviceId, passSave);
    const APIURL = process.env.EXPO_PUBLIC_API_URL;

    let loginReturn;
    const getPassSave = passSave == true ? '0' : '1';
    try {
        const loginObj = LoginEncrypt(id, pass, deviceId);
        const url = APIURL + '/mobile/user/login/actionLogin.do';
        //console.log('로그인 시도?');
        //로컬 테스트용                                                                                                                                  
        //const url = process.env.EXPO_PUBLIC_TEST_API_URL + '/mobile/user/login/actionLogin.do';
        const params = { encryptID: loginObj.encryptID, encryptPass: loginObj.encryptPass, deviceID: loginObj.deviceId };
        const response = await axios.post(url, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        //console.log(response);
        if (response.data.code == 0) {
            const cookieHeader = response.request._lowerCaseResponseHeaders["set-cookie"];
            const cookieArray = cookieHeader.split(/; |, /);
            const loginCookieEntry = cookieArray.find((item: string) => item.startsWith("loginCookie="));
            //console.log('로그인 성공?');
            if (loginCookieEntry && getPassSave == '0') {
                await AsyncStorage.setItem('passSave', getPassSave);
                await SecureStore.setItemAsync('loginCookie', loginCookieEntry);
                await SecureStore.setItemAsync('saveUserId', id);
                await SecureStore.setItemAsync('saveUserPass', pass);
                await SecureStore.setItemAsync('saveUserName', response.data.data.userName);
                //console.log('storage 저장');
                loginReturn = response.data.code;
            } else if (loginCookieEntry && getPassSave == '1') {
                await AsyncStorage.setItem('passSave', getPassSave);
                await SecureStore.setItemAsync('loginCookie', loginCookieEntry);
                await SecureStore.setItemAsync('saveUserName', response.data.data.userName);
                loginReturn = response.data.code;
            }
        } else {
            loginReturn = response.data.code;
            await AsyncStorage.removeItem('passSave');
            await AsyncStorage.removeItem('loginSuccesYn');
            await SecureStore.deleteItemAsync('saveUserId');
            await SecureStore.deleteItemAsync('saveUserPass');
            await SecureStore.deleteItemAsync('loginCookie');
            await SecureStore.deleteItemAsync('saveUserName');
        }

    } catch (error) {
        console.error('error', error);
    }

    return loginReturn;
};


export default LoginAPI;