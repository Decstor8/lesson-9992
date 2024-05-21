import './App.css';
import AppToolbar from './components/AppToolbar';
import {Route, Routes} from 'react-router-dom';
import Login from './features/Users/Login';
import Register from './features/Users/Register';
import { Alert } from '@mui/material';
import ProtectedRoute from './components/route/Route';
import {useAppSelector} from './App/hooks';
import {selectUser} from './features/Users/usersSlice';

function App() {
    const user = useAppSelector(selectUser);

    return (
        <>
            <header>
                <AppToolbar />
            </header>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute isAllowed={user && user.role !== ''}>
                        {user && <div>main</div>}
                    </ProtectedRoute>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Alert severity="error">Not found!</Alert>} />
            </Routes>
        </>
    )
}

export default App;
