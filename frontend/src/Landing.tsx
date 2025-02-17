import { Link } from 'react-router';
import Nav from './Nav';
import { useSession } from './Hooks';
import { useUserContext } from './UserContext'


const Landing = () => {
    const [user, setUser] = useUserContext();
    useSession(user, (data, status) => {
        if (status) setUser(data.user.email);
    });

    return (
        <>
            <Nav />
            <div className="mt-10 flex justify-center">
                <div className="max-w-[1000px] w-full px-4">
                    <h1 className="text-5xl mb-10 font-bold">The worlds first private web market</h1>
                    <p className="text-3xl mb-16">
                        Easily create and join any private network to access all your favorite services!
                    </p>
                    <Link to={user === null ? "/register" : "/dashboard"}
                        className="text-2xl bg-black text-white rounded
                        py-4 px-8 hover:bg-gray-800 duration-100">
                        Get Started &#8594;
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Landing;
