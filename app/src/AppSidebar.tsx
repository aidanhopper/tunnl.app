import { useLocation } from 'react-router-dom';
import SidebarButton from './SidebarButton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import Store from './store';

const buttons = [
    {
        icon: "/devices_icon.png",
        text: "Devices",
        route: "/devices",
    },
    {
        icon: "/communities_icon.png",
        text: "Communities",
        route: "/communities",
    },
    {
        icon: "/services_icon.png",
        text: "Services",
        route: "/services",
    },
    {
        icon: "/settings_icon.png",
        text: "Settings",
        route: "/settings",
    }
];

const ConnectButton = ({ onClick, isConnected }: { onClick: () => void, isConnected: boolean }) => {
    return (
        <button className="mb-8 flex items-center font-bold text-lg cursor-pointer" onClick={onClick}>
            <div
                className={`rounded-full w-16 h-8 flex duration-150
                        items-center ${isConnected ? "bg-green-700" : "bg-neutral-700"}`}>
                <div className={`bg-white h-7 w-7 rounded-full  duration-150
                            ${isConnected ? "translate-x-9" : ""} `} />


            </div>
            {
                isConnected ?
                    <p className="ml-4">Connected</p> :
                    <p className="ml-4">Disconnected</p>
            }
        </button>
    );
}

const AppSidebar = () => {
    const location = useLocation();
    const tokens = location.pathname.split("/").filter(e => e !== "");
    const [isConnected, setIsConnected] = useState(false);
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    return (
        <div className="w-[300px] h-fill rounded flex flex-col bg-neutral-900">
            <div className="flex flex-col px-4 flex-1 mt-2">
                {
                    buttons.map((elem, i) => {
                        return (
                            <SidebarButton
                                active={tokens[0] === elem.text.toLowerCase()}
                                to={elem.route}
                                key={i}>
                                <img
                                    className="invert
                                    group-hover:invert-0
                                    w-6 duration-150 mr-2"
                                    src={elem.icon} />
                                {elem.text}
                            </SidebarButton>
                        );
                    })
                }
            </div>
            <div className="h-96 p-4 content-end text-sm">
                <ConnectButton
                    onClick={() => setIsConnected(!isConnected)}
                    isConnected={isConnected} />
                <div className="flex items-center mb-4 group">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center cursor-pointer">
                            <div className="flex-auto mr-5">
                                <img src={user?.pictureURL} className="rounded-full w-12 h-12 bg-white
                                    group-hover:opacity-70 duration-150 border-2 border-white" />
                            </div>
                            <div className="flex-auto font-bold text-white text-lg group-hover:text-neutral-400">
                                <p>{user?.displayName}</p>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="text-black">
                            <button className="text-black cursor-pointer"
                                onClick={() => {
                                    Store.delete("current user");
                                    setUser(null);
                                    navigate("/login");
                                }}>
                                <DropdownMenuItem>
                                    Log Out
                                </DropdownMenuItem>
                            </button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

export default AppSidebar;
