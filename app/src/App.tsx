import Layout from './Layout';
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import Redirect from './Redirect';
import Devices from './Devices'
import Communities from './Communities'
import Services from './Services';
import Login from './Login';
import RegisterDevice from './RegisterDevice';
import { UserProvider, useUser } from './UserContext';
import Store from './store';
import authenticate from './authenticate';

const CheckCurrentUser = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    if (!user) {
        Store.get("current user").then(email => {
            if (!email) {
                setUser(null);
                return;
            }
            authenticate(email).then(u => {
                if (!u) {
                    navigate("/login");
                    setUser(null);
                    return;
                }
                setUser(u);
            })
        })
    }

    return (
        <>
            {children}
        </>
    );
}

function App() {
    return (
        <UserProvider>
            <Router>
                <CheckCurrentUser>
                    <Routes>
                        <Route path="/devices/*" element={<Layout><Devices /></Layout>} />
                        <Route path="/communities/*" element={<Layout><Communities /></Layout>} />
                        <Route path="/services/*" element={<Layout><Services /></Layout>} />
                        <Route path="/settings/*" element={<Layout><h1>Settings</h1></Layout>} />
                        <Route path="/" element={<Redirect to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register/device" element={<RegisterDevice />} />
                    </Routes>
                </CheckCurrentUser>
            </Router >
        </UserProvider>
    );
}

export default App;
