import Layout from './Layout';
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import Redirect from './Redirect';
import Devices from './Devices'
import Communities from './Communities'
import Services from './Services';
import Login from './Login';
import { useState } from 'react';

function App() {
    const [user, setUser] = useState(0);

    return (
        <Router>
            <Routes>
                <Route path="/devices/*" element={<Layout><Devices /></Layout>} />
                <Route path="/communities/*" element={<Layout><Communities /></Layout>} />
                <Route path="/services/*" element={<Layout><Services /></Layout>} />
                <Route path="/settings/*" element={<Layout><h1>Settings</h1></Layout>} />
                <Route path="/" element={<Redirect to="/devices" />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router >
    );
}

export default App;
