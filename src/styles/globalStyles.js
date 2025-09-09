// FILE: varify-app/src/styles/globalStyles.js

import { StyleSheet, Dimensions } from 'react-native';

export const colors = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#3B82F6',
  accent: '#10B981',
  warning: '#D97706',
  danger: '#EA580C',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#D1D5DB',
  background: '#F9FAFB',
  text: '#1F2937',
  success: '#059669',
  successLight: '#D1FAE5',
  info: '#1D4ED8',
  infoLight: '#EFF6FF',
  logo: '#1c4b5b',
};

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    // Splash
    splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.logo },
    splashTitle: { fontSize: 48, fontWeight: 'bold', marginTop: 16, color: colors.white },
    splashSubtitle: { fontSize: 18, marginTop: 30, color: colors.white },
    // Auth
    authCard: { width: '100%', backgroundColor: colors.white, padding: 32, borderRadius: 16, elevation: 5, shadowColor: colors.black, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4 },
    authTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: colors.text },
    authSubtitle: { color: colors.gray, textAlign: 'center', marginBottom: 24 },
    form: { width: '100%' },
    input: { width: '100%', paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 12, color: colors.text },
    button: { width: '100%', backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
    authLink: { color: colors.primary, textAlign: 'center' },
    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text },
    logoutButton: { padding: 8 },
    // Main Content
    mainContent: { padding: 16, paddingBottom: 80 },
    pageTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: colors.text },
    card: { padding: 16, borderRadius: 8, marginBottom: 16 },
    cardTitle: { fontWeight: 'bold', marginBottom: 4 },
    textSmall: { fontSize: 14, color: colors.gray },
    sectionTitle: { fontWeight: 'bold', marginBottom: 8, fontSize: 16, color: colors.text },
    // Home Screen
    historyItem: { backgroundColor: colors.lightGray, padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    grid: { flexDirection: 'row', justifyContent: 'space-between' },
    // Shop Screen
    shopItem: { width: '48%', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 16, alignItems: 'center' },
    shopImage: { height: 100, width: '100%', backgroundColor: colors.lightGray, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    shopTitle: { fontWeight: 'bold', fontSize: 14, textAlign: 'center', color: colors.text },
    shopPrice: { fontSize: 12, color: colors.gray },
    addToCartButton: { backgroundColor: colors.primaryLight, paddingVertical: 6, borderRadius: 4, width: '100%', marginTop: 8 },
    addToCartText: { color: colors.white, fontSize: 12, textAlign: 'center' },
    // Testing Flow
    stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    instructionCard: { backgroundColor: colors.lightGray, padding: 16, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
    instructionStep: { fontWeight: 'bold', fontSize: 18, marginBottom: 4, color: colors.text },
    permissionCard: { backgroundColor: colors.lightGray, padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    allowButton: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
    allowButtonText: { color: colors.white, fontSize: 14 },
    cameraPlaceholder: { height: Dimensions.get('window').width - 32, width: '100%', borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, marginBottom: 16 },
    halfButton: { width: '48%' },
    assessmentCard: { backgroundColor: colors.infoLight, padding: 16, borderRadius: 8, marginVertical: 16 },
});

