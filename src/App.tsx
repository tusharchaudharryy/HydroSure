import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// --- Style Object for React Native ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: { alignItems: "center", marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    marginTop: 0,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 16,
    marginTop: 0,
  },
  text: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    marginVertical: 8,
    lineHeight: 24,
  },
  bold: { fontWeight: "700", color: "#0f172a" },
  buttonContainer: { width: "100%", maxWidth: 400, marginTop: 20 },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 16,
    width: "100%",
    borderWidth: 0,
    color: "#fff",
    shadowColor: "#0ea5e9",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 14,
  },
  primaryText: { color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 8 },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#0ea5e9",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 12,
    width: "100%",
  },
  secondaryText: {
    color: "#0ea5e9",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  cameraBox: {
    width: "100%",
    maxWidth: 400,
    aspectRatio: 4 / 3,
    backgroundColor: "#f1f5f9",
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    padding: 10,
  },
  cameraText: { color: "#94a3b8", fontWeight: "500", marginTop: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#94a3b8",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: {
    fontWeight: "600",
    color: "#334155",
    fontSize: 16,
    margin: 0,
  },
  cardText: { color: "#475569", fontSize: 14, marginTop: 4, marginBottom: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  contaminantName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#334155",
    margin: 0,
  },
  contaminantLimit: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    marginBottom: 0,
  },
  statusBadge: {
    marginLeft: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: { color: "white", fontSize: 12, fontWeight: "600" },
  iconSmall: {
    fontSize: 16,
    marginRight: 8,
  },
  iconPlaceholderLarge: {
    fontSize: 48,
    color: "#94a3b8",
    marginBottom: 8,
    textAlign: "center",
  },
  scrollView: {
    width: "100%",
    maxWidth: 600,
    marginHorizontal: "auto",
    padding: 16,
  },
  historyContainer: {
    flex: 1,
    padding: 16,
    width: "100%",
    maxWidth: 600,
    marginHorizontal: "auto",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    fontSize: 24,
    color: "#0ea5e9",
    fontWeight: "bold",
  },
});

// --- Icon Component (Emoji as Text) ---
const Icon = ({ name, style }) => (
  <Text style={[style]}>{name}</Text>
);

// --- Type Definitions ---
const STATUS_ORDER = [
  "Ideal",
  "Good",
  "Acceptable",
  "Moderate",
  "Poor",
  "High",
];

// --- Contaminant Data based on PDFs ---
const CONTAMINANT_DATA = {
  pH: {
    unit: "pH",
    limit: "6.5-8.5",
    thresholds: {
      ideal: [7.2, 7.8],
      good: [6.8, 8.2],
      acceptable: [6.5, 8.5],
    },
  },
  Hardness: {
    unit: "ppm",
    limit: "10-100",
    thresholds: {
      good: [10, 100],
      moderate: [101, 250],
      high: [251, 1000],
    },
  },
  "Hydrogen Sulfide": {
    unit: "ppm",
    limit: "0",
    thresholds: {
      ideal: [0, 0],
      poor: [0.1, 100],
    },
  },
  Iron: {
    unit: "ppm",
    limit: "0.3",
    thresholds: {
      good: [0, 0.3],
      moderate: [0.31, 1],
      poor: [1.1, 100],
    },
  },
  Copper: {
    unit: "ppm",
    limit: "1.3",
    thresholds: {
      good: [0, 1.3],
      moderate: [1.31, 2],
      poor: [2.1, 100],
    },
  },
  Lead: {
    unit: "ppb",
    limit: "15",
    thresholds: {
      good: [0, 15],
      high: [16, 1000],
    },
  },
  Manganese: {
    unit: "ppm",
    limit: "0.1",
    thresholds: {
      good: [0, 0.1],
      moderate: [0.11, 0.5],
      poor: [0.51, 100],
    },
  },
  "Total Chlorine": {
    unit: "ppm",
    limit: "4",
    thresholds: {
      good: [0, 4],
      moderate: [4.1, 10],
      high: [10.1, 100],
    },
  },
  Mercury: {
    unit: "ppm",
    limit: "0.002",
    thresholds: {
      good: [0, 0.002],
      high: [0.0021, 1],
    },
  },
  Nitrate: {
    unit: "ppm",
    limit: "10",
    thresholds: {
      good: [0, 10],
      moderate: [10.1, 50],
      high: [50.1, 1000],
    },
  },
  Nitrite: {
    unit: "ppm",
    limit: "1",
    thresholds: {
      good: [0, 1],
      moderate: [1.1, 10],
      high: [10.1, 100],
    },
  },
  Sulfate: {
    unit: "ppm",
    limit: "250",
    thresholds: {
      good: [0, 250],
      moderate: [251, 400],
      high: [401, 2000],
    },
  },
  Zinc: {
    unit: "ppm",
    limit: "5",
    thresholds: {
      good: [0, 5],
      moderate: [5.1, 30],
      high: [30.1, 1000],
    },
  },
  Fluoride: {
    unit: "ppm",
    limit: "4",
    thresholds: {
      good: [0, 4],
      moderate: [4.1, 10],
      high: [10.1, 1000],
    },
  },
  "Sodium Chloride": {
    unit: "ppm",
    limit: "250",
    thresholds: {
      good: [0, 250],
      moderate: [251, 500],
      high: [501, 3000],
    },
  },
  "Total Alkalinity": {
    unit: "ppm",
    limit: "75-150",
    thresholds: {
      ideal: [80, 120],
      good: [75, 150],
      acceptable: [40, 180],
      poor: [0, 39],
    },
  },
};

const getStatus = (name, value) => {
  const data = CONTAMINANT_DATA[name];
  if (!data) return "Moderate";
  const { thresholds } = data;
  if (thresholds.ideal && value >= thresholds.ideal && value <= thresholds.ideal[1])
    return "Ideal";
  if (thresholds.good && value >= thresholds.good && value <= thresholds.good[1])
    return "Good";
  if (thresholds.acceptable && value >= thresholds.acceptable && value <= thresholds.acceptable[1])
    return "Acceptable";
  if (thresholds.poor && value >= thresholds.poor && value <= thresholds.poor[1])
    return "Poor";
  if (thresholds.high && value >= thresholds.high && value <= thresholds.high[1])
    return "High";
  if (thresholds.moderate && value >= thresholds.moderate && value <= thresholds.moderate[1])
    return "Moderate";
  return "Moderate";
};

const generateMockResults = () => {
  const results = {};
  Object.entries(CONTAMINANT_DATA).forEach(([name, data]) => {
    const limitValue = parseFloat(data.limit.split("-"));
    const randomFactor = (Math.random() - 0.25) * limitValue * 2;
    let value = Math.max(0, limitValue + randomFactor);
    if (name === "pH") value = parseFloat((6.8 + Math.random() * 1.5).toFixed(1));
    if (name === "Lead") value = parseFloat((Math.random() * 20).toFixed(2));
    if (name === "Mercury") value = parseFloat((Math.random() * 0.003).toFixed(4));
    results[name] = {
      value: parseFloat(value.toFixed(4)),
      unit: data.unit,
      status: getStatus(name, value),
      limit: data.limit,
    };
  });
  return results;
};

// --- Main App Component ---
export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [currentTestResult, setCurrentTestResult] = useState(null);
  const [testHistory, setTestHistory] = useState([]);

  const navigateTo = (name) => setScreen(name);
  const handleStartNewTest = () => {
    setCurrentTestResult(null);
    navigateTo("calibration");
  };
  const handleAnalysisComplete = (location) => {
    const newResult = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      location: location,
      contaminants: generateMockResults(),
    };
    setCurrentTestResult(newResult);
    navigateTo("results");
  };
  const saveTestToHistory = () => {
    if (currentTestResult) {
      setTestHistory((prev) => [currentTestResult, ...prev]);
    }
    navigateTo("history");
  };

  let renderScreen = null;
  switch (screen) {
    case "onboarding":
      renderScreen = (
        <OnboardingScreen
          onStart={handleStartNewTest}
          onViewHistory={() => navigateTo("history")}
          hasHistory={testHistory.length > 0}
        />
      );
      break;
    case "calibration":
      renderScreen = <CalibrationScreen onComplete={() => navigateTo("testing")} />;
      break;
    case "testing":
      renderScreen = <TestingScreen onComplete={handleAnalysisComplete} />;
      break;
    case "results":
      renderScreen = (
        <ResultsScreen
          result={currentTestResult}
          onSave={saveTestToHistory}
          onTestAgain={handleStartNewTest}
        />
      );
      break;
    case "history":
      renderScreen = (
        <HistoryScreen history={testHistory} onBack={() => navigateTo("onboarding")} />
      );
      break;
    default:
      renderScreen = null;
  }

  return <View style={styles.container}>{renderScreen}</View>;
}

// --- Screen Components ---
const OnboardingScreen = ({ onStart, onViewHistory, hasHistory }) => (
  <View style={styles.centered}>
    <View style={styles.header}>
      <Icon name="💧" style={{ fontSize: 50, color: "#0ea5e9" }} />
      <Text style={styles.title}>HydroSure</Text>
      <Text style={styles.subtitle}>Your Water Quality Companion</Text>
    </View>
    <Text style={styles.text}>
      Get instant, accurate analysis of your water. This app uses your phone's camera to read the Varify 16-in-1 test strips.
    </Text>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.primaryButton} onPress={onStart}>
        <Text style={styles.primaryText}>📊 Start New Test</Text>
      </TouchableOpacity>
      {hasHistory && (
        <TouchableOpacity style={styles.secondaryButton} onPress={onViewHistory}>
          <Text style={styles.secondaryText}>📋 View Test History</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const CalibrationScreen = ({ onComplete }) => (
  <View style={styles.centered}>
    <Text style={styles.title}>Step 1: Calibration</Text>
    <Text style={styles.text}>
      Place your standardized color chart on a flat, well-lit surface. Avoid shadows and glare for best results.
    </Text>
    <View style={styles.cameraBox}>
      <Icon name="📷" style={styles.iconPlaceholderLarge} />
      <Text style={styles.cameraText}>Camera View Placeholder</Text>
      <Text style={styles.text}>For a real app, integrate a camera library here.</Text>
    </View>
    <TouchableOpacity style={styles.primaryButton} onPress={onComplete}>
      <Text style={styles.primaryText}>✅ Simulate Chart Capture</Text>
    </TouchableOpacity>
  </View>
);

const TestingScreen = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const handleAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const mockLocation = {
        latitude: (28.6139 + (Math.random() - 0.5) * 0.1).toFixed(6),
        longitude: (77.2090 + (Math.random() - 0.5) * 0.1).toFixed(6),
      };
      onComplete(mockLocation);
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Step 2: Test Your Water</Text>
      <Text style={styles.text}>
        1. Dip the test strip into your water sample for <Text style={styles.bold}>2 seconds</Text>.
        {"\n"}2. Remove and gently shake off excess water.
        {"\n"}3. Wait for <Text style={styles.bold}>60 seconds</Text>.
        {"\n"}4. Place the strip in the camera view below.
      </Text>
      <View style={styles.cameraBox}>
        <Icon name="🧪" style={styles.iconPlaceholderLarge} />
        <Text style={styles.cameraText}>Test Strip Placeholder</Text>
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleAnalysis}
        disabled={loading}
      >
        <Text style={styles.primaryText}>{loading ? "Analyzing..." : "✅ Analyze Test Strip"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const ResultsScreen = ({ result, onSave, onTestAgain }) => {
  if (!result) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Analyzing results...</Text>
      </View>
    );
  }
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "ideal") return "#10b981";
    if (s === "good") return "#22c55e";
    if (s === "acceptable") return "#f59e0b";
    if (s === "moderate") return "#f97316";
    if (s === "poor") return "#ef4444";
    if (s === "high") return "#dc2626";
    return "#6b7280";
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Text style={[styles.title, { textAlign: "center" }]}>Test Results</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="📍" style={styles.iconSmall} />
          <Text style={styles.cardTitle}>Test Location & Time</Text>
        </View>
        <Text style={styles.cardText}>Lat: {result.location.latitude}, Lon: {result.location.longitude}</Text>
        <Text style={styles.cardText}>Date: {result.date}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="💧" style={styles.iconSmall} />
          <Text style={styles.cardTitle}>Contaminant Levels</Text>
        </View>
        {Object.entries(result.contaminants).map(([key, data]) => (
          <View key={key} style={styles.resultRow}>
            <View>
              <Text style={styles.contaminantName}>{key}</Text>
              <Text style={styles.contaminantLimit}>EPA Limit: {data.limit} {data.unit}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.bold}>{data.value} {data.unit}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(data.status) }]}>
                <Text style={styles.statusText}>{data.status}</Text>
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

const HistoryScreen = ({ history, onBack }) => (
  <View style={styles.historyContainer}>
    <View style={styles.historyHeader}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Test History</Text>
    </View>
    {history.length === 0 ? (
      <View style={styles.centered}>
        <Icon name="📋" style={styles.iconPlaceholderLarge} />
        <Text style={styles.text}>No tests saved yet.</Text>
      </View>
    ) : (
      <ScrollView>
        {history.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Icon name="🗓" style={styles.iconSmall} />
              <Text style={styles.cardTitle}>Test from {item.date}</Text>
            </View>
            <Text style={styles.cardText}>
              Location: {item.location.latitude}, {item.location.longitude}
            </Text>
            <Text style={[styles.cardText, { marginTop: 4 }]}>
              pH: {item.contaminants.pH.value}, Hardness: {item.contaminants.Hardness.value} ppm
            </Text>
          </View>
        ))}
      </ScrollView>
    )}
  </View>
);