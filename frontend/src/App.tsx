import Layout from './Layout';
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom"
import Redirect from './Redirect';
import Devices from './Devices'
import Communities from './Communities'
import Services from './Services';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Redirect to="/devices" />} />
                    <Route path="/devices/*" element={<Devices />} />
                    <Route path="/communities/*" element={<Communities />} />
                    <Route path="/services/*" element={<Services />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
