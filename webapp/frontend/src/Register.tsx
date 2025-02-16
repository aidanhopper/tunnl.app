import { useNavigate } from 'react-router';
import { register } from './API';
import { useUserContext } from './UserContext';
import { useState, useRef } from 'react';

const Register = ({ redirectTo }: { redirectTo: string }) => {
    const [user, setUser] = useUserContext();
    const navigate = useNavigate();

    const [isInvalidRegistration, setIsInvalidRegistration] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef1 = useRef<HTMLInputElement>(null);
    const passwordRef2 = useRef<HTMLInputElement>(null);

    return (
        <div className="flex justify-center items-center bg-white h-screen">
            <div className="bg-gray-50 p-10 rounded text-2xl">
                <form onSubmit={e => e.preventDefault()} className="flex flex-col">
                    <label>
                        <input type="email" placeholder="Email" ref={emailRef}
                            className="bg-gray-50 p-2 mb-10 border-b border-black"
                            style={isInvalidRegistration ? { borderColor: "red" } : {}}
                        />
                    </label>
                    <label>
                        <input type="password" placeholder="Password" ref={passwordRef1}
                            className="bg-gray-50 p-2 mb-10 border-b border-black"
                            style={isInvalidRegistration ? { borderColor: "red" } : {}}
                        />
                    </label>
                    <label>
                        <input type="password" placeholder="Password" ref={passwordRef2}
                            className="bg-gray-50 p-2 mb-10 border-b border-black"
                            style={isInvalidRegistration ? { borderColor: "red" } : {}}
                        />
                    </label>
                    <input type="submit" className="p-2 bg-black text-white rounded
                        hover:bg-gray-800 duration-100"
                        value="Register" onClick={async () => {

                            if (emailRef.current === null || passwordRef1.current
                                === null || passwordRef2.current === null) return;

                            if (passwordRef1.current.value !== passwordRef2.current.value) {
                                setIsInvalidRegistration(true);
                                emailRef.current.value = "";
                                passwordRef1.current.value = "";
                                passwordRef2.current.value = "";
                                return;
                            }

                            const [data, status] = await register(
                                emailRef.current.value,
                                passwordRef1.current.value,
                            );

                            if (status !== 201) {
                                setIsInvalidRegistration(true);
                                emailRef.current.value = "";
                                passwordRef1.current.value = "";
                                passwordRef2.current.value = "";
                                return;
                            }

                            setUser(data.user.email);
                            navigate("/dashboard");
                        }} />
                </form>
            </div>
        </div>
    );
}

export default Register;
