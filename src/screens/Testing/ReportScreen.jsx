// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { styles, colors } from '../../styles/globalStyles';
// import { ResultItem } from '../../components/common/ResultItem';

// const ReportScreen = ({ onRestart }) => {
//   return (
//     <View>
//       <Text style={[styles.pageTitle, { textAlign: 'center' }]}>Test Report</Text>
//       <Text style={[styles.textSmall, { textAlign: 'center', marginBottom: 16 }]}>
//         Generated on Sept 9, 2025 - Delhi, India
//       </Text>

//       {/* Results */}
//       <ResultItem parameter="pH" value="6.5" status="Slightly Acidic" statusColor={colors.warning} />
//       <ResultItem parameter="Hardness" value="150 ppm" status="Hard" statusColor={colors.danger} />
//       <ResultItem parameter="Lead" value="0 ppb" status="Safe" statusColor={colors.success} />
//       <ResultItem parameter="Iron" value="0.1 ppm" status="Safe" statusColor={colors.success} />
//       <ResultItem parameter="Total Chlorine" value="0.5 ppm" status="Safe" statusColor={colors.success} />

//       {/* Assessment */}
//       <View style={styles.assessmentCard}>
//         <Text style={[styles.cardTitle, { color: colors.primaryDark }]}>Overall Assessment</Text>
//         <Text style={{ color: colors.info }}>
//           Your water is generally safe but shows signs of hardness and is slightly acidic.
//         </Text>
//       </View>

//       {/* Save & Share */}
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
//         <TouchableOpacity style={[styles.button, styles.halfButton, { backgroundColor: '#E5E7EB' }]}>
//           <Text style={[styles.buttonText, { color: '#1F2937' }]}>💾 Save</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.halfButton, { backgroundColor: '#E5E7EB' }]}>
//           <Text style={[styles.buttonText, { color: '#1F2937' }]}>🔗 Share</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Restart */}
//       <TouchableOpacity onPress={onRestart} style={styles.button}>
//         <Text style={styles.buttonText}>Start New Test</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default ReportScreen;

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../../styles/globalStyles';

const ReportScreen = ({ data, onRestart }) => {
  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>No report available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Water Quality Report</Text>
      <Text>{JSON.stringify(data, null, 2)}</Text>
    </ScrollView>
  );
};

export default ReportScreen;
