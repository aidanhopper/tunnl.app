import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Success from './Success';

function App() {
    console.log('hello world');
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/success" element={<Success />} />
            </Routes>
        </Router >
    )
}

export default App;
