import { Link } from 'react-router';
import { logout, login } from './API';
import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router'

const LoginButton = () => {
    return (
        <Link className="text-2xl hover:bg-black
            hover:text-white duration-100 py-2 px-4 rounded"
            to="/login">
            login
        </Link>
    );
}

const UserProfileButton = () => {
    const [user, setUser] = useUserContext();
    const navigate = useNavigate();

    return (
        <>
            <Link to="/dashboard" className="text-2xl hover:bg-black
            hover:text-white duration-100 py-2 px-4 rounded mr-4">
                {user}
            </Link>
            <button className="text-2xl hover:bg-black
            hover:text-white duration-100 py-2 px-4 rounded"
                onClick={() => {
                    logout().then(_ => setUser(null));
                    navigate("/");
                }}>
                logout
            </button>
        </>
    );
}

const Nav = () => {
    const [user, setUser] = useUserContext();

    return (
        <div className="flex justify-center h-16">
            <div className="w-full max-w-[1000px] flex my-4 items-center">
                <span className="flex-1 flex justify-start">
                    <ul>
                        <li><Link to="/" className="text-2xl hover:bg-black 
                                hover:text-white duration-100 py-2 px-4 rounded font-bold">
                            MeshNet Market</Link></li>
                    </ul>
                </span>
                <span className="flex-1 flex justify-end">
                    <ul>
                        <li>
                            {
                                user === null ? <LoginButton /> : <UserProfileButton />
                            }
                        </li>
                    </ul>
                </span>
            </div>
        </div>
    );
}

export default Nav;
