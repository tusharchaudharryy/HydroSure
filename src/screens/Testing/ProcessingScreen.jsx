// import React, { useEffect } from 'react';
// import { View, Text, ActivityIndicator } from 'react-native';
// import { styles, colors } from '../../styles/globalStyles';

// const ProcessingScreen = ({ onComplete }) => {
//   useEffect(() => {
//     // Simulate processing for 3 seconds
//     const timer = setTimeout(() => {
//       onComplete();
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [onComplete]);

//   return (
//     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//       <ActivityIndicator size="large" color={colors.accent} />
//       <Text style={[styles.pageTitle, { marginTop: 20 }]}>Analyzing your test...</Text>
//       <Text style={[styles.textSmall, { marginTop: 10, textAlign: 'center', paddingHorizontal: 20 }]}>
//         Please wait while we process the images and generate your report.
//       </Text>
//     </View>
//   );
// };

// export default ProcessingScreen;

// import React, { useEffect } from 'react';
// import { View, Text, ActivityIndicator, Alert } from 'react-native';
// import { styles, colors } from '../../styles/globalStyles';
// import firestore from '@react-native-firebase/firestore';
// import { db } from "../../firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";


// const ProcessingScreen = ({ chartImage, stripImage, onComplete }) => {
//   useEffect(() => {
//     const analyzeStrip = async () => {
//       try {
//         const response = await fetch("http://YOUR_BACKEND_URL/analyze-strip", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             chart: chartImage,   // base64 string from capture
//             strip: stripImage,   // base64 string from capture
//           }),
//         });

//         const data = await response.json();
//         const results = JSON.parse(data.results); // GPT response is JSON text

//         // Save to Firestore
//         await firestore().collection("waterReports").add({
//           createdAt: new Date(),
//           results,
//         });

//         onComplete(results); // pass results forward
//       } catch (error) {
//         console.error("Error analyzing strip:", error);
//         Alert.alert("Error", "Failed to analyze strip. Please try again.");
//         onComplete(null);
//       }
//     };

//     analyzeStrip();
//   }, [chartImage, stripImage, onComplete]);

//   return (
//     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//       <ActivityIndicator size="large" color={colors.accent} />
//       <Text style={[styles.pageTitle, { marginTop: 20 }]}>Analyzing your test...</Text>
//       <Text style={[styles.textSmall, { marginTop: 10, textAlign: 'center', paddingHorizontal: 20 }]}>
//         Please wait while we process the images and generate your report.
//       </Text>
//     </View>
//   );
// };

// export default ProcessingScreen;

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { styles, colors } from '../../styles/globalStyles';
import firestore from '@react-native-firebase/firestore';

const ProcessingScreen = ({ chartImage, stripImage, onComplete }) => {
  useEffect(() => {
    const analyzeStrip = async () => {
      try {
        const response = await fetch("http://YOUR_BACKEND_URL/analyze-strip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chart: chartImage,   // base64 string from capture
            strip: stripImage,   // base64 string from capture
          }),
        });

        const data = await response.json();
        const results = JSON.parse(data.results); // GPT response is JSON text

        // Save JSON results to Firestore
        await firestore().collection("waterReports").add({
          createdAt: firestore.FieldValue.serverTimestamp(),
          results, // saves entire JSON
        });

        onComplete(results);
      } catch (error) {
        console.error("Error analyzing strip:", error);
        Alert.alert("Error", "Failed to analyze strip. Please try again.");
        onComplete(null);
      }
    };

    analyzeStrip();
  }, [chartImage, stripImage, onComplete]);

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[styles.pageTitle, { marginTop: 20 }]}>Analyzing your test...</Text>
      <Text style={[styles.textSmall, { marginTop: 10, textAlign: 'center', paddingHorizontal: 20 }]}>
        Please wait while we process the images and generate your report.
      </Text>
    </View>
  );
};

export default ProcessingScreen;

