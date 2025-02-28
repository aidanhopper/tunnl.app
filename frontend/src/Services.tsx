import { useLocation } from 'react-router-dom';
import ScrollingList from './ScrollingList';
import ListingLayout from './ListingLayout';
import { Link } from 'react-router-dom';

const Services = () => {
    const location = useLocation();
    const tokens = location.pathname.split("/").filter(e => e !== "");
    const activeItemId = tokens.length >= 2 ? tokens[1] : "";
    return (
        <ListingLayout>
            <div className="h-full flex flex-col w-[300px] bg-neutral-900 px-4">
                <h1>
                    Services
                </h1>
                <div className="flex-1">
                </div>
                <div className="h-24 flex items-center justify-center">
                    <Link to="/services/create"
                        className={`font-bold text-lg hover:bg-white hover:text-black
                    rounded-md px-4 py-1 duration-150
                    ${activeItemId === "create" ? "bg-neutral-700" : ""}`}>
                        Create a service
                    </Link>
                </div>
            </div>
        </ListingLayout>
    )
}

export default Services;
