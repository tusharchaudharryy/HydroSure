import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

// --- Type Definitions ---

type ContaminantStatus = "Good" | "Ideal" | "Moderate" | "Acceptable" | "Poor" | "High";

interface Contaminant {
  value: number;
  unit: string;
  status: ContaminantStatus;
}

interface Contaminants {
  [key: string]: Contaminant;
}

interface Location {
  latitude: string;
  longitude: string;
}

interface TestResult {
  id: number;
  date: string;
  location: Location;
  contaminants: Contaminants;
}

type ScreenName = "onboarding" | "calibration" | "testing" | "results" | "history";


// --- Mock Data ---

const MOCK_CONTAMINANTS: Contaminants = {
  "Total Hardness": { value: 150, unit: "ppm", status: "Moderate" },
  "Total Chlorine": { value: 0.8, unit: "ppm", status: "Good" },
  "Free Chlorine": { value: 0.5, unit: "ppm", status: "Good" },
  "pH": { value: 7.2, unit: "pH", status: "Ideal" },
  "Total Alkalinity": { value: 100, unit: "ppm", status: "Good" },
  "Cyanuric Acid": { value: 40, unit: "ppm", status: "Good" },
  "Nitrate": { value: 15, unit: "ppm", status: "Acceptable" },
};

// --- Main App Component ---

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("onboarding");
  const [currentTestResult, setCurrentTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);

  const navigateTo = (name: ScreenName) => setScreen(name);

  const handleStartNewTest = () => {
    setCurrentTestResult(null);
    navigateTo("calibration");
  };

  const handleAnalysisComplete = (location: Location) => {
    const newResult: TestResult = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      location: location,
      contaminants: JSON.parse(JSON.stringify(MOCK_CONTAMINANTS)),
    };
    // Simulate some variation in results
    newResult.contaminants.pH.value = parseFloat((7.0 + Math.random() * 0.8).toFixed(1));
    setCurrentTestResult(newResult);
    navigateTo("results");
  };

  const saveTestToHistory = () => {
    if (currentTestResult) {
      setTestHistory((prev) => [currentTestResult, ...prev]);
    }
    navigateTo("history");
  };

  const renderScreen = () => {
    switch (screen) {
      case "onboarding":
        return (
          <OnboardingScreen
            onStart={handleStartNewTest}
            onViewHistory={() => navigateTo("history")}
          />
        );
      case "calibration":
        return <CalibrationScreen onComplete={() => navigateTo("testing")} />;
      case "testing":
        return <TestingScreen onComplete={handleAnalysisComplete} />;
      case "results":
        return (
          <ResultsScreen
            result={currentTestResult}
            onSave={saveTestToHistory}
            onTestAgain={handleStartNewTest}
          />
        );
      case "history":
        return (
          <HistoryScreen history={testHistory} onBack={() => navigateTo("onboarding")} />
        );
      default:
        return null;
    }
  };

  return <SafeAreaView style={styles.container}>{renderScreen()}</SafeAreaView>;
}

// --- Screen Components & Props ---

/* ---------------- Onboarding ---------------- */
interface OnboardingScreenProps {
  onStart: () => void;
  onViewHistory: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onStart, onViewHistory }) => (
  <View style={styles.centered}>
    <Text style={styles.iconPlaceholder}>💧</Text>
    <Text style={styles.title}>Aqua-Scan</Text>
    <Text style={styles.subtitle}>Your Water Quality Companion</Text>
    <Text style={styles.text}>
      Get instant analysis of your water quality. Start by calibrating with your color
      chart, then test your water strip.
    </Text>
    <TouchableOpacity style={styles.primaryButton} onPress={onStart}>
      <Text style={styles.iconPlaceholder}>📊</Text>
      <Text style={styles.primaryText}>Start New Test</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.secondaryButton} onPress={onViewHistory}>
      <Text style={styles.iconPlaceholder}>📋</Text>
      <Text style={styles.secondaryText}>View Test History</Text>
    </TouchableOpacity>
  </View>
);

/* ---------------- Calibration ---------------- */
interface CalibrationScreenProps {
  onComplete: () => void;
}

const CalibrationScreen: React.FC<CalibrationScreenProps> = ({ onComplete }) => (
  <View style={styles.centered}>
    <Text style={styles.title}>Step 1: Calibration</Text>
    <Text style={styles.text}>
      Place your standardized color chart on a flat, well-lit surface. Make sure there are
      no shadows.
    </Text>
    <View style={styles.cameraBox}>
      <Text style={styles.iconPlaceholderLarge}>📷</Text>
      <Text style={styles.text}>Camera View Here</Text>
    </View>
    <TouchableOpacity style={styles.primaryButton} onPress={onComplete}>
      <Text style={styles.iconPlaceholder}>✅</Text>
      <Text style={styles.primaryText}>Capture Calibration Chart</Text>
    </TouchableOpacity>
  </View>
);

/* ---------------- Testing ---------------- */
interface TestingScreenProps {
  onComplete: (location: Location) => void;
}

const TestingScreen: React.FC<TestingScreenProps> = ({ onComplete }) => {
  const [timer, setTimer] = useState(120);
  const [active, setActive] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (active && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setActive(false);
      setShowCapture(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, timer]);

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

  const handleCapture = () => {
    setLoading(true);
    setTimeout(() => {
      const mockLocation: Location = {
        latitude: (28.6139 + (Math.random() - 0.5) * 0.1).toFixed(6),
        longitude: (77.209 + (Math.random() - 0.5) * 0.1).toFixed(6),
      };
      onComplete(mockLocation);
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Step 2: Test Your Water</Text>
      <Text style={styles.text}>
        1. Dip the test strip in your water sample for 2 minutes.{"\n"}2. Press the button
        below to start the timer.
      </Text>

      {!active && timer === 120 && (
        <TouchableOpacity style={styles.primaryButton} onPress={() => setActive(true)}>
          <Text style={styles.iconPlaceholder}>⏱️</Text>
          <Text style={styles.primaryText}>Start 2-Minute Timer</Text>
        </TouchableOpacity>
      )}

      {active && (
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
      )}

      {showCapture && (
        <>
          <Text style={styles.text}>Timer finished! Capture your strip.</Text>
          <View style={styles.cameraBox}>
            <Text style={styles.iconPlaceholderLarge}>📷</Text>
            <Text style={styles.text}>Camera View Here</Text>
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCapture}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.iconPlaceholder}>✅</Text>
                <Text style={styles.primaryText}>Capture Test Strip</Text>
              </>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

/* ---------------- Results ---------------- */
interface ResultsScreenProps {
  result: TestResult | null;
  onSave: () => void;
  onTestAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onSave, onTestAgain }) => {
  if (!result) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.text}>Loading results...</Text>
      </View>
    );
  }

  const getStatusColor = (status: ContaminantStatus) => {
    const s = status?.toLowerCase();
    if (s === "good" || s === "ideal") return "#22c55e";
    if (s === "moderate" || s === "acceptable") return "#f97316";
    if (s === "poor" || s === "high") return "#ef4444";
    return "#6b7280";
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={[styles.title, { textAlign: "center" }]}>Test Results</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.iconPlaceholderSmall}>📍</Text>
          <Text style={styles.cardTitle}>Test Location & Time</Text>
        </View>
        <Text style={styles.text}>
          Lat: {result.location.latitude}, Lon: {result.location.longitude}
        </Text>
        <Text style={styles.text}>Date: {result.date}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.iconPlaceholderSmall}>💧</Text>
          <Text style={styles.cardTitle}>Contaminant Levels</Text>
        </View>
        {Object.entries(result.contaminants).map(([key, data]) => (
          <View key={key} style={styles.resultRow}>
            <Text style={styles.text}>{key}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.bold}>
                {data.value} {data.unit}
              </Text>
              <View
                style={{
                  marginLeft: 6,
                  backgroundColor: getStatusColor(data.status),
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>{data.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
        <Text style={styles.primaryText}>Save & View History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onTestAgain}>
        <Text style={styles.secondaryText}>Start a New Test</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

/* ---------------- History ---------------- */
interface HistoryScreenProps {
  history: TestResult[];
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onBack }) => (
  <View style={{ flex: 1, padding: 16 }}>
    <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 24, color: "#0ea5e9" }}>←</Text>
    </TouchableOpacity>
    <Text style={styles.title}>Test History</Text>
    {history.length === 0 ? (
      <View style={styles.centered}>
        <Text style={styles.text}>No tests saved yet.</Text>
      </View>
    ) : (
      <ScrollView>
        {history.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.iconPlaceholderSmall}>📍</Text>
              <Text style={styles.cardTitle}>Test from {item.date}</Text>
            </View>
            <Text style={styles.text}>
              Location: {item.location.latitude}, {item.location.longitude}
            </Text>
          </View>
        ))}
      </ScrollView>
    )}
  </View>
);

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#0f172a", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748b", marginBottom: 12 },
  text: { fontSize: 14, color: "#475569", textAlign: "center", marginVertical: 6 },
  bold: { fontWeight: "600", color: "#0f172a" },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    marginTop: 16,
    width: "100%",
  },
  primaryText: { color: "#fff", fontWeight: "600", marginLeft: 8, fontSize: 16 },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    marginTop: 8,
    width: "100%",
  },
  secondaryText: { color: "#0ea5e9", fontWeight: "600", marginLeft: 8, fontSize: 16 },

  cameraBox: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: "#e2e8f0",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },

  timerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  timerText: { fontSize: 40, fontWeight: "bold", color: "#0284c7" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { marginLeft: 6, fontWeight: "600", color: "#334155" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  iconPlaceholder: {
    fontSize: 20,
    marginRight: 4,
  },
  iconPlaceholderLarge: {
    fontSize: 48,
    color: "#64748b",
    marginBottom: 8,
  },
  iconPlaceholderSmall: {
    fontSize: 16,
  },
});
