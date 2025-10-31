// Testing.zip/Testing/ReportScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { styles, colors } from '../../styles/globalStyles';
import { ResultItem } from '../../components/common/ResultItem';

// A helper to determine status color (you can customize this)
const getStatusColor = (param, value) => {
  // This is a simple example. You can build complex logic here.
  if (param === 'pH' && (value < 6.5 || value > 7.5)) return colors.warning;
  if (param === 'HARDNESS' && parseFloat(value) > 120) return colors.danger;
  if (param === 'LEAD' && parseFloat(value) > 0) return colors.danger;
  
  return colors.success; // Default to safe
};

const ReportScreen = ({ reportData, onRestart }) => {

  // Handle case where data might be missing
  if (!reportData) {
    return (
      <View>
        <Text>No report data found.</Text>
        <TouchableOpacity onPress={onRestart} style={styles.button}>
          <Text style={styles.buttonText}>Start New Test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView>
      <Text style={[styles.pageTitle, { textAlign: 'center' }]}>Test Report</Text>
      <Text style={[styles.textSmall, { textAlign: 'center', marginBottom: 16 }]}>
        {/* Use dynamic timestamp */}
        Generated on {new Date(reportData.timestamp).toLocaleString()}
      </Text>

      {/* Dynamic Results from API */}
      <FlatList
        data={reportData.results}
        keyExtractor={(item) => item.parameter}
        renderItem={({ item }) => (
          <ResultItem 
            parameter={item.parameter}
            value={`${item.matched_value} ${item.unit}`}
            status={`(HEX: ${item.matched_hex})`} // You can add status logic
            statusColor={getStatusColor(item.parameter, item.matched_value)}
          />
        )}
      />

      {/* Assessment from AI Summary */}
      <View style={styles.assessmentCard}>
        <Text style={[styles.cardTitle, { color: colors.primaryDark }]}>Overall Assessment</Text>
        <Text style={{ color: colors.info, lineHeight: 22 }}>
          {reportData.ai_summary}
        </Text>
      </View>

      {/* ... (Save & Share buttons) ... */}

      {/* Restart */}
      <TouchableOpacity onPress={onRestart} style={[styles.button, {marginBottom: 40}]}>
        <Text style={styles.buttonText}>Start New Test</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReportScreen;