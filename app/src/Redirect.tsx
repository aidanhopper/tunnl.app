import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const Redirect = ({ to }: { to: string }) => {
    const navigate = useNavigate();
    useEffect(() => navigate(to));
    return <></>;
}

export default Redirect;
