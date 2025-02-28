import { useLocation } from 'react-router-dom';
import SidebarButton from './SidebarButton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react';

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
        <button
            onClick={onClick}
            className={`rounded-full w-16 h-8 flex duration-150
                        items-center ${isConnected ? "bg-green-800" : "bg-red-800"}`}>
            <div className={`bg-white h-7 w-7 rounded-full  duration-150
                            ${isConnected ? "translate-x-9" : ""} `} />
        </button>
    );
}

const AppSidebar = () => {
    const location = useLocation();
    const tokens = location.pathname.split("/").filter(e => e !== "");

    const [isConnected, setIsConnected] = useState(false);

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
                <div className="mb-8 flex items-center font-bold text-lg">
                    <ConnectButton
                        onClick={() => setIsConnected(!isConnected)}
                        isConnected={isConnected} />
                    {
                        isConnected ?
                        <p className="ml-4">Connected</p> :
                        <p className="ml-4">Disconnected</p>
                    }
                </div>
                <div className="flex items-center mb-4 group">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex">
                            <div className="flex-auto mr-5">
                                <div className="rounded-md w-8 h-8 bg-white
                                    group-hover:bg-neutral-400 duration-150" />
                            </div>
                            <div className="flex-auto font-bold text-lg group-hover:text-neutral-400">
                                aidanhop1@gmail.com
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="text-black">
                            <DropdownMenuItem>Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

export default AppSidebar;
