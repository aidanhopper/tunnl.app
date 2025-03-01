import { useLocation } from 'react-router-dom';
import ScrollingList from './ScrollingList';
import ListingLayout from './ListingLayout';
import SidebarButton from './SidebarButton';
import { Link } from 'react-router-dom';

const devicesList = [
    {
        to: "/devices/device-1",
        id: "device-1",
        content: "Device 1"
    },
]

const Devices = () => {
    const location = useLocation();
    const tokens = location.pathname.split("/").filter(e => e !== "");
    const activeItemId = tokens.length >= 2 ? tokens[1] : "";
    return (
        <ListingLayout>
            <div className="h-full flex flex-col w-[300px] bg-neutral-900 px-4">
                <h1>Devices</h1>
                <ScrollingList
                    activeItemId={activeItemId}
                    listItems={devicesList}
                />
            </div>
        </ListingLayout>
    );
}

export default Devices;
