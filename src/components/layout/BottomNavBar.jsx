// FILE: varify-app/src/components/layout/BottomNavBar.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

const NavItem = ({ icon, label, isActive, onClick, isCentral = false }) => {
    const activeColor = colors.primary;
    const inactiveColor = colors.gray;

    if (isCentral) {
        return (
            <TouchableOpacity onPress={onClick} style={navStyles.navCentralButton}>
                <View style={[navStyles.navCentralIconWrapper, { backgroundColor: isActive ? activeColor : colors.primaryLight }]}>
                    <Text style={{ fontSize: 32 }}>{icon}</Text>
                </View>
                <Text style={[navStyles.navLabel, { color: isActive ? activeColor : inactiveColor }]}>{label}</Text>
            </TouchableOpacity>
        );
    }
    return (
        <TouchableOpacity onPress={onClick} style={navStyles.navButton}>
            <Text style={{ fontSize: 24 }}>{icon}</Text>
            <Text style={[navStyles.navLabel, { color: isActive ? activeColor : inactiveColor }]}>{label}</Text>
        </TouchableOpacity>
    );
};

export const BottomNavBar = ({ activeTab, setActiveTab }) => {
    return (
        <View style={navStyles.navBar}>
            <NavItem icon="🏠" label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon="🛒" label="Shop" isActive={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
            <NavItem icon="🧪" label="Testing" isActive={activeTab === 'testing'} onClick={() => setActiveTab('testing')} isCentral />
            <NavItem icon="❓" label="FAQ" isActive={activeTab === 'faq'} onClick={() => setActiveTab('faq')} />
        </View>
    );
};

const navStyles = StyleSheet.create({
    navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
    navButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 8 },
    navLabel: { fontSize: 12 },
    navCentralButton: { alignItems: 'center', justifyContent: 'center', marginTop: -24 },
    navCentralIconWrapper: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
});

