import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/pages/Home';
import AboutUs from './components/pages/AboutUs';
import ContactUs from './components/pages/ContactUs';
import Login from './components/pages/Login';
import AdminDashboard from './components/pages/AdminDashboard';
import ProtectedRoutes from './components/ProtectedRoutes';
import Layout from "./layout/Layout";
import {AuthProvider} from "./AuthContext";
import {fetchWithTokenRefresh} from "./utils/utils";
import React, {useState, useEffect} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import './App.css';

function App() {
    const [currentTime, setCurrentTime] = useState('Time since Epoch!');
    const [csrfToken, setCsrfToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            // Fetch the CSRF token from the flask server using Json.
            const response = await fetchWithTokenRefresh('/get-csrf-token', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCsrfToken(data.csrf_token);
            } else {
                console.error("failed to fetch CSRF Token");
            }
        };
        fetchCsrfToken();

        // Check if user is authenticated and if they are an admin
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token and set authentication state
            fetchWithTokenRefresh('/validate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.isValid) {
                        setIsAuthenticated(true);
                        setIsAdmin(data.role === 'admin');
                    }
                })
                .catch((error) => {
                    console.error('Token validation failed:', error);
                });
        }
    }, []);

    const fetchTime = () => {
        fetch('/time', {
            headers: {
                'X-CSRFToken': csrfToken,
            },
        })
            .then(res => res.json())
            .then(data => {
                setCurrentTime(data.time);
            });
    };


    return (
        <AuthProvider>
            <div className={"container"}>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/AboutUs" element={<AboutUs/>}/>
                            <Route path="/ContactUs" element={<ContactUs/>}/>
                            <Route path="/Login" element={<Login csrfToken={csrfToken}/>}/>
                            <Route path="/admin/dashboard"
                                   element={<ProtectedRoutes isAuthenticated={isAuthenticated} isAdmin={isAdmin}
                                                             element={AdminDashboard}/>}/>
                            <Route path="/" element={<Home/>}/>
                        </Routes>
                    </Layout>
                </Router>
                <div className={"text-center mt-4"}>
                    <button className={"btn btn-primary"} onClick={fetchTime}>
                        {currentTime}
                    </button>
                </div>
            </div>
        </AuthProvider>
    )
        ;
}

export default App;