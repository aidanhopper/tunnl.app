import { Link } from 'react-router';
import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router';
import { useSession } from './Hooks';
import NetworksView from './DashboardViews/NetworksView';
import MachinesView from './DashboardViews/MachinesView';
import HostingView from './DashboardViews/HostingView';
import MarketView from './DashboardViews/MarketView';
import React, { useState } from 'react';

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
    const [user, setUser] = useUserContext();
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState("networks");
    useSession(user, (data, success) => {
        if (success) setUser(data.user.email);
        else navigate("/login");
    });

    const RenderView = ({ activeView }: { activeView: string }) => {
        switch (activeView) {
            case "networks":
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

            case "machines":
                return <MachinesView />;

            case "hosting":
                return <HostingView />;

            case "market":
                return <MarketView />;

        }
        return <></>;
    }

    return user !== null ? (
        <div className="min-h-screen">
            <div className="bg-gray-50">
                <div className="max-w-[1600px] m-auto px-8 text-gray-500">
                    <div className="flex flex-1 items-center">
                        <Link to="/dashboard" className="flex-1">
                            <h1 className="py-8 text-5xl font-bold">MeshNet Dashboard</h1>
                        </Link>
                        <h1 className="text-right text-3xl flex-1 w-full font-light">
                            {user}
                        </h1>
                    </div>
                    <nav>
                        <ul className="flex text-2xl">
                            <li>
                                <NavButton
                                    isActive={activeView === "networks"}
                                    onClick={() => setActiveView("networks")}>
                                    Networks
                                </NavButton>
                            </li>
                            <li>
                                <NavButton
                                    isActive={activeView === "machines"}
                                    onClick={() => setActiveView("machines")}>
                                    Machines
                                </NavButton>
                            </li>
                            <li>
                                <NavButton
                                    isActive={activeView === "hosting"}
                                    onClick={() => setActiveView("hosting")}>
                                    Hosting
                                </NavButton>
                            </li>
                            <li>
                                <NavButton
                                    isActive={activeView === "market"}
                                    onClick={() => setActiveView("market")}>
                                    Market
                                </NavButton>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="max-w-[1600px] px-8 m-auto bg-white">
                <RenderView activeView={activeView} />
            </div>
        </div>
    ) : <></>;
}

export default Dashboard;
