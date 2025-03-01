import { postAuthGoogle } from './API';

const handleLogin = (token: string) => {
    postAuthGoogle(token).then(d => console.log(d));
}

const Login = () => {
    window.ipcRenderer.on('login-event', (_, data) => handleLogin(data));
    return (
        <div className="w-screen h-screen bg-neutral-900 flex items-center justify-center">
            <button className="bg-neutral-800 w-[200px] h-[200px] flex items-center
                justify-center p-8 duration-150 hover:bg-white hover:text-black group
                shadow-[5px_5px_4px_1px_rgb(20,20,20)] cursor-pointer"
                onClick={() => window.ipcRenderer.invoke("openLinkInBrowser", "https://tunnl.app/login")}>
                <p className="font-bold text-neutral-400 group-hover:text-black
                    text-xl p-2 rounded duration-150">
                    Login with the browser
                </p>
            </button>
        </div>
    );
}

export default Login;
