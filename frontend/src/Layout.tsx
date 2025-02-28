import React from 'react';
import AppSidebar from './AppSidebar';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Layout = ({ children }: { children?: React.ReactNode }) => {
    const location = useLocation();
    const tokens = location.pathname.split("/").filter(e => e !== "");

    return (
        <div className="h-screen w-screen flex flex-col text-white bg-neutral-800">
            <div className="flex bg-neutral-900 pl-5">
                <div className="flex flex-grow-0 h-10 items-center">
                    {
                        tokens.map((token, i) => {
                            return (
                                <div className="flex items-center font-bold " key={i}>
                                    <div className="mr-2 text-lg">
                                        <p>/</p>
                                    </div>
                                    <div className="mr-2 text-sm">
                                        <Link
                                            className="hover:bg-neutral-700 px-2 py-1 duration-150 rounded"
                                            to={tokens.slice(0, i + 1).join("/")}>
                                            {token}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <div className="flex flex-1 overflow-y-scroll">
                <AppSidebar />
                <main className="w-full flex-1 max-h-full h-full">
                    {children}
                </main>
            </div>
        </div >
    );
}

export default Layout;
