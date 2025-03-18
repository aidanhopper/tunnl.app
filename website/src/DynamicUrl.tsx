import { useUser } from './user';
import Login from './Login';
import { useNavPath } from './hooks';
import { isInviteValid } from './API';
import { useState, useEffect } from 'react';
import NotFound from './NotFound';

const DyanmicUrl = () => {
    const { user, setUser } = useUser();
    const path = useNavPath();
    const [exists, setExists] = useState<null | boolean>(null);

    const code = path.length === 1 ? path[0] : null;

    useEffect(() => {
        if (!code) { setExists(false); return };
        if (exists !== null) return;
        isInviteValid(code)
            .then(() => setExists(true))
            .catch(() => setExists(false));
    }, [path, code, exists]);


    return exists === null ? <></> :
        exists === false ? <NotFound /> :
            !user ? <Login /> : (
                <div className='w-screen h-screen text-7xl font-bold flex items-center justify-center text-white'>
                    {path}
                </div>
            );
}

export default DyanmicUrl;
