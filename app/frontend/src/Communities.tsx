import { useLocation } from 'react-router-dom';
import ScrollingList from './ScrollingList';
import ListingLayout from './ListingLayout';
import { Link } from 'react-router-dom';
import { getHello } from './API';

const Communities = () => {
    const location = useLocation();
    const tokens = location.pathname.split("/").filter(e => e !== "");
    const activeItemId = tokens.length >= 2 ? tokens[1] : "";

    return (
        <ListingLayout>
            <div className="h-full flex flex-col w-[300px] bg-neutral-900 px-4">
                <h1>Communities</h1>
                <ScrollingList
                    activeItemId={activeItemId}
                    listItems={[
                        {
                            to: "/communities/community-1",
                            id: "community-1",
                            content: "Community 1"
                        },
                        {
                            to: "/communities/community-1",
                            id: "community-1",
                            content: "Community 1"
                        },
                        {
                            to: "/communities/community-1",
                            id: "community-1",
                            content: "Community 1"
                        }
                    ]}
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
            <div>
                asdf
            </div>
        </ListingLayout>
    );
}

export default Communities;
