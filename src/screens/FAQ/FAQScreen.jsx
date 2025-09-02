// FILE: varify-app/src/screens/FAQ/FAQScreen.jsx

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/globalStyles';

const FAQScreen = () => (
    <View>
        <Text style={styles.pageTitle}>Frequently Asked Questions</Text>
        <View style={{ marginVertical: 8 }}>
            <Text style={styles.sectionTitle}>How accurate are the tests?</Text>
            <Text style={styles.textSmall}>Our tests are calibrated to provide highly accurate readings for home use. For certified results, please consult a professional lab.</Text>
        </View>
        <View style={{ marginVertical: 8 }}>
            <Text style={styles.sectionTitle}>How often should I test my water?</Text>
            <Text style={styles.textSmall}>We recommend testing your water every 3-6 months, or if you notice any change in taste, smell, or appearance.</Text>
        </View>
    </View>
);

export default FAQScreen;

