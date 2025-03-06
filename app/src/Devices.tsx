import { useLocation } from 'react-router-dom';
import ScrollingList from './ScrollingList';
import ListingLayout from './ListingLayout';
import { useUser } from './UserContext';

const Devices = () => {
    const location = useLocation();
    const tokens = location.pathname.split("/").filter(e => e !== "");
    const activeItemId = tokens.length >= 2 ? tokens[1] : "";

    const { user, setUser } = useUser();

    const deviceList = user ? user?.devices.map(d => {
        return {
            to: `/devices/${d.name}`,
            activeID: `${d.name}`,
            content: `${d.name}`,
            id: d.id,
        }
    }) : [];

    return (
        <ListingLayout>
            <div className="h-full flex flex-col w-[350px] bg-neutral-900 px-4">
                <h1>Devices</h1>
                <ScrollingList
                    activeItemId={activeItemId}
                    listItems={deviceList}
                />
            </div>
            <div className="w-full h-full">
            </div>
        </ListingLayout>
    );
}

export default Devices;
