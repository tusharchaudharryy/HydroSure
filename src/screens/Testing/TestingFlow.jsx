// // Testing.zip/Testing/TestingFlow.jsx
// import React, { useState } from 'react';
// import { View } from 'react-native';
// import InstructionScreen from './InstructionScreen';
// import ImageCapture from './ImageCapture';
// import ProcessingScreen from './ProcessingScreen';
// import ReportScreen from './ReportScreen';

// const TestingFlow = () => {
//   const [testStep, setTestStep] = useState('instructions');
  
//   // --- ADD STATE TO HOLD DATA ---
//   const [chartImage, setChartImage] = useState(null);
//   const [stripImage, setStripImage] = useState(null);
//   const [reportData, setReportData] = useState(null);

//   const handleRestart = () => {
//     setChartImage(null);
//     setStripImage(null);
//     setReportData(null);
//     setTestStep('instructions');
//   };

//   const renderTestStep = () => {
//     switch (testStep) {
//       case 'instructions':
//         return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
//       case 'captureChart':
//         return (
//           <ImageCapture
//             type="Chart"
//             // --- Pass data up on "onNext" ---
//             onNext={(imageAsset) => {
//               setChartImage(imageAsset);
//               setTestStep('captureLitmus');
//             }}
//             onBack={() => setTestStep('instructions')}
//           />
//         );
//       case 'captureLitmus':
//         return (
//           <ImageCapture
//             type="Litmus Paper"
//             // --- Pass data up and move to processing ---
//             onNext={(imageAsset) => {
//               setStripImage(imageAsset);
//               setTestStep('processing');
//             }}
//             onBack={() => setTestStep('captureChart')}
//           />
//         );
//       case 'processing':
//         return (
//           <ProcessingScreen
//             // --- Pass images to the processing screen ---
//             chartImage={chartImage}
//             stripImage={stripImage}
//             onComplete={(data) => {
//               setReportData(data);
//               setTestStep('report');
//             }}
//             onBack={() => setTestStep('captureLitmus')} // Add a way to go back
//           />
//         );
//       case 'report':
//         return (
//           <ReportScreen 
//             // --- Pass the final report data ---
//             reportData={reportData} 
//             onRestart={handleRestart} 
//           />
//         );
//       default:
//         return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
//     }
//   };

//   return <View>{renderTestStep()}</View>;
// };

// export default TestingFlow;

// import React, { useState } from 'react';
// import { View, StyleSheet, LinearGradient } from 'react-native';
// import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient'; // use expo-gradient if available
// import InstructionScreen from './InstructionScreen';
// import ImageCapture from './ImageCapture';
// import ProcessingScreen from './ProcessingScreen';
// import ReportScreen from './ReportScreen';

// const TestingFlow = () => {
//   const [testStep, setTestStep] = useState('instructions');

//   // --- Data holders ---
//   const [chartImage, setChartImage] = useState(null);
//   const [stripImage, setStripImage] = useState(null);
//   const [reportData, setReportData] = useState(null);

//   const handleRestart = () => {
//     setChartImage(null);
//     setStripImage(null);
//     setReportData(null);
//     setTestStep('instructions');
//   };

//   const renderTestStep = () => {
//     switch (testStep) {
//       case 'instructions':
//         return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
//       case 'captureChart':
//         return (
//           <ImageCapture
//             type="Chart"
//             onNext={(imageAsset) => {
//               setChartImage(imageAsset);
//               setTestStep('captureLitmus');
//             }}
//             onBack={() => setTestStep('instructions')}
//           />
//         );
//       case 'captureLitmus':
//         return (
//           <ImageCapture
//             type="Litmus Paper"
//             onNext={(imageAsset) => {
//               setStripImage(imageAsset);
//               setTestStep('processing');
//             }}
//             onBack={() => setTestStep('captureChart')}
//           />
//         );
//       case 'processing':
//         return (
//           <ProcessingScreen
//             chartImage={chartImage}
//             stripImage={stripImage}
//             onComplete={(data) => {
//               setReportData(data);
//               setTestStep('report');
//             }}
//             onBack={() => setTestStep('captureLitmus')}
//           />
//         );
//       case 'report':
//         return (
//           <ReportScreen 
//             reportData={reportData} 
//             onRestart={handleRestart} 
//           />
//         );
//       default:
//         return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
//     }
//   };

//   return (
//     <ExpoLinearGradient
//       colors={['#E8F9FA', '#F8FCFF']}
//       style={styles.gradientContainer}
//     >
//       <View style={styles.innerContainer}>
//         {renderTestStep()}
//       </View>
//     </ExpoLinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   innerContainer: {
//     flex: 1,
//     width: '100%',
//     maxWidth: 480,
//     alignSelf: 'center',
//   },
// });

// export default TestingFlow;


// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient'; // ✅ Works without Expo
// import InstructionScreen from './InstructionScreen';
// import ImageCapture from './ImageCapture';
// import ProcessingScreen from './ProcessingScreen';
// import ReportScreen from './ReportScreen';

// const TestingFlow = () => {
//   const [testStep, setTestStep] = useState('instructions');

//   const [chartImage, setChartImage] = useState(null);
//   const [stripImage, setStripImage] = useState(null);
//   const [reportData, setReportData] = useState(null);

//   const handleRestart = () => {
//     setChartImage(null);
//     setStripImage(null);
//     setReportData(null);
//     setTestStep('instructions');
//   };

//   const renderTestStep = () => {
//     switch (testStep) {
//       case 'instructions':
//         return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
//       case 'captureChart':
//         return (
//           <ImageCapture
//             type="Chart"
//             onNext={(imageAsset) => {
//               setChartImage(imageAsset);
//               setTestStep('captureLitmus');
//             }}
//             onBack={() => setTestStep('instructions')}
//           />
//         );
//       case 'captureLitmus':
//         return (
//           <ImageCapture
//             type="Litmus Paper"
//             onNext={(imageAsset) => {
//               setStripImage(imageAsset);
//               setTestStep('processing');
//             }}
//             onBack={() => setTestStep('captureChart')}
//           />
//         );
//       case 'processing':
//         return (
//           <ProcessingScreen
//             chartImage={chartImage}
//             stripImage={stripImage}
//             onComplete={(data) => {
//               setReportData(data);
//               setTestStep('report');
//             }}
//             onBack={() => setTestStep('captureLitmus')}
//           />
//         );
//       case 'report':
//         return (
//           <ReportScreen
//             reportData={reportData}
//             onRestart={handleRestart}
//           />
//         );
//       default:
//         return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
//     }
//   };

//   return (
//     <LinearGradient
//       colors={['#E8F9FA', '#F8FCFF']}
//       style={styles.gradientContainer}
//     >
//       <View style={styles.innerContainer}>
//         {renderTestStep()}
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   innerContainer: {
//     flex: 1,
//     width: '100%',
//     maxWidth: 480,
//     alignSelf: 'center',
//   },
// });

// export default TestingFlow;

// import React, { useState } from "react";
// import { View, StyleSheet, StatusBar } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import InstructionScreen from "./InstructionScreen";
// import ImageCapture from "./ImageCapture";
// import ProcessingScreen from "./ProcessingScreen";
// import ReportScreen from "./ReportScreen";

// const TestingFlow = () => {
//   const [testStep, setTestStep] = useState("instructions");
//   const [chartImage, setChartImage] = useState(null);
//   const [stripImage, setStripImage] = useState(null);
//   const [reportData, setReportData] = useState(null);

//   const handleRestart = () => {
//     setChartImage(null);
//     setStripImage(null);
//     setReportData(null);
//     setTestStep("instructions");
//   };

//   const renderTestStep = () => {
//     switch (testStep) {
//       case "instructions":
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//       case "captureChart":
//         return (
//           <ImageCapture
//             type="Chart"
//             onNext={(imageAsset) => {
//               setChartImage(imageAsset);
//               setTestStep("captureLitmus");
//             }}
//             onBack={() => setTestStep("instructions")}
//           />
//         );
//       case "captureLitmus":
//         return (
//           <ImageCapture
//             type="Litmus Paper"
//             onNext={(imageAsset) => {
//               setStripImage(imageAsset);
//               setTestStep("processing");
//             }}
//             onBack={() => setTestStep("captureChart")}
//           />
//         );
//       case "processing":
//         return (
//           <ProcessingScreen
//             chartImage={chartImage}
//             stripImage={stripImage}
//             onComplete={(data) => {
//               setReportData(data);
//               setTestStep("report");
//             }}
//             onBack={() => setTestStep("captureLitmus")}
//           />
//         );
//       case "report":
//         return (
//           <ReportScreen
//             reportData={reportData}
//             onRestart={handleRestart}
//           />
//         );
//       default:
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//     }
//   };

//   return (
//     <LinearGradient
//       colors={["#00C6FF", "#0072FF"]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.gradientContainer}
//     >
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
//       <View style={styles.glassCard}>
//         {renderTestStep()}
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   glassCard: {
//     flex: 1,
//     width: "90%",
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     borderRadius: 28,
//     paddingVertical: 20,
//     paddingHorizontal: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 10,
//     elevation: 8,
//     backdropFilter: "blur(10px)",
//   },
// });

// export default TestingFlow;


// import React, { useState } from "react";
// import { View, StyleSheet, StatusBar } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import InstructionScreen from "./InstructionScreen";
// import ImageCapture from "./ImageCapture";
// import ProcessingScreen from "./ProcessingScreen";
// import ReportScreen from "./ReportScreen";

// const TestingFlow = () => {
//   const [testStep, setTestStep] = useState("instructions");
//   const [chartImage, setChartImage] = useState(null);
//   const [stripImage, setStripImage] = useState(null);
//   const [reportData, setReportData] = useState(null);

//   const handleRestart = () => {
//     setChartImage(null);
//     setStripImage(null);
//     setReportData(null);
//     setTestStep("instructions");
//   };

//   const renderTestStep = () => {
//     switch (testStep) {
//       case "instructions":
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//       case "captureChart":
//         return (
//           <ImageCapture
//             type="Chart"
//             onNext={(imageAsset) => {
//               setChartImage(imageAsset);
//               setTestStep("captureLitmus");
//             }}
//             onBack={() => setTestStep("instructions")}
//           />
//         );
//       case "captureLitmus":
//         return (
//           <ImageCapture
//             type="Litmus Paper"
//             onNext={(imageAsset) => {
//               setStripImage(imageAsset);
//               setTestStep("processing");
//             }}
//             onBack={() => setTestStep("captureChart")}
//           />
//         );
//       case "processing":
//         return (
//           <ProcessingScreen
//             chartImage={chartImage}
//             stripImage={stripImage}
//             onComplete={(data) => {
//               setReportData(data);
//               setTestStep("report");
//             }}
//             onBack={() => setTestStep("captureLitmus")}
//           />
//         );
//       case "report":
//         return (
//           <ReportScreen
//             reportData={reportData}
//             onRestart={handleRestart}
//           />
//         );
//       default:
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//     }
//   };

//   return (
//     <LinearGradient
//       colors={["#EFFFFD", "#D9FBF4", "#FFFFFF"]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.gradientContainer}
//     >
//       <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
//       <View style={styles.glassOverlay}>
//         {renderTestStep()}
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   glassOverlay: {
//     flex: 1,
//     width: "95%",
//     marginVertical: 25,
//     borderRadius: 30,
//     paddingVertical: 20,
//     paddingHorizontal: 18,
//     backgroundColor: "rgba(255, 255, 255, 0.25)",
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.4)",
//     shadowColor: "#00A8B5",
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 20,
//     elevation: 10,
//   },
// });

// export default TestingFlow;


// import React, { useState } from "react";
// import { View, StyleSheet, StatusBar } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import InstructionScreen from "./InstructionScreen";
// import ImageCapture from "./ImageCapture";
// import ProcessingScreen from "./ProcessingScreen";
// import ReportScreen from "./ReportScreen";

// const TestingFlow = () => {
//   const [testStep, setTestStep] = useState("instructions");
//   const [chartImage, setChartImage] = useState(null);
//   const [stripImage, setStripImage] = useState(null);
//   const [reportData, setReportData] = useState(null);

//   const handleRestart = () => {
//     setChartImage(null);
//     setStripImage(null);
//     setReportData(null);
//     setTestStep("instructions");
//   };

//   const renderTestStep = () => {
//     switch (testStep) {
//       case "instructions":
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//       case "captureChart":
//         return (
//           <ImageCapture
//             type="Chart"
//             onNext={(imageAsset) => {
//               setChartImage(imageAsset);
//               setTestStep("captureLitmus");
//             }}
//             onBack={() => setTestStep("instructions")}
//           />
//         );
//       case "captureLitmus":
//         return (
//           <ImageCapture
//             type="Litmus Paper"
//             onNext={(imageAsset) => {
//               setStripImage(imageAsset);
//               setTestStep("processing");
//             }}
//             onBack={() => setTestStep("captureChart")}
//           />
//         );
//       case "processing":
//         return (
//           <ProcessingScreen
//             chartImage={chartImage}
//             stripImage={stripImage}
//             onComplete={(data) => {
//               setReportData(data);
//               setTestStep("report");
//             }}
//             onBack={() => setTestStep("captureLitmus")}
//           />
//         );
//       case "report":
//         return (
//           <ReportScreen
//             reportData={reportData}
//             onRestart={handleRestart}
//           />
//         );
//       default:
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//     }
//   };

//   return (
//     <LinearGradient
//       colors={["#EFFFFD", "#D9FBF4", "#FFFFFF"]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.gradientContainer}
//     >
//       <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
//       <View style={styles.glassOverlay}>
//         {renderTestStep()}
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   glassOverlay: {
//     flex: 1,
//     width: "95%",
//     marginVertical: 25,
//     borderRadius: 30,
//     paddingVertical: 20,
//     paddingHorizontal: 18,
//     backgroundColor: "rgba(255, 255, 255, 0.25)",
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.4)",
//     shadowColor: "#00A8B5",
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 20,
//     elevation: 10,
//   },
// });

// export default TestingFlow;


// import React, { useState } from "react";
// import { View, StyleSheet, StatusBar } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import InstructionScreen from "./InstructionScreen";
// import ImageCapture from "./ImageCapture";
// import ProcessingScreen from "./ProcessingScreen";
// import ReportScreen from "./ReportScreen";

// const TestingFlow = () => {
//   const [testStep, setTestStep] = useState("instructions");
//   const [chartImage, setChartImage] = useState(null);
//   const [stripImage, setStripImage] = useState(null);
//   const [reportData, setReportData] = useState(null);

//   const handleRestart = () => {
//     setChartImage(null);
//     setStripImage(null);
//     setReportData(null);
//     setTestStep("instructions");
//   };

//   const renderTestStep = () => {
//     switch (testStep) {
//       case "instructions":
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//       case "captureChart":
//         return (
//           <ImageCapture
//             type="Chart"
//             onNext={(imageAsset) => {
//               setChartImage(imageAsset);
//               setTestStep("captureLitmus");
//             }}
//             onBack={() => setTestStep("instructions")}
//           />
//         );
//       case "captureLitmus":
//         return (
//           <ImageCapture
//             type="Litmus Paper"
//             onNext={(imageAsset) => {
//               setStripImage(imageAsset);
//               setTestStep("processing");
//             }}
//             onBack={() => setTestStep("captureChart")}
//           />
//         );
//       case "processing":
//         return (
//           <ProcessingScreen
//             chartImage={chartImage}
//             stripImage={stripImage}
//             onComplete={(data) => {
//               setReportData(data);
//               setTestStep("report");
//             }}
//             onBack={() => setTestStep("captureLitmus")}
//           />
//         );
//       case "report":
//         return <ReportScreen reportData={reportData} onRestart={handleRestart} />;
//       default:
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//     }
//   };

//   return (
//     <LinearGradient
//       colors={["#A8EDEA", "#00C6FF"]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.gradientContainer}
//     >
//       <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
//       <View style={styles.glassCard}>{renderTestStep()}</View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   glassCard: {
//     flex: 1,
//     width: "92%",
//     backgroundColor: "rgba(255, 255, 255, 0.3)",
//     borderRadius: 30,
//     paddingVertical: 25,
//     paddingHorizontal: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 12,
//     elevation: 8,
//   },
// });

// export default TestingFlow;


// import React, { useState } from "react";
// import { View, StyleSheet, StatusBar } from "react-native";
// import InstructionScreen from "./InstructionScreen";
// import ImageCapture from "./ImageCapture";
// import ProcessingScreen from "./ProcessingScreen";
// import ReportScreen from "./ReportScreen";

// const TestingFlow = () => {
//   const [testStep, setTestStep] = useState("instructions");
//   const [chartImage, setChartImage] = useState(null);
//   const [stripImage, setStripImage] = useState(null);
//   const [reportData, setReportData] = useState(null);

//   const handleRestart = () => {
//     setChartImage(null);
//     setStripImage(null);
//     setReportData(null);
//     setTestStep("instructions");
//   };

//   const renderTestStep = () => {
//     switch (testStep) {
//       case "instructions":
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//       case "captureChart":
//         return (
//           <ImageCapture
//             type="Chart"
//             onNext={(imageAsset) => {
//               setChartImage(imageAsset);
//               setTestStep("captureLitmus");
//             }}
//             onBack={() => setTestStep("instructions")}
//           />
//         );
//       case "captureLitmus":
//         return (
//           <ImageCapture
//             type="Litmus Paper"
//             onNext={(imageAsset) => {
//               setStripImage(imageAsset);
//               setTestStep("processing");
//             }}
//             onBack={() => setTestStep("captureChart")}
//           />
//         );
//       case "processing":
//         return (
//           <ProcessingScreen
//             chartImage={chartImage}
//             stripImage={stripImage}
//             onComplete={(data) => {
//               setReportData(data);
//               setTestStep("report");
//             }}
//             onBack={() => setTestStep("captureLitmus")}
//           />
//         );
//       case "report":
//         return <ReportScreen reportData={reportData} onRestart={handleRestart} />;
//       default:
//         return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

//       {/* Soft gradient simulation */}
//       <View style={styles.gradientBackground} />
//       <View style={styles.gradientOverlay} />

//       {/* Glass container */}
//       <View style={styles.glassCard}>{renderTestStep()}</View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#A8EDEA", // fallback light teal
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   gradientBackground: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "#A8EDEA",
//   },
//   gradientOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "#00C6FF",
//     opacity: 0.4, // creates blended two-tone look
//   },
//   glassCard: {
//     flex: 1,
//     width: "92%",
//     backgroundColor: "rgba(255, 255, 255, 0.35)",
//     borderRadius: 30,
//     paddingVertical: 25,
//     paddingHorizontal: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.12,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 12,
//     elevation: 8,
//   },
// });

// export default TestingFlow;


import React, { useState } from "react";
import { View, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import InstructionScreen from "./InstructionScreen";
import ImageCapture from "./ImageCapture";
import ProcessingScreen from "./ProcessingScreen";
import ReportScreen from "./ReportScreen";

const TestingFlow = () => {
  const [testStep, setTestStep] = useState("instructions");
  const [chartImage, setChartImage] = useState(null);
  const [stripImage, setStripImage] = useState(null);
  const [reportData, setReportData] = useState(null);

  const handleRestart = () => {
    setChartImage(null);
    setStripImage(null);
    setReportData(null);
    setTestStep("instructions");
  };

  const renderTestStep = () => {
    switch (testStep) {
      case "instructions":
        return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
      case "captureChart":
        return (
          <ImageCapture
            type="Chart"
            onNext={(imageAsset) => {
              setChartImage(imageAsset);
              setTestStep("captureLitmus");
            }}
            onBack={() => setTestStep("instructions")}
          />
        );
      case "captureLitmus":
        return (
          <ImageCapture
            type="Litmus Paper"
            onNext={(imageAsset) => {
              setStripImage(imageAsset);
              setTestStep("processing");
            }}
            onBack={() => setTestStep("captureChart")}
          />
        );
      case "processing":
        return (
          <ProcessingScreen
            chartImage={chartImage}
            stripImage={stripImage}
            onComplete={(data) => {
              setReportData(data);
              setTestStep("report");
            }}
            onBack={() => setTestStep("captureLitmus")}
          />
        );
      case "report":
        return <ReportScreen reportData={reportData} onRestart={handleRestart} />;
      default:
        return <InstructionScreen onNext={() => setTestStep("captureChart")} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Background layers */}
      <View style={styles.backgroundBase} />
      <View style={styles.backgroundOverlay} />

      {/* Glass content area */}
      <View style={styles.glassContainer}>{renderTestStep()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFF8FF", // soft fallback color
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#A8EDEA", // pale teal
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00C6FF", // light aqua overlay
    opacity: 0.25, // soft blending
  },
  glassContainer: {
    flex: 1,
    width: "92%",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
    shadowColor: "#00C6FF",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 15,
    elevation: 10,
  },
});

export default TestingFlow;
