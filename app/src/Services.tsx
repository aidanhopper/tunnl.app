import { useLocation } from 'react-router-dom';
import ScrollingList from './ScrollingList';
import ListingLayout from './ListingLayout';
import { Link } from 'react-router-dom';
import { useRef, Ref, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService, deleteService } from './API';
import { useUser } from './UserContext';
import { AnimatePresence, motion } from 'framer-motion';
import { PopupWindow, PopupWindowInput } from './PopupWindow';

type CreatePopupWindowItem = {
    label: string,
    placeholder: string,
    description: string,
    ref: Ref<HTMLInputElement>,
}

const DevicesSelection = ({ devices, onDeviceSelect }:
    { devices: string[], onDeviceSelect: (device: string) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<string>("");
    const { user, setUser } = useUser();

    return (
        <div>
            <h2 className="text-lg mt-4">
                Device
            </h2>
            <p className="mb-2">
                Select the device to host the server.
            </p>
            <div>
                <div className="relative">
                    <div className="absolute bottom-11 left-0 w-full rounded-lg max-h-96 overflow-y-scroll">
                        <AnimatePresence>
                            {
                                isExpanded &&
                                <motion.ul
                                    className="mb-1 shadow-2xl"
                                    initial={{ opacity: 0, scale: 0, translateY: 200 }}
                                    animate={{ opacity: 1, scale: 1, translateY: 0 }}
                                    transition={{ duration: 0.15 }}
                                    exit={{ opacity: 0, scale: 0, translateY: 200 }}>
                                    {
                                        devices.map((device, i) => {
                                            return (
                                                <button
                                                    className="w-full h-full bg-neutral-800
                                                hover:bg-neutral-900 duration-150 cursor-pointer"
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedDevice(device);
                                                        setIsExpanded(!isExpanded);
                                                        onDeviceSelect(device);
                                                    }}
                                                >
                                                    <li className="text-neutral-200 font-bold w-full p-4">
                                                        {device}
                                                    </li>
                                                </button>
                                            );
                                        })
                                    }
                                </motion.ul>
                            }
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`w-full p-2 rounded duration-150 cursor-pointer
                    ${isExpanded ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-900"
                                : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300"}
                    `}>
                        {selectedDevice === "" ? "Please select a device" : selectedDevice}
                    </button>
                </div>
            </div>
        </div>
    );
}


const CreateService = () => {
    const location = useLocation();
    const tokens = location.pathname.split("/").filter(e => e !== "");
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const [device, setDevice] = useState<string>("")
    const nameRef = useRef<HTMLInputElement | null>(null);
    const domainRef = useRef<HTMLInputElement | null>(null);
    const hostRef = useRef<HTMLInputElement | null>(null);
    const portRangeRef = useRef<HTMLInputElement | null>(null);

    const inputItems: CreatePopupWindowItem[] = [
        {
            label: "Name",
            placeholder: "eg. My Web Server",
            description: "The name of your server in tunnl.app.",
            ref: nameRef
        },
        {
            label: "Domain",
            placeholder: "eg. my.web.server",
            description: "The domain where your service can be accessed.",
            ref: domainRef,
        },
        {
            label: "Host",
            placeholder: "eg. 127.0.0.1",
            description: "The address of the machine hosting the service.",
            ref: hostRef,
        },
        {

            label: "Port Range",
            placeholder: "eg. 443;80;100-200",
            description: "The ports needed to access your service.",
            ref: portRangeRef,
        },
    ]

    const onSubmit = async () => {
        if (!nameRef.current || !domainRef.current || !hostRef.current || !portRangeRef.current || !user) {
            return;
        }

        if (nameRef.current.value === ""
            || domainRef.current.value === ""
            || hostRef.current.value === ""
            || portRangeRef.current.value === ""
        ) {
            return;
        }

        const d = user.devices.find(d => d.name === device);

        if (!d) return;

        const data = {
            name: nameRef.current.value.trim(),
            domain: domainRef.current.value.trim(),
            host: hostRef.current.value.trim(),
            portRange: portRangeRef.current.value.trim(),
            deviceID: d.id,
        }

        const response = await postService(
            data.name, data.domain, data.host,
            data.portRange, data.deviceID, user.token
        );

        console.log(response.data.service);

        if (response.status === 201) {
            user.services.push(response.data.service);
            setUser(user);
            navigate(`/services/${data.name}`)
        }
    }

    return (
        <AnimatePresence>
            {
                tokens.length >= 2 && tokens[1] === "create" &&
                <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                    <PopupWindow
                        onClickOff={() => navigate("/services")}
                        className="w-[400px] max-h-[500px] bg-neutral-700 shadow-2xl
                            text-neutral-200 rounded-lg">
                        <div className="w-full h-full p-6 flex flex-col">
                            <h1 className="text-center w-full text-2xl mb-4
                                    border-neutral-200 border-b-2 pb-3">
                                Create a Service
                            </h1>
                            <div className="flex flex-col">
                                <form onSubmit={(e) => e.preventDefault()}
                                    className="flex flex-col max-h-[400px]">
                                    <div className="overflow-y-auto max-h-full scroll-m-4">
                                        {
                                            inputItems.map((elem, i) => {
                                                return (
                                                    <PopupWindowInput
                                                        ref={elem.ref}
                                                        key={i}
                                                        className={i === 0 ? "" : "mt-3"}
                                                        placeholder={elem.placeholder}
                                                        description={elem.description}
                                                        label={elem.label} />
                                                );
                                            })
                                        }
                                        <DevicesSelection
                                            devices={!user ? [] : user.devices.map(d => d.name)}
                                            onDeviceSelect={(d) => setDevice(d)} />
                                    </div>
                                    <button
                                        onClick={async () => onSubmit()}
                                        type="button"
                                        className="rounded mt-6 mb-2 bg-neutral-800 w-full text-center
                                                py-2 hover:bg-neutral-200 hover:text-neutral-800
                                                duration-150 cursor-pointer">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </PopupWindow>
                </motion.div>
            }
        </AnimatePresence>
    );
}

const ServicePage = ({ name }: { name: string }) => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const descriptionRef = useRef<HTMLDivElement>(null);

    if (!user) navigate("/login");

    const service = user?.services.find(s => s.name === name);
    const deviceName = user?.devices.find(d => d.id === service?.deviceID)?.name;

    return (
        <>
            {
                user &&
                service &&
                <div className="w-full h-full flex justify-center">
                    <div className="max-w-[1200px] w-full p-8 text-2xl flex items-left flex-col">
                        <h1 className="text-6xl font-extrabold mb-8">
                            {decodeURIComponent(name)}
                        </h1>
                        <div>
                            <ul className="flex flex-wrap border-b-2 border-neutral-200 pb-4">
                                <li className="mr-8 mb-4">
                                    <b>Domain</b>&nbsp; <code>{service.domain}</code>
                                </li>
                                <li className="mr-8 mb-4">
                                    <b>Host</b>&nbsp; <code>{service.host}</code>
                                </li>
                                <li className="mr-8 mb-4">
                                    <b>Port Range</b>&nbsp; <code>{service.portRange}</code>
                                </li>
                                <li className="mr-8 mb-4">
                                    <b>Hosting Device</b>&nbsp; <code>{deviceName}</code>
                                </li>
                            </ul>
                        </div>
                        <div className="relative mt-8">
                            {
                                description === "" &&
                                <p className="absolute z-[0] text-neutral-500 pointer-events-none">
                                    Write your description here
                                </p>
                            }
                            <div
                                onInput={() => {
                                    if (descriptionRef.current)
                                        setDescription(descriptionRef.current.innerText.trim());
                                }}
                                ref={descriptionRef}
                                className="border-none focus:outline-none z-10"
                                contentEditable={"plaintext-only"} />
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

const Services = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const tokens = location.pathname.split("/").filter(e => e !== "");
    const activeItemId = tokens.length >= 2 ? tokens[1] : "";
    const { user, setUser } = useUser();
    return (
        <>
            <ListingLayout>
                <div className="h-full flex flex-col bg-neutral-900 px-4 w-[350px]">
                    <h1>
                        Services
                    </h1>
                    <ScrollingList
                        activeItemId={tokens.length >= 2 ? decodeURIComponent(tokens[1]) : ""}
                        listItems={!user ? [] : user.services.map(s => {
                            return {
                                to: `/services/${s.name}`,
                                content: s.name,
                                activeID: s.name,
                                id: s.name,
                                dropdownOptions: [
                                    {
                                        content: <p>Delete</p>,
                                        className: "hover:bg-red-600",
                                        onClick: () => {
                                            deleteService(s.name, user.token);
                                            const newUser = user;
                                            newUser.services = user.services.filter(srv => s.name !== srv.name);
                                            setUser(user);
                                            navigate("/services");
                                        }
                                    },
                                ],
                            }
                        })}>
                    </ScrollingList>
                    <div className="h-24 flex items-center justify-center">
                        <Link to="/services/create"
                            className={`font-bold text-lg hover:bg-white hover:text-black
                            rounded-md px-4 py-1 duration-150
                            ${activeItemId === "create" ? "bg-neutral-700" : ""}`}>
                            Create a service
                        </Link>
                    </div>
                </div>
                <div className="h-full w-full">
                    {
                        tokens.length >= 2 && tokens[1] !== "create" &&
                        <ServicePage name={decodeURIComponent(tokens[1])} />
                    }
                </div>
            </ListingLayout>
            <CreateService />
        </>
    )
}

export default Services;
