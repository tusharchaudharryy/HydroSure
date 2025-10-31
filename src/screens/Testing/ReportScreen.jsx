// Testing.zip/Testing/ReportScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native'; // Import FlatList
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.pageTitle}>Error</Text>
        <Text style={styles.textSmall}>No report data found.</Text>
        <TouchableOpacity onPress={onRestart} style={[styles.button, { marginTop: 20 }]}>
          <Text style={styles.buttonText}>Start New Test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- We move the non-list items into Header/Footer components ---

  const renderHeader = () => (
    <>
      <Text style={[styles.pageTitle, { textAlign: 'center' }]}>Test Report</Text>
      <Text style={[styles.textSmall, { textAlign: 'center', marginBottom: 16 }]}>
        Generated on {new Date(reportData.timestamp).toLocaleString()}
      </Text>
    </>
  );

  const renderFooter = () => (
    <>
      {/* Assessment from AI Summary */}
      <View style={styles.assessmentCard}>
        <Text style={[styles.cardTitle, { color: colors.primaryDark }]}>Overall Assessment</Text>
        <Text style={{ color: colors.info, lineHeight: 22 }}>
          {reportData.ai_summary}
        </Text>
      </View>

      {/* Save & Share */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
        <TouchableOpacity style={[styles.button, styles.halfButton, { backgroundColor: '#E5E7EB' }]}>
          <Text style={[styles.buttonText, { color: '#1F2937' }]}>💾 Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.halfButton, { backgroundColor: '#E5E7EB' }]}>
          <Text style={[styles.buttonText, { color: '#1F2937' }]}>🔗 Share</Text>
        </TouchableOpacity>
      </View>

      {/* Restart */}
      <TouchableOpacity onPress={onRestart} style={[styles.button, {marginBottom: 40}]}>
        <Text style={styles.buttonText}>Start New Test</Text>
      </TouchableOpacity>
    </>
  );

  // --- Use FlatList as the main component, NOT ScrollView ---
  return (
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
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      // Add padding to the whole list
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
    />
  );
};

export default ReportScreen;