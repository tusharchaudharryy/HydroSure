// FILE: varify-app/src/screens/Home/HomeScreen.jsx

import React from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from '../../styles/globalStyles';

const HomeScreen = () => (
    <View>
        <Text style={styles.pageTitle}>Dashboard</Text>
        <View style={styles.grid}>
            <View style={[styles.card, { backgroundColor: colors.infoLight, flex: 1, marginRight: 8 }]}>
                <Text style={[styles.cardTitle, { color: colors.primaryDark }]}>Last Test Result</Text>
                <Text>pH: 6.8 (Normal)</Text>
                <Text style={styles.textSmall}>Sept 1, 2025</Text>
            </View>
            <View style={[styles.card, { backgroundColor: colors.successLight, flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.cardTitle, { color: colors.success }]}>Water Quality Status</Text>
                <Text>Good</Text>
            </View>
        </View>
        <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionTitle}>Test History</Text>
            <View style={styles.historyItem}>
                <View>
                    <Text>Test from Aug 28, 2025</Text>
                    <Text style={styles.textSmall}>Delhi, India</Text>
                </View>
                <Text style={{ fontWeight: 'bold', color: colors.success }}>Passed</Text>
            </View>
            <View style={styles.historyItem}>
                <View>
                    <Text>Test from Aug 15, 2025</Text>
                    <Text style={styles.textSmall}>Delhi, India</Text>
                </View>
                <Text style={{ fontWeight: 'bold', color: colors.warning }}>Warning</Text>
            </View>
        </View>
    </View>
);

export default HomeScreen;

