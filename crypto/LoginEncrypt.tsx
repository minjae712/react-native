//import rsa from "react-native-rsa";

const LoginEncrypt = (userId: string, userPassword: string, deviceId: string) => {

    const RSAKey = require('react-native-rsa');
    //const bits = 1024;
    const publicModules = process.env.EXPO_PUBLIC_PublicModules
    const exponent = '10001'; // must be a string. This is hex string. decimal = 65537
    const rsa = new RSAKey();

    rsa.setPublic(publicModules, exponent);

    const encryptID = rsa.encrypt(userId.toLowerCase());
    const encryptPass = rsa.encrypt(userPassword);
    //console.log('encrypted', encrypted);
    const loginObj = { encryptID: encryptID, encryptPass: encryptPass, deviceId: deviceId }
    return (
        loginObj
    );
};


export default LoginEncrypt;