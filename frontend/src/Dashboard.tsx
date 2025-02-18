import { Link } from 'react-router';
import { useUserContext } from './UserContext';
import { useNavigate, useParams } from 'react-router';
import { useSession } from './Hooks';
import NetworksView from './DashboardViews/NetworksView';
import { DevicesView, CreateDeviceView } from './DashboardViews/DevicesView';
import HostingView from './DashboardViews/HostingView';
import MarketView from './DashboardViews/MarketView';
import React, { useState, useEffect } from 'react';
import { getUserData } from './API';

const NavButton = ({ isActive, onClick, children }: {
    isActive: boolean, onClick: () => void,
    children?: React.ReactNode
}) => {
    return (
        <button className="mr-10 py-4 duration-100 inset-0"
            style={isActive ? {
                boxShadow: "inset 0 -5px 0px rgba(37,99,235,1)",
                color: "#2563EB",
            } : {}}
            onClick={onClick}>
            {children}
        </button>

    );
}

const Dashboard = () => {
    const { "*": r } = useParams();
    const route = !r ? "/" : "/" + r;
    const routeTokens = route.split("/").filter(t => t !== "");
    const navigate = useNavigate();

    if (route === "/") {
        navigate("/dashboard/networks");
    }

    const [user, setUser] = useUserContext();

    useSession(user, (_, success) => {
        if (success) getUserData().then(([d, status]) => {
            if (status === 200) setUser(d);
        });
        else navigate("/login");
    });

    const RenderView = () => {
        if (routeTokens.length > 1 &&
            routeTokens[0] === "devices" &&
            routeTokens[1] === "create")
            return <CreateDeviceView />

        else if (routeTokens[0] === "networks")
            return <NetworksView networksData={[
                {
                    name: "Minecraft server",
                    owner: "aidanhop1@gmail.com",
                    members: 100,
                    type: "peer to peer",
                    address: "pangolin.mesh.net",
                },
                {
                    name: "Minecraft server",
                    owner: "aidanhop1@gmail.com",
                    members: 100,
                    type: "peer to peer",
                    address: "pangolin.mesh.net",
                },
            ]} />;

        else if (routeTokens[0] === "devices")
            return <DevicesView />;

        else if (routeTokens[0] === "hosting")
            return <HostingView />;

        else if (routeTokens[0] === "market")
            return <MarketView />;
        return <></>;
    }

    const DashboardNav = () => {
        return (
            <div className="bg-gray-50  border-b-[1px]">
                <div className="max-w-[1600px] m-auto px-8 text-gray-500">
                    <div className="flex flex-1 items-center">
                        <Link to="/dashboard" className="flex-1">
                            <h1 className="py-8 text-3xl font-bold">MeshNet Dashboard</h1>
                        </Link>
                        <h1 className="text-right text-xl flex-1 w-full font-light">
                            {user.email}
                        </h1>
                    </div>
                    <nav>
                        <ul className="flex text-2xl">
                            <li>
                                <NavButton
                                    isActive={routeTokens[0] === "networks"}
                                    onClick={() => navigate("/dashboard/networks")}>
                                    Networks
                                </NavButton>
                            </li>
                            <li>
                                <NavButton
                                    isActive={routeTokens[0] === "devices"}
                                    onClick={() => navigate("/dashboard/devices")}>
                                    Devices
                                </NavButton>
                            </li>
                            <li>
                                <NavButton
                                    isActive={routeTokens[0] === "hosting"}
                                    onClick={() => navigate("/dashboard/hosting")}>
                                    Hosting
                                </NavButton>
                            </li>
                            <li>
                                <NavButton
                                    isActive={routeTokens[0] === "market"}
                                    onClick={() => navigate("/dashboard/market")}>
                                    Market
                                </NavButton>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    return user !== null ? (
        <>
            <DashboardNav />
            <div className="max-w-[1600px] px-8 m-auto bg-white">
                <RenderView />
            </div>
        </>
    ) : <></>;
}

export default Dashboard;
