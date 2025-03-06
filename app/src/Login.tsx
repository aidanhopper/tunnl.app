import Store from './store';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, User } from './UserContext';
import authenticate from './authenticate';
import { motion, AnimatePresence } from 'framer-motion';

type LoginProps = {
    token: string,
    email: string,
    pictureURL: string,
};

type LoginUserProps = {
    email: string,
    pictureURL: string,
}

const openLoginInBrowser = () => window.ipcRenderer.invoke("openLinkInBrowser", "http://localhost:5174/login");

const handleLogin = async (data: LoginProps) => {
    Store.set(data.email, data.token);
    let loginUsers = await Store.get("loginUsers");
    loginUsers = loginUsers.filter((u: LoginUserProps) => u.email !== data.email);
    loginUsers.push({
        email: data.email,
        pictureURL: data.pictureURL,
    });
    Store.set("loginUsers", loginUsers);
}

const Login = () => {
    const navigate = useNavigate();
    const [loginUsers, setLoginUsers] = useState<LoginUserProps[]>([]);
    const { user, setUser } = useUser();

    const authSuccess = (u: User) => {
        setUser(u);
        navigate("/register/device");
    }

    const Users = ({ users }: { users: LoginUserProps[] }) => {
        return (
            <>
                {
                    users.map((elem, i) => {
                        return (
                            <div className="h-16 shadow-md mb-6 group hover:bg-neutral-800
                                rounded duration-150 text-lg flex items-center justify-center
                                bg-neutral-200 w-full"
                                key={i}>
                                <button className="flex flex-1 text-black cursor-pointer
                                    group-hover:text-neutral-200 
                                    text-lg items-center h-full rounded px-4"
                                    onClick={async () => {
                                        const u = await authenticate(elem.email);
                                        if (u)
                                            authSuccess(u);
                                    }}>
                                    <div className="flex-1 flex justify-start">
                                        <p>{elem.email}</p>
                                    </div>
                                    <div className="flex-1 flex justify-end">
                                        <img
                                            src={elem.pictureURL}
                                            className="rounded-full border-black border w-12" />
                                    </div>
                                </button>
                                <button className="mx-3 flex flex-col items-center
                                    justify-center cursor-pointer rounded group"
                                    onClick={async () => {
                                        let loginUsers = await Store.get("loginUsers");
                                        loginUsers = loginUsers.filter((u: User) => u.email !== elem.email);
                                        Store.set("loginUsers", loginUsers);
                                        Store.delete(elem.email);
                                        setLoginUsers(loginUsers);
                                    }}>
                                    <p className="text-xl text-neutral-200 font-bold
                                        hover:text-red-500 duration-150">
                                        X
                                    </p>
                                </button>
                            </div>
                        );
                    })
                }
                <button className={`text-black font-bold text-lg hover:bg-neutral-800 text-center
                hover:text-neutral-200 w-full p-2 rounded duration-150 cursor-pointer
                ${users.length === 0 ? "mt-12" : ""}`}
                    onClick={openLoginInBrowser}>
                    <p>Register a user</p>
                </button>
            </>
        );
    }

    useEffect(() => {
        window.ipcRenderer.on("login-event", async (_, data) => {
            handleLogin(data)
            const u = await authenticate(data.email);
            if (u)
                authSuccess(u);
        });

        Store.get("current user").then(email => {
            if (!email)
                return;
            authenticate(email).then(u => {
                if (u)
                    authSuccess(u);
            });
        });
    }, []);

    Store.get("loginUsers").then(u => {
        if (u.length !== loginUsers.length)
            setLoginUsers(u);
    });

    return (
        <AnimatePresence>
            <div className="w-screen h-screen bg-neutral-800 flex items-center justify-center">
                <div className="max-h-[80%] flex flex-col justify-center items-center">
                    <h1 className="text-white mb-5">tunnl.app</h1>
                    <div
                        className="bg-white p-12 w-[500px] min-h-[250px] shadow-lg rounded overflow-auto m-12">
                        <Users users={loginUsers} />
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}

export default Login;
