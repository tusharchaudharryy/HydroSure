import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

// --- Main App Component ---
export default function App() {
    const [page, setPage] = useState('splash');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(isAuthenticated ? 'main' : 'login');
        }, 2000);
        return () => clearTimeout(timer);
    }, [isAuthenticated]);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setPage('main');
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
        setPage('login');
    }

    const renderPage = () => {
        if (page === 'splash') {
            return <SplashScreen />;
        }
        if (!isAuthenticated) {
             switch (page) {
                case 'login':
                    return <AuthPage setPage={setPage} onLogin={handleLogin} />;
                case 'signup':
                    return <AuthPage setPage={setPage} onLogin={handleLogin} isSignup />;
                default:
                    return <AuthPage setPage={setPage} onLogin={handleLogin} />;
            }
        }
        return <MainApp onLogout={handleLogout}/>;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {renderPage()}
        </SafeAreaView>
    );
}

// --- Screens & Components ---

const SplashScreen = () => (
    <View style={[styles.container, { backgroundColor: '#2563EB' }]}>
        <Text style={{fontSize: 128}}>🛡️</Text>
        <Text style={[styles.splashTitle, {color: '#FFFFFF'}]}>HydroSure</Text>
        <Text style={[styles.splashSubtitle, {color: '#FFFFFF'}]}>Your Water Quality Partner</Text>
    </View>
);

const AuthPage = ({ setPage, onLogin, isSignup = false }) => {
    return (
        <View style={[styles.container, { backgroundColor: '#F3F4F6' }]}>
            <View style={styles.authCard}>
                <Text style={{fontSize: 64, color: '#2563EB', textAlign: 'center'}}>🛡️</Text>
                <Text style={styles.authTitle}>{isSignup ? 'Create Account' : 'Welcome Back!'}</Text>
                <Text style={styles.authSubtitle}>{isSignup ? 'Join us to monitor your water quality.' : 'Sign in to continue.'}</Text>
                
                <View style={styles.form}>
                    {isSignup && (
                         <TextInput placeholder="Full Name" style={styles.input} />
                    )}
                    <TextInput placeholder="Email Address" style={styles.input} keyboardType="email-address" />
                    <TextInput placeholder="Password" style={styles.input} secureTextEntry />
                    
                    <TouchableOpacity onPress={onLogin} style={styles.button}>
                        <Text style={styles.buttonText}>{isSignup ? 'Sign Up' : 'Login'}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setPage(isSignup ? 'login' : 'signup')} style={{marginTop: 24}}>
                    <Text style={styles.authLink}>
                        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const MainApp = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('testing');

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <HomePage />;
            case 'shop': return <ShopPage />;
            case 'testing': return <TestingPage />;
            case 'faq': return <FAQPage />;
            default: return <HomePage />;
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <View style={styles.header}>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 28, color: '#2563EB', marginRight: 8}}>🛡️</Text>
                    <Text style={styles.headerTitle}>HydroSure</Text>
                </View>
                <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                    <Text style={{fontSize: 20}}>🚪</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.mainContent}>
                {renderContent()}
            </ScrollView>
            <View style={styles.navBar}>
                <NavItem icon="🏠" label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                <NavItem icon="🛒" label="Shop" isActive={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
                <NavItem icon="🧪" label="Testing" isActive={activeTab === 'testing'} onClick={() => setActiveTab('testing')} isCentral />
                <NavItem icon="❓" label="FAQ" isActive={activeTab === 'faq'} onClick={() => setActiveTab('faq')} />
            </View>
        </View>
    );
};

const NavItem = ({ icon, label, isActive, onClick, isCentral = false }) => {
    const activeColor = '#2563EB';
    const inactiveColor = '#6B7280';
    
    if (isCentral) {
        return (
             <TouchableOpacity onPress={onClick} style={styles.navCentralButton}>
                <View style={[styles.navCentralIconWrapper, {backgroundColor: isActive ? activeColor : '#3B82F6'}]}>
                    <Text style={{fontSize: 32}}>{icon}</Text>
                </View>
                <Text style={[styles.navLabel, {color: isActive ? activeColor : inactiveColor}]}>{label}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <TouchableOpacity onPress={onClick} style={styles.navButton}>
            <Text style={{fontSize: 24}}>{icon}</Text>
            <Text style={[styles.navLabel, {color: isActive ? activeColor : inactiveColor}]}>{label}</Text>
        </TouchableOpacity>
    );
}

const HomePage = () => (
    <View>
        <Text style={styles.pageTitle}>Dashboard</Text>
        <View style={styles.grid}>
            <View style={[styles.card, {backgroundColor: '#DBEAFE'}]}>
                <Text style={[styles.cardTitle, {color: '#1E40AF'}]}>Last Test Result</Text>
                <Text>pH: 6.8 (Normal)</Text>
                <Text style={styles.textSmall}>Sept 1, 2025</Text>
            </View>
            <View style={[styles.card, {backgroundColor: '#D1FAE5'}]}>
                <Text style={[styles.cardTitle, {color: '#065F46'}]}>Water Quality Status</Text>
                <Text>Good</Text>
            </View>
        </View>
        <View style={{marginTop: 24}}>
            <Text style={styles.sectionTitle}>Test History</Text>
            <View style={styles.historyItem}>
                <View>
                    <Text>Test from Aug 28, 2025</Text>
                    <Text style={styles.textSmall}>Delhi, India</Text>
                </View>
                <Text style={{fontWeight: 'bold', color: '#059669'}}>Passed</Text>
            </View>
            <View style={styles.historyItem}>
                <View>
                    <Text>Test from Aug 15, 2025</Text>
                    <Text style={styles.textSmall}>Delhi, India</Text>
                </View>
                <Text style={{fontWeight: 'bold', color: '#D97706'}}>Warning</Text>
            </View>
        </View>
    </View>
);

const ShopPage = () => (
    <View>
        <Text style={styles.pageTitle}>Shop HydroSure Products</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {['16-in-1 Test Kit', 'Bacteria Test Kit', 'Refill Strips', 'Water Filter'].map(item => (
                 <View key={item} style={styles.shopItem}>
                    <View style={styles.shopImage}>
                       <Text style={{fontSize: 40, color: '#9CA3AF'}}>🧪</Text>
                    </View>
                    <Text style={styles.shopTitle}>{item}</Text>
                    <Text style={styles.shopPrice}>$19.99</Text>
                    <TouchableOpacity style={styles.addToCartButton}>
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    </View>
);

const FAQPage = () => (
    <View>
        <Text style={styles.pageTitle}>Frequently Asked Questions</Text>
        <View style={{marginVertical: 8}}>
            <Text style={styles.sectionTitle}>How accurate are the tests?</Text>
            <Text style={styles.textSmall}>Our tests are calibrated to provide highly accurate readings for home use. For certified results, please consult a professional lab.</Text>
        </View>
        <View style={{marginVertical: 8}}>
            <Text style={styles.sectionTitle}>How often should I test my water?</Text>
            <Text style={styles.textSmall}>We recommend testing your water every 3-6 months, or if you notice any change in taste, smell, or appearance.</Text>
        </View>
    </View>
);

const TestingPage = () => {
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

const StepHeader = ({ title, onBack }) => (
    <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onBack} style={{padding: 8}}>
            <Text style={{fontSize: 24}}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{title}</Text>
    </View>
);

const InstructionScreen = ({ onNext }) => (
    <View>
        <Text style={[styles.pageTitle, {textAlign: 'center'}]}>Water Test Instructions</Text>
        <View style={styles.instructionCard}>
            <Text style={styles.instructionStep}>Step 1</Text>
            <Text>Prepare your water sample and test strip as per the kit instructions.</Text>
        </View>
        <View style={styles.instructionCard}>
            <Text style={styles.instructionStep}>Step 2</Text>
            <Text>You will be asked to take a picture of the color chart from your kit.</Text>
        </View>
        <View style={styles.instructionCard}>
            <Text style={styles.instructionStep}>Step 3</Text>
            <Text>Then, take a picture of your dipped litmus strip against a white background.</Text>
        </View>
        <Text style={[styles.textSmall, {textAlign: 'center', marginVertical: 16}]}>Our app will analyze the colors and generate a detailed report.</Text>
        <TouchableOpacity onPress={onNext} style={styles.button}>
            <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>
    </View>
);

const PermissionsRequest = ({ onNext, onBack }) => {
    const [cameraGranted, setCameraGranted] = useState(false);
    const [locationGranted, setLocationGranted] = useState(false);

    return (
        <View>
            <StepHeader title="Permissions" onBack={onBack}/>
            <View style={[styles.permissionCard, cameraGranted && {backgroundColor: '#D1FAE5'}]}>
                <View>
                    <Text style={styles.sectionTitle}>📷 Camera Access</Text>
                    <Text style={styles.textSmall}>Needed to scan the test strip and chart.</Text>
                </View>
                {!cameraGranted && <TouchableOpacity onPress={() => setCameraGranted(true)} style={styles.allowButton}><Text style={styles.allowButtonText}>Allow</Text></TouchableOpacity>}
                {cameraGranted && <Text style={{color: '#065F46', fontWeight: 'bold'}}>Granted</Text>}
            </View>
            <View style={[styles.permissionCard, locationGranted && {backgroundColor: '#D1FAE5'}]}>
                <View>
                    <Text style={styles.sectionTitle}>📍 Location Access</Text>
                    <Text style={styles.textSmall}>To tag your test results with your location.</Text>
                </View>
                {!locationGranted && <TouchableOpacity onPress={() => setLocationGranted(true)} style={styles.allowButton}><Text style={styles.allowButtonText}>Allow</Text></TouchableOpacity>}
                {locationGranted && <Text style={{color: '#065F46', fontWeight: 'bold'}}>Granted</Text>}
            </View>
            {(cameraGranted && locationGranted) &&
                <TouchableOpacity onPress={onNext} style={[styles.button, {marginTop: 32}]}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            }
        </View>
    );
};

const ImageCapture = ({ type, onNext, onBack }) => {
    const [image, setImage] = useState(null);
    // NOTE: Camera functionality requires a native library like react-native-camera or expo-camera.
    // This is a placeholder UI.
    return (
        <View>
            <StepHeader title={`Capture ${type}`} onBack={onBack}/>
            <View style={styles.cameraPlaceholder}>
                {image ? (
                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: 64}}>✅</Text>
                      <Text>{type} Image Captured</Text>
                    </View>
                ) : (
                    <Text style={{fontSize: 48, color: '#9CA3AF'}}>📷</Text>
                )}
            </View>
            {!image ? (
                 <TouchableOpacity onPress={() => setImage(true)} style={styles.button}>
                    <Text style={styles.buttonText}>Take Picture</Text>
                </TouchableOpacity>
            ) : (
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 16}}>
                    <TouchableOpacity onPress={() => setImage(null)} style={[styles.button, styles.halfButton, {backgroundColor: '#E5E7EB'}]}>
                       <Text style={[styles.buttonText, {color: '#1F2937'}]}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onNext} style={[styles.button, styles.halfButton, {backgroundColor: '#10B981'}]}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const ProcessingScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <View style={styles.container}>
             <ActivityIndicator size="large" color="#2563EB" />
            <Text style={[styles.pageTitle, {marginTop: 16}]}>Analyzing...</Text>
            <Text style={styles.textSmall}>Our AI is comparing the colors.</Text>
        </View>
    );
};

const ReportScreen = ({ onRestart }) => (
    <View>
        <Text style={[styles.pageTitle, {textAlign: 'center'}]}>Test Report</Text>
        <Text style={[styles.textSmall, {textAlign: 'center', marginBottom: 16}]}>Generated on Sept 1, 2025 - Delhi, India</Text>

        <ResultItem parameter="pH" value="6.5" status="Slightly Acidic" statusColor="#D97706" />
        <ResultItem parameter="Hardness" value="150 ppm" status="Hard" statusColor="#EA580C" />
        <ResultItem parameter="Lead" value="0 ppb" status="Safe" statusColor="#059669" />
        <ResultItem parameter="Iron" value="0.1 ppm" status="Safe" statusColor="#059669" />
        <ResultItem parameter="Total Chlorine" value="0.5 ppm" status="Safe" statusColor="#059669" />
        
        <View style={styles.assessmentCard}>
            <Text style={[styles.cardTitle, {color: '#1E40AF'}]}>Overall Assessment</Text>
            <Text style={{color: '#1D4ED8'}}>Your water is generally safe but shows signs of hardness and is slightly acidic.</Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16}}>
             <TouchableOpacity style={[styles.button, styles.halfButton, {backgroundColor: '#E5E7EB'}]}>
                <Text style={[styles.buttonText, {color: '#1F2937'}]}>💾 Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.halfButton, {backgroundColor: '#E5E7EB'}]}>
                <Text style={[styles.buttonText, {color: '#1F2937'}]}>🔗 Share</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onRestart} style={styles.button}>
            <Text style={styles.buttonText}>Start New Test</Text>
        </TouchableOpacity>
    </View>
);

const ResultItem = ({ parameter, value, status, statusColor }) => (
    <View style={styles.historyItem}>
        <View>
            <Text style={{fontWeight: 'bold'}}>{parameter}</Text>
            <Text style={styles.textSmall}>{value}</Text>
        </View>
        <Text style={{fontWeight: 'bold', color: statusColor}}>{status}</Text>
    </View>
);


// --- Styles ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    splashTitle: { fontSize: 48, fontWeight: 'bold', marginTop: 16 },
    splashSubtitle: { fontSize: 18, marginTop: 8 },
    authCard: { width: '100%', backgroundColor: 'white', padding: 32, borderRadius: 16, elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4 },
    authTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    authSubtitle: { color: '#6B7280', textAlign: 'center', marginBottom: 24 },
    form: { width: '100%' },
    input: { width: '100%', paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, marginBottom: 12 },
    button: { width: '100%', backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    authLink: { color: '#2563EB', textAlign: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    logoutButton: { padding: 8 },
    mainContent: { padding: 16, paddingBottom: 80 },
    navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
    navButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 8 },
    navLabel: { fontSize: 12 },
    navCentralButton: { alignItems: 'center', justifyContent: 'center', marginTop: -24 },
    navCentralIconWrapper: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4 },
    pageTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    card: { padding: 16, borderRadius: 8, marginBottom: 16 },
    cardTitle: { fontWeight: 'bold', marginBottom: 4 },
    textSmall: { fontSize: 14, color: '#6B7280' },
    sectionTitle: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
    historyItem: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    grid: { flexDirection: 'row', justifyContent: 'space-between' },
    shopItem: { width: '48%', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, marginBottom: 16, alignItems: 'center' },
    shopImage: { height: 100, width: '100%', backgroundColor: '#F3F4F6', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    shopTitle: { fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
    shopPrice: { fontSize: 12, color: '#6B7280' },
    addToCartButton: { backgroundColor: '#3B82F6', paddingVertical: 6, borderRadius: 4, width: '100%', marginTop: 8 },
    addToCartText: { color: 'white', fontSize: 12, textAlign: 'center' },
    stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    instructionCard: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
    instructionStep: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
    permissionCard: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    allowButton: { backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
    allowButtonText: { color: 'white', fontSize: 14 },
    cameraPlaceholder: { height: Dimensions.get('window').width - 32, width: '100%', borderWidth: 2, borderColor: '#D1D5DB', borderStyle: 'dashed', borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB', marginBottom: 16 },
    halfButton: { width: '48%' },
    assessmentCard: { backgroundColor: '#EFF6FF', padding: 16, borderRadius: 8, marginVertical: 16 },
});

