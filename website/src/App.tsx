import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserProvider';
import Landing from './Landing';
import Login from './Login';
import Success from './Success';
import Dashboard from './Dashboard';

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Landing />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/login/success' element={<Success />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
            </Router >
        </UserProvider>
    )
}

export default App;
