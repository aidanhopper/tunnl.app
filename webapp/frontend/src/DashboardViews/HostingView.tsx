const HostingView = () => {
    return (
        <>
            <h1 className="text-5xl mt-8 mb-8 font-semibold">
                Services you're hosting
            </h1>
            <p className="text-xl font-light mb-8 text-gray-500">
                Manage the services you're hosting on your account.
            </p>
            <table className="w-full text-xl text-gray-500">
                <thead>
                    <tr className="text-left">
                        <th className="flex-auto py-2">NAME</th>
                        <th className="flex-auto py-2">ADDRESS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>asdf</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default HostingView;
