import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { styles, colors } from '../../styles/globalStyles';

// Let's create a fake function to simulate fetching data from a server
const fetchDashboardData = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                lastTest: {
                    ph: (Math.random() * (7.5 - 6.5) + 6.5).toFixed(1), // Random pH between 6.5 and 7.5
                    date: 'Sept 6, 2025',
                },
                qualityStatus: 'Good',
                history: [
                    { id: 1, date: 'Aug 28, 2025', location: 'Delhi, India', status: 'Passed', color: colors.success },
                    { id: 2, date: 'Aug 15, 2025', location: 'Delhi, India', status: 'Warning', color: colors.warning },
                ]
            });
        }, 1000); // Simulate a 1-second network delay
    });
};


const HomeScreen = () => {
    // 1. STATE MANAGEMENT
    // State to hold our dashboard data. It's null initially.
    const [dashboardData, setDashboardData] = useState(null);
    // State to know if we are currently loading data.
    const [isLoading, setIsLoading] = useState(true);

    // 2. DATA FETCHING
    // This function will get the data and update our state
    const loadData = () => {
        setIsLoading(true);
        fetchDashboardData()
            .then(data => {
                setDashboardData(data);
            })
            .catch(error => console.error("Error fetching data:", error))
            .finally(() => {
                setIsLoading(false);
            });
    };

    // useEffect runs once when the component is first rendered
    useEffect(() => {
        loadData();
    }, []); // The empty array [] means this effect runs only once on mount


    // 3. LOADING UI
    // While loading, show a spinner
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 8 }}>Loading Dashboard...</Text>
            </View>
        );
    }
    
    // In case data fetching fails
    if (!dashboardData) {
        return (
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Could not load data. Please try again.</Text>
            </View>
        )
    }

    // 4. DYNAMIC & INTERACTIVE UI
    // Once loaded, show the data from our state
    return (
        <View>
            <Text style={styles.pageTitle}>Dashboard</Text>
            <View style={styles.grid}>
                <View style={[styles.card, { backgroundColor: colors.infoLight, flex: 1, marginRight: 8 }]}>
                    <Text style={[styles.cardTitle, { color: colors.primaryDark }]}>Last Test Result</Text>
                    {/* Use data from state */}
                    <Text>pH: {dashboardData.lastTest.ph} (Normal)</Text>
                    <Text style={styles.textSmall}>{dashboardData.lastTest.date}</Text>
                </View>
                <View style={[styles.card, { backgroundColor: colors.successLight, flex: 1, marginLeft: 8 }]}>
                    <Text style={[styles.cardTitle, { color: colors.success }]}>Water Quality Status</Text>
                    {/* Use data from state */}
                    <Text>{dashboardData.qualityStatus}</Text>
                </View>
            </View>
            <View style={{ marginTop: 24 }}>
                <Text style={styles.sectionTitle}>Test History</Text>
                {/* Map over the history array from state to create a list */}
                {dashboardData.history.map(item => (
                    <View key={item.id} style={styles.historyItem}>
                        <View>
                            <Text>Test from {item.date}</Text>
                            <Text style={styles.textSmall}>{item.location}</Text>
                        </View>
                        <Text style={{ fontWeight: 'bold', color: item.color }}>{item.status}</Text>
                    </View>
                ))}
            </View>
            
            {/* Add an interactive button to refresh the data! */}
            <TouchableOpacity style={styles.button} onPress={loadData}>
                <Text style={styles.buttonText}>Refresh Data</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
