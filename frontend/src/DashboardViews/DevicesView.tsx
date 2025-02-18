import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import React, { useRef, useState } from 'react';
import { postDevice, getUserData, deleteDevice } from '../API';
import { useUserContext } from '../UserContext'

const CreateDeviceView = () => {
    const keyRef = useRef<HTMLInputElement>(null);
    const [isInvalidKey, setIsInvalidKey] = useState(false);
    const [user, setUser] = useUserContext();

    return (
        <>
            <h1 className="text-5xl mt-8 mb-8 font-semibold">
                Create a device
            </h1>
            <div className="mb-8">
                <Link
                    to="/dashboard/devices"
                    className="text-lg p-[4px] text-[#2563EB]
                        shadow-[inset_0_0px_0px_rgba(37,99,235,1)]
                        hover:shadow-[inset_0_-50px_0px_rgba(37,99,235,1)]
                        hover:text-white duration-[140ms]
                        hover:rounded font-light">
                    &larr; Back to All Devices
                </Link>
            </div>
            <div>
                <h2 className="text-2xl mb-4 font-semibold">Instructions (Linux only for now)</h2>
                <ol className="text-xl [&>*]:mb-4">
                    <li>
                        1. Download and install the tailscale client <a
                            className="text-blue-600 rounded duration-100 hover:text-purple-500"
                            target="_blank"
                            rel="noreferrer"
                            href="https://tailscale.com/download">
                            here
                        </a>
                    </li>
                    <li>
                        2. Make sure the <code>tailscaled</code> service is running
                    </li>
                    <li>
                        3. Enter the command into your
                        terminal <code>tailscale up --login-server https://meshnet.ahop.dev</code>
                    </li>
                    <li>
                        4. Open the URL and copy the key into the prompt below
                    </li>
                </ol>
                <div className="mt-8">
                    <div>
                        <form
                            className="bg-gray-100 inline py-4 rounded"
                            style={{
                                background: isInvalidKey ? "#FEE2E2" : "#F3F4F6"
                            }}
                            onSubmit={e => e.preventDefault()}>
                            <input type="text"
                                ref={keyRef}
                                placeholder="Key"
                                style={{
                                    background: isInvalidKey ? "#FEE2E2" : "#F3F4F6"
                                }}
                                className="bg-gray-100 ml-1 p-2 mb-10
                                rounded-lg w-[40%] outline-none" />
                            <button
                                onClick={async () => {
                                    if (keyRef.current && keyRef.current.value !== "") {

                                        const [data, status] =
                                            await postDevice(keyRef.current.value);

                                        if (status !== 201) {
                                            setIsInvalidKey(true);
                                        } else {
                                            setIsInvalidKey(false);
                                            keyRef.current.value = "";
                                            const [userData, s] = await getUserData();
                                            if (s === 200) setUser(userData);
                                        }
                                    } else {
                                        setIsInvalidKey(true);
                                    }
                                }}
                                className="text-blue-600 hover:text-white p-[13px]
                                duration-[80ms] border-l-[3px]
                                shadow-[inset_0_0px_0px_rgba(37,99,235,1)]
                                hover:shadow-[inset_0_-50px_0px_rgba(37,99,235,1)]
                                rounded-r"
                                style={{
                                    borderColor: isInvalidKey ? "#FECACA" : "#D1D5DB"
                                }}>
                                Send key
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

const DevicesView = () => {
    const navigate = useNavigate();
    const [user, setUser] = useUserContext();

    return (
        <>
            <h1 className="text-5xl mt-8 mb-8 font-semibold">
                Your devices
            </h1>
            <div className="flex items-center content-end text-gray-500 mb-8">
                <div className="flex-1 flex justify-start">
                    <p className="text-xl font-light">
                        Manage the devices you've logged into.
                    </p>
                </div>
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={() => navigate("/dashboard/devices/create")}
                        className="text-lg p-[4px] text-[#2563EB]
                        shadow-[inset_0_0px_0px_rgba(37,99,235,1)]
                        hover:shadow-[inset_0_-50px_0px_rgba(37,99,235,1)]
                        hover:text-white duration-[140ms]
                        hover:rounded font-light">
                        Create a device
                    </button>
                </div>
            </div>
            <table className="w-full text-xl text-gray-500">
                <thead>
                    <tr className="text-left">
                        <th className="flex-auto py-2">IP</th>
                        <th className="flex-auto py-2" />
                    </tr>
                </thead>
                <tbody>
                </tbody>
                {
                    user.devices.map((ip: string, i: number) => {
                        return (
                            <tr
                                key={i}
                                className="border-t border-b border-gray-100 w-full
                                hover:bg-gray-50 duration-100 text-black">
                                <td className="py-8 px-2 font-light content-start text-gray-900">
                                    {ip}
                                </td>
                                <td className="py-8 px-2 font-light content-start">
                                    <button
                                        onClick={async () => {
                                            const [data, status] = await deleteDevice(ip);
                                            console.log(ip)
                                            if (status === 200) {
                                                const [userData, s] = await getUserData();
                                                if (s === 200) setUser(userData);
                                            }
                                        }}
                                        className="hover:bg-red-600 text-xs
                                        font-bold bg-gray-500 text-white
                                        px-2 py-1 rounded-md duration-100">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                }
            </table>
        </>
    );
}

export { DevicesView, CreateDeviceView };
