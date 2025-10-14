// import React, { useState } from 'react';
// import { View } from 'react-native';
// import InstructionScreen from './InstructionScreen';
// import ImageCapture from './ImageCapture';
// import ProcessingScreen from './ProcessingScreen';
// import ReportScreen from './ReportScreen';

// const TestingFlow = () => {
//   const [testStep, setTestStep] = useState('instructions');

//   const renderTestStep = () => {
//     switch (testStep) {
//       case 'instructions':
//         return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
//       case 'captureChart':
//         return (
//           <ImageCapture
//             type="Chart"
//             onNext={() => setTestStep('captureLitmus')}
//             onBack={() => setTestStep('instructions')}
//           />
//         );
//       case 'captureLitmus':
//         return (
//           <ImageCapture
//             type="Litmus Paper"
//             onNext={() => setTestStep('processing')}
//             onBack={() => setTestStep('captureChart')}
//           />
//         );
//       case 'processing':
//         return <ProcessingScreen onComplete={() => setTestStep('report')} />;
//       case 'report':
//         return <ReportScreen onRestart={() => setTestStep('instructions')} />;
//       default:
//         return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
//     }
//   };

//   return <View>{renderTestStep()}</View>;
// };

// export default TestingFlow;

import React, { useState } from 'react';
import { View } from 'react-native';
import InstructionScreen from './InstructionScreen';
import ImageCapture from './ImageCapture';
import ProcessingScreen from './ProcessingScreen';
import ReportScreen from './ReportScreen';

const TestingFlow = () => {
  const [testStep, setTestStep] = useState('instructions');
  const [chartImage, setChartImage] = useState(null);
  const [stripImage, setStripImage] = useState(null);
  const [reportData, setReportData] = useState(null);

  const renderTestStep = () => {
    switch (testStep) {
      case 'instructions':
        return <InstructionScreen onNext={() => setTestStep('captureChart')} />;

      case 'captureChart':
        return (
          <ImageCapture
            type="Chart"
            onNext={(image) => {
              setChartImage(image);
              setTestStep('captureLitmus');
            }}
            onBack={() => setTestStep('instructions')}
          />
        );

      case 'captureLitmus':
        return (
          <ImageCapture
            type="Litmus Paper"
            onNext={(image) => {
              setStripImage(image);
              setTestStep('processing');
            }}
            onBack={() => setTestStep('captureChart')}
          />
        );

      case 'processing':
        return (
          <ProcessingScreen
            chartImage={chartImage}
            stripImage={stripImage}
            onComplete={(results) => {
              setReportData(results);
              setTestStep('report');
            }}
          />
        );

      case 'report':
        return <ReportScreen data={reportData} onRestart={() => setTestStep('instructions')} />;

      default:
        return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
    }
  };

  return <View>{renderTestStep()}</View>;
};

export default TestingFlow;
