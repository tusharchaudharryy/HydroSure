import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { styles } from '../styles/globalStyles';
import { BottomNavBar } from '../components/layout/BottomNavBar';
import HomeScreen from '../screens/Home/HomeScreen';
import ShopScreen from '../screens/Shop/ShopScreen';
import TestingFlow from '../screens/Testing/TestingFlow';
import FAQScreen from '../screens/FAQ/FAQScreen';

export const MainAppNavigator = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('testing');

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <HomeScreen />;
            case 'shop': return <ShopScreen />;
            case 'testing': return <TestingFlow />;
            case 'faq': return <FAQScreen />;
            default: return <HomeScreen />;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 28, color: '#2563EB', marginRight: 8 }}>🛡️</Text>
                    <Text style={styles.headerTitle}>HydroSure</Text>
                </View>
                <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                    <Text style={{ fontSize: 20 }}>🚪</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.mainContent}>
                {renderContent()}
            </ScrollView>
            <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
    );
};

