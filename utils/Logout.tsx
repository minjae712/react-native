import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const Logout = async () => {
    await AsyncStorage.removeItem('passSave');
    await AsyncStorage.removeItem('loginSuccesYn');
    await SecureStore.deleteItemAsync('saveUserId');
    await SecureStore.deleteItemAsync('saveUserPass');
    await SecureStore.deleteItemAsync('loginCookie');
    await SecureStore.deleteItemAsync('saveUserName');
    await SecureStore.deleteItemAsync('deviceId');
};