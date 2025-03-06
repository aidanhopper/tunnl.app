import { useLocation } from 'react-router-dom';
import ScrollingList from './ScrollingList';
import ListingLayout from './ListingLayout';
import { Link } from 'react-router-dom';
import { postCommunity, deleteCommunity } from './API';
import { PopupWindow, PopupWindowInput } from './PopupWindow';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useUser } from './UserContext';
import { AnimatePresence, motion } from 'framer-motion';

const Communities = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tokens = location.pathname.split("/").filter(e => e !== "");
    const activeItemId = tokens.length >= 2 ? decodeURIComponent(tokens[1]) : "";
    const communityNameRef = useRef<HTMLInputElement>(null);
    const { user, setUser } = useUser();

    return (
        <>
            <ListingLayout>
                <div className="h-full flex flex-col w-[350px] bg-neutral-900 px-4">
                    <h1>Communities</h1>
                    <ScrollingList
                        activeItemId={activeItemId}
                        listItems={!user ? [] : user.communities.map(c => {
                            return {
                                to: `/communities/${c.name}`,
                                content: c.name,
                                activeID: c.name,
                                id: c.name,
                                dropdownOptions: [
                                    {
                                        content: <p>Delete</p>,
                                        className: "hover:bg-red-600",
                                        onClick: async () => {
                                            const response = await deleteCommunity(c.name, user.token);

                                            console.log(response.status)
                                            if (response.status !== 200)
                                                return;

                                            const newUser = user;
                                            newUser.communities = user.communities.filter(
                                                com => c.name !== com.name
                                            );

                                            setUser(newUser);
                                            navigate("/communities");
                                        }
                                    },
                                ],
                            }
                        })}
                    />
                    <div className="h-24 flex items-center justify-center">
                        <Link to="/communities/create"
                            className={`font-bold text-lg hover:bg-white hover:text-black
                    rounded-md px-4 py-1 duration-150
                    ${activeItemId === "create" ? "bg-neutral-700" : ""}`}>
                            Create a community
                        </Link>
                    </div>
                </div>
                <div className="w-full h-full">
                </div>
            </ListingLayout>
            <AnimatePresence>
                {
                    tokens.length >= 2 && tokens[1] === "create" &&
                    <PopupWindow
                        onClickOff={() => navigate("/communities")}
                        className="w-[400px] max-h-[500px] bg-neutral-700 shadow-2xl
                            text-neutral-200 rounded-lg">
                        <motion.div className="w-full h-full p-6 flex flex-col">
                            <h1 className="text-center w-full text-2xl mb-4
                                    border-neutral-200 border-b-2 pb-3">
                                Create a Community
                            </h1>
                            <div className="flex flex-col">
                                <form onSubmit={(e) => e.preventDefault()}
                                    className="flex flex-col max-h-[400px]">
                                    <div className="overflow-y-auto max-h-full scroll-m-4">
                                        <PopupWindowInput
                                            label="Community Name"
                                            description="The name of your community."
                                            placeholder="eg. Discord Friends"
                                            ref={communityNameRef}
                                        >
                                        </PopupWindowInput>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (!communityNameRef.current || !user)
                                                return;

                                            const response = await postCommunity(
                                                communityNameRef.current.value, user.token);

                                            if (response.status !== 201)
                                                return;

                                            user.communities.push(response.data.community);
                                            setUser(user);
                                            navigate("/communities");
                                        }}
                                        type="button"
                                        className="rounded mt-6 mb-2 bg-neutral-800 w-full text-center
                                        py-2 hover:bg-neutral-200 hover:text-neutral-800
                                        duration-150 cursor-pointer">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </PopupWindow>
                }
            </AnimatePresence>
        </>
    );
}

export default Communities;
