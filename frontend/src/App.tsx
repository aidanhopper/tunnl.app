import { UserContextProvider } from './UserContext';
import Landing from './Landing';
import Dashboard from './Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router';
import Login from './Login';
import Register from './Register';

const App = () => {
    return (
        <UserContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/login" element={<Login redirectTo="/dashboard/networks" />} />
                    <Route path="/register" element={<Register redirectTo="/" />} />
                </Routes>
            </BrowserRouter>
        </UserContextProvider>
    );
}

export default App;
