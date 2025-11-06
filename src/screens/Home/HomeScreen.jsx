// // import React, { useState, useEffect } from 'react';
// // import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
// // import { styles, colors } from '../../styles/globalStyles';

// // // Let's create a fake function to simulate fetching data from a server
// // const fetchDashboardData = () => {
// //     return new Promise(resolve => {
// //         setTimeout(() => {
// //             resolve({
// //                 lastTest: {
// //                     ph: (Math.random() * (7.5 - 6.5) + 6.5).toFixed(1), // Random pH between 6.5 and 7.5
// //                     date: 'Sept 6, 2025',
// //                 },
// //                 qualityStatus: 'Good',
// //                 history: [
// //                     { id: 1, date: 'Aug 28, 2025', location: 'Delhi, India', status: 'Passed', color: colors.success },
// //                     { id: 2, date: 'Aug 15, 2025', location: 'Delhi, India', status: 'Warning', color: colors.warning },
// //                 ]
// //             });
// //         }, 1000); // Simulate a 1-second network delay
// //     });
// // };


// // const HomeScreen = () => {
// //     // 1. STATE MANAGEMENT
// //     // State to hold our dashboard data. It's null initially.
// //     const [dashboardData, setDashboardData] = useState(null);
// //     // State to know if we are currently loading data.
// //     const [isLoading, setIsLoading] = useState(true);

// //     // 2. DATA FETCHING
// //     // This function will get the data and update our state
// //     const loadData = () => {
// //         setIsLoading(true);
// //         fetchDashboardData()
// //             .then(data => {
// //                 setDashboardData(data);
// //             })
// //             .catch(error => console.error("Error fetching data:", error))
// //             .finally(() => {
// //                 setIsLoading(false);
// //             });
// //     };

// //     // useEffect runs once when the component is first rendered
// //     useEffect(() => {
// //         loadData();
// //     }, []); // The empty array [] means this effect runs only once on mount


// //     // 3. LOADING UI
// //     // While loading, show a spinner
// //     if (isLoading) {
// //         return (
// //             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //                 <ActivityIndicator size="large" color={colors.primary} />
// //                 <Text style={{ marginTop: 8 }}>Loading Dashboard...</Text>
// //             </View>
// //         );
// //     }
    
// //     // In case data fetching fails
// //     if (!dashboardData) {
// //         return (
// //              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //                 <Text>Could not load data. Please try again.</Text>
// //             </View>
// //         )
// //     }

// //     // 4. DYNAMIC & INTERACTIVE UI
// //     // Once loaded, show the data from our state
// //     return (
// //         <View>
// //             <Text style={styles.pageTitle}>Dashboard</Text>
// //             <View style={styles.grid}>
// //                 <View style={[styles.card, { backgroundColor: colors.infoLight, flex: 1, marginRight: 8 }]}>
// //                     <Text style={[styles.cardTitle, { color: colors.primaryDark }]}>Last Test Result</Text>
// //                     {/* Use data from state */}
// //                     <Text>pH: {dashboardData.lastTest.ph} (Normal)</Text>
// //                     <Text style={styles.textSmall}>{dashboardData.lastTest.date}</Text>
// //                 </View>
// //                 <View style={[styles.card, { backgroundColor: colors.successLight, flex: 1, marginLeft: 8 }]}>
// //                     <Text style={[styles.cardTitle, { color: colors.success }]}>Water Quality Status</Text>
// //                     {/* Use data from state */}
// //                     <Text>{dashboardData.qualityStatus}</Text>
// //                 </View>
// //             </View>
// //             <View style={{ marginTop: 24 }}>
// //                 <Text style={styles.sectionTitle}>Test History</Text>
// //                 {/* Map over the history array from state to create a list */}
// //                 {dashboardData.history.map(item => (
// //                     <View key={item.id} style={styles.historyItem}>
// //                         <View>
// //                             <Text>Test from {item.date}</Text>
// //                             <Text style={styles.textSmall}>{item.location}</Text>
// //                         </View>
// //                         <Text style={{ fontWeight: 'bold', color: item.color }}>{item.status}</Text>
// //                     </View>
// //                 ))}
// //             </View>
            
// //             {/* Add an interactive button to refresh the data! */}
// //             <TouchableOpacity style={styles.button} onPress={loadData}>
// //                 <Text style={styles.buttonText}>Refresh Data</Text>
// //             </TouchableOpacity>
// //         </View>
// //     );
// // };

// // export default HomeScreen;


// import React, { useState, useEffect } from "react";
// import {
// View,
// Text,
// ActivityIndicator,
// TouchableOpacity,
// ScrollView,
// StyleSheet,
// } from "react-native";
// import { colors } from "../../styles/globalStyles";
// // Simulated data fetching
// const fetchDashboardData = () => {
// return new Promise((resolve) => {
// setTimeout(() => {
// resolve({
// lastTest: {
// ph: (Math.random() * (7.5 - 6.5) + 6.5).toFixed(1),
// date: "Sept 6, 2025",
// },
// qualityStatus: "Good",
// history: [
// {
// id: 1,
// date: "Aug 28, 2025",
// location: "Delhi, India",
// status: "Passed",
// },
// {
// id: 2,
// date: "Aug 15, 2025",
// location: "Delhi, India",
// status: "Warning",
// },
// ],
// });
// }, 1000);
// });
// };
// const HomeScreen = () => {
// const [dashboardData, setDashboardData] = useState(null);
// const [isLoading, setIsLoading] = useState(true);
// const loadData = () => {
// setIsLoading(true);
// fetchDashboardData()
// .then((data) => setDashboardData(data))
// .catch((error) => console.error("Error fetching data:", error))
// .finally(() => setIsLoading(false));
// };
// useEffect(() => {
// loadData();
// }, []);
// if (isLoading) {
// return (
// <View style={styles.loaderContainer}>
// <ActivityIndicator size="large" color="#007B83" />
// <Text style={styles.loaderText}>Loading Dashboard...</Text>
// </View>
// );
// }
// if (!dashboardData) {
// return (
// <View style={styles.loaderContainer}>
// <Text style={styles.errorText}>Could not load data. Please try again.</Text>
// <TouchableOpacity style={styles.reloadButton} onPress={loadData}>
// <Text style={styles.reloadText}>Reload</Text>
// </TouchableOpacity>
// </View>
// );
// }
// return (
// <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} >
// <Text style={styles.title}>Dashboard</Text>
//   {/* Cards Section */}
//   <View style={styles.cardRow}>
//     <View style={[styles.card, { backgroundColor: "#E6F7FB" }]}>
//       <Text style={styles.cardTitle}>Last Test Result</Text>
//       <Text style={styles.cardValue}>{dashboardData.lastTest.ph} pH</Text>
//       <Text style={styles.cardSub}>{dashboardData.lastTest.date}</Text>
//     </View>

//     <View style={[styles.card, { backgroundColor: "#E8F8E1" }]}>
//       <Text style={styles.cardTitle}>Water Quality</Text>
//       <Text style={[styles.cardValue, { color: "#28A745" }]}>
//         {dashboardData.qualityStatus}
//       </Text>
//     </View>
//   </View>

//   {/* History Section */}
//   <Text style={styles.sectionTitle}>Test History</Text>
//   {dashboardData.history.map((item) => (
//     <View key={item.id} style={styles.historyCard}>
//       <View>
//         <Text style={styles.historyDate}>{item.date}</Text>
//         <Text style={styles.historyLocation}>{item.location}</Text>
//       </View>
//       <Text
//         style={[
//           styles.statusBadge,
//           {
//             backgroundColor:
//               item.status === "Passed" ? "#C8F7C5" : "#FFF3CD",
//             color: item.status === "Passed" ? "#2E7D32" : "#856404",
//           },
//         ]}
//       >
//         {item.status}
//       </Text>
//     </View>
//   ))}
// </ScrollView>
// );
// };
// const styles = StyleSheet.create({
// container: {
// padding: 20,
// backgroundColor: "#F8FCFF",
// },
// loaderContainer: {
// flex: 1,
// justifyContent: "center",
// alignItems: "center",
// backgroundColor: "#F8FCFF",
// },
// loaderText: {
// marginTop: 8,
// color: "#555",
// fontSize: 16,
// },
// errorText: {
// fontSize: 16,
// color: "#333",
// },
// reloadButton: {
// marginTop: 12,
// backgroundColor: "#007B83",
// paddingHorizontal: 20,
// paddingVertical: 10,
// borderRadius: 8,
// },
// reloadText: {
// color: "#fff",
// fontWeight: "600",
// },
// title: {
// fontSize: 28,
// fontWeight: "700",
// color: "#007B83",
// marginBottom: 24,
// },
// cardRow: {
// flexDirection: "row",
// justifyContent: "space-between",
// marginBottom: 30,
// },
// card: {
// flex: 1,
// padding: 18,
// borderRadius: 16,
// shadowColor: "#000",
// shadowOpacity: 0.1,
// shadowRadius: 6,
// elevation: 3,
// marginHorizontal: 6,
// },
// cardTitle: {
// fontSize: 16,
// color: "#333",
// marginBottom: 8,
// fontWeight: "600",
// },
// cardValue: {
// fontSize: 20,
// fontWeight: "700",
// color: "#007B83",
// },
// cardSub: {
// marginTop: 4,
// color: "#666",
// fontSize: 14,
// },
// sectionTitle: {
// fontSize: 20,
// fontWeight: "700",
// color: "#007B83",
// marginBottom: 16,
// },
// historyCard: {
// backgroundColor: "#fff",
// borderRadius: 14,
// padding: 16,
// marginBottom: 12,
// flexDirection: "row",
// justifyContent: "space-between",
// alignItems: "center",
// shadowColor: "#000",
// shadowOpacity: 0.05,
// shadowRadius: 3,
// elevation: 2,
// },
// historyDate: {
// fontSize: 16,
// fontWeight: "500",
// color: "#333",
// },
// historyLocation: {
// fontSize: 14,
// color: "#777",
// },
// statusBadge: {
// paddingVertical: 4,
// paddingHorizontal: 10,
// borderRadius: 12,
// fontWeight: "600",
// },
// });
// export default HomeScreen;


import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image, // Import Image
  Linking, // Import Linking
  RefreshControl, // Import RefreshControl
} from "react-native";
// Assuming 'colors' are in this file, otherwise import them
// import { colors } from "../../styles/globalStyles";

// Simulated data fetching
const fetchDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lastTest: {
          ph: (Math.random() * (7.5 - 6.5) + 6.5).toFixed(1),
          date: "Sept 6, 2025",
        },
        qualityStatus: "Good",
        history: [
          {
            id: 1,
            date: "Aug 28, 2025",
            location: "Delhi, India",
            status: "Passed",
          },
          {
            id: 2,
            date: "Aug 15, 2025",
            location: "Delhi, India",
            status: "Warning",
          },
        ],
        // --- NEW DATA ---
        latestBlogs: [
          {
            id: "b1",
            title: "5 Simple Ways to Test Your Water Quality at Home",
            source: "WaterSafe.org",
            // Using a placeholder image
            thumbnail: "https://picsum.photos/seed/water1/300/200",
            url: "https://etrlabs.com/different-types-of-ways-to-test-your-water-quality/?srsltid=AfmBOopxgx52GbV05enQp99gvBVVH21IUJFo3KLNNou2goieIKMccKCT",
          },
          {
            id: "b2",
            title: "Understanding pH Levels in Drinking Water",
            source: "HealthLine",
            thumbnail: "https://picsum.photos/seed/water2/300/200",
            url: "hhttps://www.healthline.com/health/ph-of-drinking-water",
          },
          {
            id: "b3",
            title: "The Global Water Crisis: What You Need to Know",
            source: "WHO",
            thumbnail: "https://picsum.photos/seed/water3/300/200",
            url: "https://www.who.int/news-room/fact-sheets/detail/drinking-water",
          },
        ],
      });
    }, 1000);
  });
};

const HomeScreen = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // State for pull-to-refresh

  const loadData = () => {
    setIsLoading(true);
    fetchDashboardData()
      .then((data) => setDashboardData(data))
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setIsLoading(false));
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  // Function for pull-to-refresh
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchDashboardData()
      .then((data) => setDashboardData(data))
      .catch((error) => console.error("Error refreshing data:", error))
      .finally(() => setIsRefreshing(false));
  }, []);

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007B83" />
        <Text style={styles.loaderText}>Loading Dashboard...</Text>
      </View>
    );
  }

  // --- ERROR STATE ---
  if (!dashboardData) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Could not load data. Please try again.</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={loadData}>
          <Text style={styles.reloadText}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- MAIN CONTENT ---
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      // Add the RefreshControl
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={["#007B83"]} // Spinner color
        />
      }
    >
      <Text style={styles.title}>Dashboard</Text>

      {/* Cards Section */}
      <View style={styles.cardRow}>
        <View style={[styles.card, { backgroundColor: "#E6F7FB" }]}>
          <Text style={styles.cardTitle}>Last Test Result</Text>
          <Text style={styles.cardValue}>{dashboardData.lastTest.ph} pH</Text>
          <Text style={styles.cardSub}>{dashboardData.lastTest.date}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#E8F8E1" }]}>
          <Text style={styles.cardTitle}>Water Quality</Text>
          <Text style={[styles.cardValue, { color: "#28A745" }]}>
            {dashboardData.qualityStatus}
          </Text>
        </View>
      </View>

      {/* History Section */}
      <Text style={styles.sectionTitle}>Test History</Text>
      {dashboardData.history.map((item) => (
        <View key={item.id} style={styles.historyCard}>
          <View>
            <Text style={styles.historyDate}>{item.date}</Text>
            <Text style={styles.historyLocation}>{item.location}</Text>
          </View>
          <Text
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "Passed" ? "#C8F7C5" : "#FFF3CD",
                color: item.status === "Passed" ? "#2E7D32" : "#856404",
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
      ))}

      {/* --- NEW BLOGS SECTION --- */}
      <Text style={styles.sectionTitle}>Latest Articles</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.blogScroll}
      >
        {dashboardData.latestBlogs.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.blogCard}
            // Open the link on press
            onPress={() => Linking.openURL(item.url)}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.blogImage} />
            <View style={styles.blogContent}>
              <Text style={styles.blogTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.blogSource}>{item.source}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

// --- UPDATED STYLES ---
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // Add padding to bottom
    backgroundColor: "#F8FCFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FCFF",
  },
  loaderText: {
    marginTop: 8,
    color: "#555",
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#333",
  },
  reloadButton: {
    marginTop: 12,
    backgroundColor: "#007B83",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reloadText: {
    color: "#fff",
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#007B83",
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 6,
  },
  cardTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007B83",
  },
  cardSub: {
    marginTop: 4,
    color: "#666",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007B83",
    marginBottom: 16,
    marginTop: 10, // Add some margin top
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  historyLocation: {
    fontSize: 14,
    color: "#777",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontWeight: "600",
  },
  // --- New Blog Styles ---
  blogScroll: {
    marginHorizontal: -6, // Offset card margin
  },
  blogCard: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  blogImage: {
    width: "100%",
    height: 110,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  blogContent: {
    padding: 12,
  },
  blogTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  blogSource: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
});

export default HomeScreen;