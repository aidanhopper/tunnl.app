import { GoogleOAuthProvider, GoogleLogin, GoogleCredentialResponse } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import { getUser } from './API';
import { useUser } from './user';

const CLIENT_ID = "519403689632-1t14ifrjndvttr1sfjn5p945pigc8a3s.apps.googleusercontent.com";

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();


    const handleSuccess = async (response: GoogleCredentialResponse) => {
        const callbackResponse = await fetch("/api/v1/auth/google/callback",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: response.credential,
                }),
            }
        )

        if (callbackResponse.status !== 201) return;
        const userResponse = await getUser();

        if (userResponse.status !== 200) return;
        setUser(userResponse.data);

        navigate("/dashboard");
    }

    return (
        <div className="h-screen w-screen bg-neutral-600 text-white flex
            items-center justify-center text-3xl">
            <div className="flex items-center justify-center">
                <div className="flex justify-center items-center flex-col">
                    <h1 className="font-bold mb-12">
                        Login
                    </h1>
                    <div className="bg-white w-64 h-24 flex justify-center items-center rounded-lg shadow-lg">
                        <GoogleOAuthProvider clientId={CLIENT_ID}>
                            <GoogleLogin
                                text="continue_with"
                                theme="filled_blue"
                                onSuccess={handleSuccess} />
                        </GoogleOAuthProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
