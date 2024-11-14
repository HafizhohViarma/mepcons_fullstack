import React from 'react';
import { GoogleLogin } from 'react-google-login';

const LoginGoogle = () => {
    const clientId = "321330909084-6m04fd4d9bphq8spmv739kbedd5vvbs6.apps.googleusercontent.com";

    const onSuccess = (res) => {
        console.log("Login Success! Current User: ", res.profileObj);
        // Redirect atau lakukan tindakan lain setelah berhasil login dengan Google
        localStorage.setItem('token', res.tokenId);
        window.location.href = '/'; // Contoh: arahkan ke halaman utama
    };

    const onFailure = (res) => {
        console.log("Login Failed! res: ", res);
    };

    return (
        <div>
            <GoogleLogin 
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    );
};

export default LoginGoogle;
