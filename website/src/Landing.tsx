import { getUser, startTunneler, stopTunneler, authenticateDaemon, getTunnelerStatus } from './API';
import { useState, useEffect } from 'react';


const TestDevice = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser().then(r => r.data).then(d => setUser(d));
    }, [])

    return (
        <>
            {
                user !== null &&
                <>
                    {
                        user.devices.length >= 1 &&
                        <>
                            <button
                                className="bg-neutral-100 text-neutral-900 p-4 mb-4"
                                onClick={() => startTunneler(user.devices[0].id).then(r => console.log(r.data))}>
                                Turn on {user.devices[0].id}
                            </button>
                            <button
                                className="bg-neutral-100 text-neutral-900 p-4 mb-4"
                                onClick={() => stopTunneler(user.devices[0].id).then(r => console.log(r.data))}>
                                Turn off {user.devices[0].id}
                            </button>
                        </>
                    }

                    <button
                        className="bg-neutral-100 text-neutral-900 p-4"
                        onClick={() => authenticateDaemon(user.id)}>
                        Authenticate daemon with {user.id}
                    </button>
                </>
            }
        </>
    );
}

const Landing = () => {
    return (
        <div className="bg-neutral-800 h-screen w-screen text-neutral-200 text-3xl flex flex-col items-center justify-center">
            <h1 className="mb-10">Welcome to <code>tunnl.app</code></h1>
            <TestDevice />
        </div>
    );
}

export default Landing;
