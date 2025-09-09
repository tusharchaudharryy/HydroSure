import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/globalStyles';

export const ResultItem = ({ parameter, value, status, statusColor }) => (
    <View style={styles.historyItem}>
        <View>
            <Text style={{ fontWeight: 'bold' }}>{parameter}</Text>
            <Text style={styles.textSmall}>{value}</Text>
        </View>
        <Text style={{ fontWeight: 'bold', color: statusColor }}>{status}</Text>
    </View>
);

