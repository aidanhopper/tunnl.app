const Success = () => {
    return (
        <div className="w-screen h-screen bg-neutral-800 flex items-center flex-col
            justify-center text-neutral-200">
            <h1 className="text-3xl font-bold">Successfully logged in</h1>
            <div className="w-1 h-8" />
            <p className="text-xl">Go back to <code>tunnl.app</code> to continue</p>
        </div>
    );
}

export default Success;
