import React, { useState, useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './src/firebase'; // Import auth from your firebase config
import { NavigationContainer } from "@react-navigation/native";

import { styles } from './src/styles/globalStyles';
import { SplashScreen } from './src/screens/SplashScreen';
import { AuthScreen } from './src/screens/Auth/AuthScreen';
import { MainAppNavigator } from './src/navigation/MainAppNavigator';

export default function App() {
    const [showSplash, setShowSplash] = useState(true); // For splash screen
    const [page, setPage] = useState('splash');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // To handle initial auth check
    const [user, setUser] = useState(null); // <-- Add state to hold the user object

    useEffect(() => {

        const splashTimer = setTimeout(() => {
            setShowSplash(false);
        }, 5000); 

        // onAuthStateChanged returns an unsubscribe function
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // <-- Store the full user object from Firebase
            if (currentUser) {
                // User is signed in
                setIsAuthenticated(true);
            } else {
                // User is signed out
                setIsAuthenticated(false);
            }
            // Finished checking auth state
            setIsLoading(false);
            setPage(currentUser ? 'main' : 'login');
        });

        return () => {
            clearTimeout(splashTimer);
            unsubscribe();
        };
    }, []);

    const handleLogin = () => {
        // This is now handled by onAuthStateChanged,
        // but we can keep it to manually set the page if needed,
        // though it's better to rely on the listener.
        setIsAuthenticated(true);
        setPage('main');
    };

    const handleLogout = () => {
        signOut(auth).catch(error => console.error("Sign out error", error));
        // The onAuthStateChanged listener will handle setting isAuthenticated to false
    }

    // if (isLoading) {
    //     // You can show a loading spinner or splash screen while checking auth
    //     return (
    //         <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
    //             <ActivityIndicator size="large" />
    //         </View>
    //     );
    // }
    // Step 1: Show SplashScreen first
    if (showSplash) {
        return <SplashScreen />;
    }

    // Step 2: If still loading auth after splash, you can fallback to splash or loader
    if (isLoading) {
        return <SplashScreen />;
    }

    const renderPage = () => {
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
        // Pass the user object as a prop to the navigator

        return (
            <NavigationContainer>
                <MainAppNavigator user={user} onLogout={handleLogout} />
            </NavigationContainer>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {renderPage()}
        </SafeAreaView>
    );
}
