// FILE: varify-app/App.jsx

import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';

import { styles } from './src/styles/globalStyles';
import { SplashScreen } from './src/screens/SplashScreen';
import { AuthScreen } from './src/screens/Auth/AuthScreen';
import { MainAppNavigator } from './src/navigation/MainAppNavigator';

export default function App() {
    const [page, setPage] = useState('splash');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Simulate loading and auth check
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(isAuthenticated ? 'main' : 'login');
        }, 2000);
        return () => clearTimeout(timer);
    }, [isAuthenticated]);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setPage('main');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPage('login');
    }

    const renderPage = () => {
        if (page === 'splash') {
            return <SplashScreen />;
        }
        if (!isAuthenticated) {
            switch (page) {
                case 'login':
                    return <AuthScreen setPage={setPage} onLogin={handleLogin} />;
                case 'signup':
                    return <AuthScreen setPage={setPage} onLogin={handleLogin} isSignup />;
                default:
                    return <AuthScreen setPage={setPage} onLogin={handleLogin} />;
            }
        }
        return <MainAppNavigator onLogout={handleLogout} />;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {renderPage()}
        </SafeAreaView>
    );
}



