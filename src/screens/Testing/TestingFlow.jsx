// FILE: varify-app/src/screens/Testing/TestingFlow.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles, colors } from '../../styles/globalStyles';
import { ResultItem } from '../../components/common/ResultItem';
import PermissionsRequest from './PermissionRequest';
import ImageCapture from './ImageCapture';
// --- Sub-components for the testing flow ---

const StepHeader = ({ title, onBack }) => (
    <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8, marginRight: 8 }}>
            <Text style={{ fontSize: 24 }}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{title}</Text>
    </View>
);

const InstructionScreen = ({ onNext }) => (
    <View>
        <Text style={[styles.pageTitle, { textAlign: 'center' }]}>Water Test Instructions</Text>
        <View style={styles.instructionCard}>
            <Text style={styles.instructionStep}>Step 1</Text>
            <Text>Prepare your water sample and test strip.</Text>
        </View>
        <View style={styles.instructionCard}>
            <Text style={styles.instructionStep}>Step 2</Text>
            <Text>Take a picture of the color chart from your kit.</Text>
        </View>
        <View style={styles.instructionCard}>
            <Text style={styles.instructionStep}>Step 3</Text>
            <Text>Take a picture of your litmus strip.</Text>
        </View>
        <Text style={[styles.textSmall, { textAlign: 'center', marginVertical: 16 }]}>Our app will analyze the colors and generate a report.</Text>
        <TouchableOpacity onPress={onNext} style={styles.button}>
            <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>
    </View>
);

    // const PermissionsRequest = ({ onNext, onBack }) => {
    //     const [cameraGranted, setCameraGranted] = useState(false);
    //     const [locationGranted, setLocationGranted] = useState(false);
        
    //     return (
    //         <View>
    //             <StepHeader title="Permissions" onBack={onBack} />
    //             <View style={[styles.permissionCard, cameraGranted && { backgroundColor: colors.successLight }]}>
    //                 <View>
    //                     <Text style={styles.sectionTitle}>📷 Camera Access</Text>
    //                     <Text style={styles.textSmall}>Needed to scan the test strip and chart.</Text>
    //                 </View>
    //                 {!cameraGranted && <TouchableOpacity onPress={() => setCameraGranted(true)} style={styles.allowButton}><Text style={styles.allowButtonText}>Allow</Text></TouchableOpacity>}
    //                 {cameraGranted && <Text style={{ color: colors.success, fontWeight: 'bold' }}>Granted</Text>}
    //             </View>
    //             <View style={[styles.permissionCard, locationGranted && { backgroundColor: colors.successLight }]}>
    //                 <View>
    //                     <Text style={styles.sectionTitle}>📍 Location Access</Text>
    //                     <Text style={styles.textSmall}>To tag your test results with your location.</Text>
    //                 </View>
    //                 {!locationGranted && <TouchableOpacity onPress={() => setLocationGranted(true)} style={styles.allowButton}><Text style={styles.allowButtonText}>Allow</Text></TouchableOpacity>}
    //                 {locationGranted && <Text style={{ color: colors.success, fontWeight: 'bold' }}>Granted</Text>}
    //             </View>
    //             {(cameraGranted && locationGranted) &&
    //                 <TouchableOpacity onPress={onNext} style={[styles.button, { marginTop: 32 }]}>
    //                     <Text style={styles.buttonText}>Continue</Text>
    //                 </TouchableOpacity>
    //             }
    //         </View>
    //     );
    // };

    // const ImageCapture = ({ type, onNext, onBack }) => {
    //     const [image, setImage] = useState(null);
    //     return (
    //         <View>
    //             <StepHeader title={`Capture ${type}`} onBack={onBack} />
    //             <View style={styles.cameraPlaceholder}>
    //                 {image ? (
    //                     <View style={{ alignItems: 'center' }}>
    //                         <Text style={{ fontSize: 64 }}>✅</Text>
    //                         <Text>{type} Image Captured</Text>
    //                     </View>
    //                 ) : (
    //                     <Text style={{ fontSize: 48, color: '#9CA3AF' }}>📷</Text>
    //                 )}
    //             </View>
    //             {!image ? (
    //                 <TouchableOpacity onPress={() => setImage(true)} style={styles.button}>
    //                     <Text style={styles.buttonText}>Take Picture</Text>
    //                 </TouchableOpacity>
    //             ) : (
    //                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
    //                     <TouchableOpacity onPress={() => setImage(null)} style={[styles.button, styles.halfButton, { backgroundColor: '#E5E7EB' }]}>
    //                         <Text style={[styles.buttonText, { color: '#1F2937' }]}>Retake</Text>
    //                     </TouchableOpacity>
    //                     <TouchableOpacity onPress={onNext} style={[styles.button, styles.halfButton, { backgroundColor: colors.accent }]}>
    //                         <Text style={styles.buttonText}>Confirm</Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             )}
    //         </View>
    //     );
    // };

const ProcessingScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.pageTitle, { marginTop: 16 }]}>Analyzing...</Text>
            <Text style={styles.textSmall}>Our AI is comparing the colors.</Text>
        </View>
    );
};

const ReportScreen = ({ onRestart }) => (
    <View>
        <Text style={[styles.pageTitle, { textAlign: 'center' }]}>Test Report</Text>
        <Text style={[styles.textSmall, { textAlign: 'center', marginBottom: 16 }]}>Generated on Sept 1, 2025 - Delhi, India</Text>

        <ResultItem parameter="pH" value="6.5" status="Slightly Acidic" statusColor={colors.warning} />
        <ResultItem parameter="Hardness" value="150 ppm" status="Hard" statusColor={colors.danger} />
        <ResultItem parameter="Lead" value="0 ppb" status="Safe" statusColor={colors.success} />
        <ResultItem parameter="Iron" value="0.1 ppm" status="Safe" statusColor={colors.success} />
        <ResultItem parameter="Total Chlorine" value="0.5 ppm" status="Safe" statusColor={colors.success} />

        <View style={styles.assessmentCard}>
            <Text style={[styles.cardTitle, { color: colors.primaryDark }]}>Overall Assessment</Text>
            <Text style={{ color: colors.info }}>Your water is generally safe but shows signs of hardness and is slightly acidic.</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
            <TouchableOpacity style={[styles.button, styles.halfButton, { backgroundColor: '#E5E7EB' }]}>
                <Text style={[styles.buttonText, { color: '#1F2937' }]}>💾 Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.halfButton, { backgroundColor: '#E5E7EB' }]}>
                <Text style={[styles.buttonText, { color: '#1F2937' }]}>🔗 Share</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onRestart} style={styles.button}>
            <Text style={styles.buttonText}>Start New Test</Text>
        </TouchableOpacity>
    </View>
);


// --- Main Testing Flow Navigator ---

const TestingFlow = () => {
    const [testStep, setTestStep] = useState('instructions');

    const renderTestStep = () => {
        switch (testStep) {
            case 'instructions': return <InstructionScreen onNext={() => setTestStep('permissions')} />;
            case 'permissions': return <PermissionsRequest onNext={() => setTestStep('captureChart')} onBack={() => setTestStep('instructions')} />;
            case 'captureChart': return <ImageCapture type="Chart" onNext={() => setTestStep('captureLitmus')} onBack={() => setTestStep('permissions')} />;
            case 'captureLitmus': return <ImageCapture type="Litmus Paper" onNext={() => setTestStep('processing')} onBack={() => setTestStep('captureChart')} />;
            case 'processing': return <ProcessingScreen onComplete={() => setTestStep('report')} />;
            case 'report': return <ReportScreen onRestart={() => setTestStep('instructions')} />;
            default: return <InstructionScreen onNext={() => setTestStep('permissions')} />;
        }
    }
    return <View>{renderTestStep()}</View>;
};

export default TestingFlow;

