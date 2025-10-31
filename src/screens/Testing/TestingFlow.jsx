// Testing.zip/Testing/TestingFlow.jsx
import React, { useState } from 'react';
import { View } from 'react-native';
import InstructionScreen from './InstructionScreen';
import ImageCapture from './ImageCapture';
import ProcessingScreen from './ProcessingScreen';
import ReportScreen from './ReportScreen';

const TestingFlow = () => {
  const [testStep, setTestStep] = useState('instructions');
  
  // --- ADD STATE TO HOLD DATA ---
  const [chartImage, setChartImage] = useState(null);
  const [stripImage, setStripImage] = useState(null);
  const [reportData, setReportData] = useState(null);

  const handleRestart = () => {
    setChartImage(null);
    setStripImage(null);
    setReportData(null);
    setTestStep('instructions');
  };

  const renderTestStep = () => {
    switch (testStep) {
      case 'instructions':
        return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
      case 'captureChart':
        return (
          <ImageCapture
            type="Chart"
            // --- Pass data up on "onNext" ---
            onNext={(imageAsset) => {
              setChartImage(imageAsset);
              setTestStep('captureLitmus');
            }}
            onBack={() => setTestStep('instructions')}
          />
        );
      case 'captureLitmus':
        return (
          <ImageCapture
            type="Litmus Paper"
            // --- Pass data up and move to processing ---
            onNext={(imageAsset) => {
              setStripImage(imageAsset);
              setTestStep('processing');
            }}
            onBack={() => setTestStep('captureChart')}
          />
        );
      case 'processing':
        return (
          <ProcessingScreen
            // --- Pass images to the processing screen ---
            chartImage={chartImage}
            stripImage={stripImage}
            onComplete={(data) => {
              setReportData(data);
              setTestStep('report');
            }}
            onBack={() => setTestStep('captureLitmus')} // Add a way to go back
          />
        );
      case 'report':
        return (
          <ReportScreen 
            // --- Pass the final report data ---
            reportData={reportData} 
            onRestart={handleRestart} 
          />
        );
      default:
        return <InstructionScreen onNext={() => setTestStep('captureChart')} />;
    }
  };

  return <View>{renderTestStep()}</View>;
};

export default TestingFlow;