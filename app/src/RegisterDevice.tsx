import deviceID from './deviceid';
import hostname from './hostname';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { postDevice } from './API';

const RegisterDevice = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    useEffect(() => {
        if (user) {
            deviceID().then(id => {
                const exists = user.devices.map(elem => elem.id).includes(id);
                if (!exists) {
                    hostname().then(name => {
                        postDevice(id, name, user.token).then(res => {
                            if (res.status === 201) {
                                user.devices.push({
                                    id: id,
                                    name: name,
                                });
                                setUser(user);
                                navigate("/devices");
                            }
                        });
                    });
                } else {
                    navigate("/devices");
                }
            });
        } else {
            navigate("/login")
        }
    }, [user])

    return (
        <div className="h-screen w-screen bg-neutral-800 text-white flex
            items-center justify-center"/>
    );
}

export default RegisterDevice;
