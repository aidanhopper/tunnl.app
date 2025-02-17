const NetworksTableRow = ({
    name,
    address,
    type,
    owner,
    members,
}: {
    name: string,
    address: string,
    type: string,
    owner: string,
    members: number,
}) => {
    return (
        <tr className="border-t border-b border-gray-100 hover:bg-gray-50 duration-100 text-black">
            <td className="py-8 px-2 font-semibold content-start">{name}</td>
            <td className="py-8 px-2 font-light content-start text-gray-900">{address}</td>
            <td className="py-8 px-2 font-light content-start text-gray-900">{type}</td>
            <td className="py-8 px-2 font-light content-start text-gray-900">{owner}</td>
            <td className="py-8 px-2 font-light content-start text-gray-900">{members}</td>
            <td className="py-8 px-2 font-light content-start">
                <button className="hover:bg-red-600 text-sm font-bold bg-gray-500 text-white
                    px-2 py-1 rounded-md duration-100">
                    Leave
                </button>
            </td>
        </tr>
    );
}

const NetworksView = ({ networksData }: {
    networksData: {
        name: string,
        address: string,
        type: string,
        owner: string,
        members: number,
    }[]
}) => {
    return (
        <>
            <h1 className="text-5xl mt-8 mb-8 font-semibold">
                Networks you've joined
            </h1>
            <p className="text-xl font-light mb-8 text-gray-500">Manage the networks you are added to.</p>
            <table className="w-full text-xl text-gray-500">
                <thead>
                    <tr className="text-left">
                        <th className="flex-auto py-2">NAME</th>
                        <th className="flex-auto py-2">ADDRESS</th>
                        <th className="flex-auto py-2">TYPE</th>
                        <th className="flex-auto py-2">OWNER</th>
                        <th className="flex-auto py-2">MEMBERS</th>
                        <th className="flex-auto py-2" />
                    </tr>
                </thead>
                <tbody>
                    {
                        networksData.map((data, i) =>
                            <NetworksTableRow
                                key={i}
                                name={data.name}
                                address={data.address}
                                type={data.type}
                                members={data.members}
                                owner={data.owner} />)
                    }
                </tbody>
            </table>
        </>
    );
}

export default NetworksView;
