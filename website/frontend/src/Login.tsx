import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = "519403689632-1t14ifrjndvttr1sfjn5p945pigc8a3s.apps.googleusercontent.com";

const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="h-screen w-screen bg-neutral-800 text-neutral-200 flex
            items-center justify-center text-3xl">
            <div className="flex items-center justify-center">
                <div className="flex justify-center items-center flex-col"
                    style={{ colorScheme: "light" }}>
                    <h1 className="font-bold">
                        tunnl.app
                    </h1>
                    <div className="h-14 w-1" />
                    <GoogleOAuthProvider clientId={CLIENT_ID}>
                        <GoogleLogin
                            text="continue_with"
                            onSuccess={(response) => {
                                location.href = `tunnl://?token=${JSON.stringify(response.credential)}`;
                                navigate("/login/success");
                            }} />
                    </GoogleOAuthProvider>
                    <div className="h-14 w-1" />
                    <div className="h-14 w-1" />
                </div>
            </div>
        </div>
    );
}

export default Login;
