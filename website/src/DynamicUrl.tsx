import { useUser } from './user';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import { useNavPath } from './hooks';
import { isInviteValid, consumeInvite } from './API';
import { useState, useEffect } from 'react';
import NotFound from './NotFound';

const DyanmicUrl = () => {
    const { user, setUser } = useUser();
    const path = useNavPath();
    const [exists, setExists] = useState<null | boolean>(null);
    const [data, setData] = useState<{ name: string, id: string } | null>(null);
    const navigate = useNavigate();

    const code = path.length === 1 ? path[0] : null;

    useEffect(() => {
        if (!code) { setExists(false); return };
        if (exists !== null) return;
        isInviteValid(code)
            .then(r => {
                setExists(true)
                setData(r.data);
            })
            .catch(() => setExists(false));
    }, [path, code, exists]);

    const join = async () => {
        if (!data || !code) return;
        console.log('joining', data.id);
        const r = await consumeInvite(code);
        if (r.status === 201) navigate('/dashboard');
    }

    return exists === null ? <></> :
        exists === false ? <NotFound /> :
            !user ? <Login /> :
                !data ? <></> : (
                    <div className='w-screen h-screen text-6xl font-bold flex items-center justify-center text-white'>
                        <div className='flex bg-neutral-700 rounded items-center'>
                            <div className='rounded-l px-4 border-r-[8px] border-neutral-600 h-24 flex justify-center items-center'>
                                {data.name}
                            </div>
                            <button className='h-24 flex items-center justify-center px-8 cursor-pointer 
                                hover:bg-neutral-800 rounded-r duration-150'
                                onClick={join}>
                                join
                            </button>
                        </div>
                    </div>
                );
}

export default DyanmicUrl;
