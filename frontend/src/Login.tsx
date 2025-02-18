import { useNavigate } from 'react-router';
import { login, getUserData } from './API';
import { useUserContext } from './UserContext';
import { useState, useRef } from 'react';

const Login = ({ redirectTo }: { redirectTo: string }) => {
    const [user, setUser] = useUserContext();
    const navigate = useNavigate();

    const [isInvalidLogin, setIsInvalidLogin] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex justify-center items-center bg-white h-screen">
            <div className="bg-gray-50 p-10 rounded text-2xl">
                <form onSubmit={e => e.preventDefault()} className="flex flex-col">
                    <label>
                        <input type="email" placeholder="Email" ref={emailRef}
                            className="bg-gray-50 p-2 mb-10 border-b border-black"
                            style={isInvalidLogin ? { borderColor: "red" } : {}}
                        />
                    </label>
                    <label>
                        <input type="password" placeholder="Password" ref={passwordRef}
                            className="bg-gray-50 p-2 mb-10 border-b border-black"
                            style={isInvalidLogin ? { borderColor: "red" } : {}}
                        />
                    </label>
                    <input type="submit" className="p-2 bg-black text-white rounded
                        hover:bg-gray-800 duration-100"
                        value="Login" onClick={async () => {
                            if (emailRef.current !== null && passwordRef.current !== null) {
                                const [data, status] = await login(
                                    emailRef.current.value,
                                    passwordRef.current.value
                                );
                                if (status === 200) {
                                    const [data, s] = await getUserData()
                                    if (s === 200) setUser(data);
                                    navigate(`${redirectTo}`);
                                }
                                setIsInvalidLogin(true);
                                emailRef.current.value = "";
                                passwordRef.current.value = "";
                            }
                        }} />
                </form>
            </div>
        </div>
    );
}

export default Login;
