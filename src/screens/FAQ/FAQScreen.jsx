// import React from 'react';
// import { View, Text } from 'react-native';
// import { styles } from '../../styles/globalStyles';

// const FAQScreen = () => (
//     <View>
//         <Text style={styles.pageTitle}>Frequently Asked Questions</Text>
//         <View style={{ marginVertical: 8 }}>
//             <Text style={styles.sectionTitle}>How accurate are the tests?</Text>
//             <Text style={styles.textSmall}>Our tests are calibrated to provide highly accurate readings for home use. For certified results, please consult a professional lab.</Text>
//         </View>
//         <View style={{ marginVertical: 8 }}>
//             <Text style={styles.sectionTitle}>How often should I test my water?</Text>
//             <Text style={styles.textSmall}>We recommend testing your water every 3-6 months, or if you notice any change in taste, smell, or appearance.</Text>
//         </View>
//     </View>
// );

// export default FAQScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView, // Ensures content doesn't overlap with phone notches/status bar
} from 'react-native';

// --- Data from your second example ---
// This is kept outside the component so it doesn't get recreated on every render
const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I use the water testing kit?',
        a: 'Simply dip the test strip in water for 2 seconds, then use our app to capture both the strip and the color chart. Our AI will analyze the results and provide a detailed report.',
      },
      {
        q: 'Do I need to buy the testing kit?',
        a: "Yes, you'll need our 16-parameter testing kit which includes test strips and a color comparison chart. The kit is available in the Shop tab.",
      },
    ],
  },
  {
    category: 'Testing Process',
    questions: [
      {
        q: 'How accurate are the results?',
        a: 'Our AI-powered analysis provides 92%+ accuracy when images are captured in good lighting conditions. Results are comparable to laboratory testing for most parameters.',
      },
      {
        q: 'Can I test any type of water?',
        a: "Yes! You can test drinking water, well water, tap water, or any water source you're concerned about. The kit works with all freshwater sources.",
      },
      {
        q: 'How long does testing take?',
        a: 'The entire process takes about 3-5 minutes: 2 seconds for the strip reaction, plus time to capture images and receive AI analysis results.',
      },
    ],
  },
  {
    category: 'Understanding Results',
    questions: [
      {
        q: 'What pH level is safe for drinking water?',
        a: 'Safe drinking water typically has a pH between 6.5 and 8.5. Our app will indicate if your water falls outside this range and provide recommendations.',
      },
      {
        q: 'What should I do if contaminants are detected?',
        a: 'The app provides specific recommendations based on detected contaminants. This may include water filtration, boiling, or professional testing for certain parameters.',
      },
      {
        q: 'Can I save and share my test results?',
        a: 'Yes! All test results are automatically saved in the app. You can download PDF reports or share them directly via social media or messaging apps.',
      },
    ],
  },
  {
    category: 'Technical Support',
    questions: [
      {
        q: 'Why is my camera not working?',
        a: "Ensure you've granted camera permissions in your device settings. If issues persist, try restarting the app or your device.",
      },
      {
        q: 'Can I use the app offline?',
        a: "You can capture images offline, but you'll need an internet connection for AI analysis. Results will sync when you're back online.",
      },
      {
        q: 'How often should I test my water?',
        a: 'We recommend testing every 3-6 months for household water, or immediately if you notice changes in taste, smell, or appearance.',
      },
    ],
  },
];

// --- Reusable Accordion Component ---
// This component manages its own "open" or "closed" state
const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.accordionItem}>
      {/* The TouchableOpacity acts as the trigger */}
      <TouchableOpacity
        style={styles.accordionTrigger}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionQuestion}>{question}</Text>
        {/* Simple icon that changes based on state */}
        <Text style={styles.accordionIcon}>{isOpen ? '−' : '+'}</Text>
      </TouchableOpacity>

      {/* The content is conditionally rendered based on the isOpen state */}
      {isOpen && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

// --- Main FAQ Screen Component ---
const FAQScreen = () => {
  // State for the search query (from your second example)
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic (from your second example)
  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.pageTitle}>Frequently Asked Questions</Text>
        <Text style={styles.pageSubtitle}>Find answers to common questions</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          {/* In React Native, we use TextInput and onChangeText */}
          <TextInput
            placeholder="Search questions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>

        {/* FAQ Sections */}
        <View style={styles.listContainer}>
          {filteredFaqs.map((category, idx) => (
            <View key={idx} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.category}</Text>
              {category.questions.map((faq, faqIdx) => (
                <AccordionItem
                  key={faqIdx}
                  question={faq.q}
                  answer={faq.a}
                />
              ))}
            </View>
          ))}

          {/* "No results" message */}
          {filteredFaqs.length === 0 && (
            <Text style={styles.noResultsText}>
              No questions found matching your search.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
// Combines styles from both examples and adds new ones for the accordion
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  listContainer: {
    // This view holds all the categories
  },
  categoryContainer: {
    marginBottom: 16, // Space between categories
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF', // A blue "primary" color
    marginBottom: 12,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
  // Accordion Styles
  accordionItem: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    overflow: 'hidden', // Keeps content inside the rounded corners
  },
  accordionTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  accordionQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1, // Ensures text wraps if it's long
    marginRight: 10,
  },
  accordionIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  accordionContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10, // Space between divider and text
  },
  accordionAnswer: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22, // Improves readability
  },
});

export default FAQScreen;