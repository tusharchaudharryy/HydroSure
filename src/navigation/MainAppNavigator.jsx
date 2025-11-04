// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';

// import { styles } from '../styles/globalStyles';
// import { BottomNavBar } from '../components/layout/BottomNavBar';
// import HomeScreen from '../screens/Home/HomeScreen';
// import ShopScreen from '../screens/Shop/ShopScreen';
// import TestingFlow from '../screens/Testing/TestingFlow';
// import FAQScreen from '../screens/FAQ/FAQScreen';

// export const MainAppNavigator = ({ onLogout }) => {
//     const [activeTab, setActiveTab] = useState('testing');

//     const renderContent = () => {
//         switch (activeTab) {
//             case 'home': return <HomeScreen />;
//             case 'shop': return <ShopScreen />;
//             case 'testing': return <TestingFlow />;
//             case 'faq': return <FAQScreen />;
//             default: return <HomeScreen />;
//         }
//     };

//     return (
//         <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
//             <View style={styles.header}>
//                 <View style={styles.headerLeft}>
//                     <Image
//                     source={require('../../assets/logo_transparent.png')} // adjust path if needed
//                     style={styles.logo}
//                     />
//                     <Text style={styles.headerTitle}>HydroSure</Text>
//                 </View>
//                 <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
//                     <Text style={{ fontSize: 20 }}>⏻️</Text>
//                 </TouchableOpacity>
//             </View>

//             <ScrollView contentContainerStyle={styles.mainContent}>
//                 {renderContent()}
//             </ScrollView>
//             <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
//         </View>
//     );
// // };
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

// import { styles } from '../styles/globalStyles';
// import { BottomNavBar } from '../components/layout/BottomNavBar';
// import HomeScreen from '../screens/Home/HomeScreen';
// import ShopScreen from '../screens/Shop/ShopScreen';
// import TestingFlow from '../screens/Testing/TestingFlow';
// import FAQScreen from '../screens/FAQ/FAQScreen';

// export const MainAppNavigator = ({ onLogout }) => {
//     const [activeTab, setActiveTab] = useState('testing');

//     const renderContent = () => {
//         switch (activeTab) {
//             case 'home': return <HomeScreen />;
//             case 'shop': return <ShopScreen />;
//             case 'testing': return <TestingFlow />;
//             case 'faq': return <FAQScreen />;
//             default: return <HomeScreen />;
//         }
//     };

//     return (
//         <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
//             <View style={styles.header}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     <Text style={{ fontSize: 28, color: '#2563EB', marginRight: 8 }}>🛡️</Text>
//                     <Text style={styles.headerTitle}>HydroSure</Text>
//                 </View>
//                 <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
//                     <Text style={{ fontSize: 20 }}>🚪</Text>
//                 </TouchableOpacity>
//             </View>
//             <ScrollView contentContainerStyle={styles.mainContent}>
//                 {renderContent()}
//             </ScrollView>
//             <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
//         </View>
//     );
// };

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import LinearGradient from "react-native-linear-gradient";

// import HomeScreen from "../screens/Home/HomeScreen";
// import ShopScreen from "../screens/Shop/ShopScreen";
// import TestingFlow from "../screens/Testing/TestingFlow";
// import FAQScreen from "../screens/FAQ/FAQScreen";

// const Tab = createBottomTabNavigator();

// export const MainAppNavigator = ({ onLogout }) =>  {
//   return (
//     <LinearGradient
//       colors={["#E0FFFF", "#A7FFEB", "#B2DFDB"]} // soft teal glass look
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.gradient}
//     >
//       <View style={styles.overlay}>
//         <Tab.Navigator
//           screenOptions={{
//             headerShown: false,
//             tabBarStyle: {
//               backgroundColor: "rgba(255,255,255,0.6)",
//               borderTopWidth: 0,
//               elevation: 5,
//               position: "absolute",
//             },
//             tabBarActiveTintColor: "#00796B",
//           }}
//         >
//           <Tab.Screen name="Home" component={HomeScreen} />
//           <Tab.Screen name="Shop" component={ShopScreen} />
//           <Tab.Screen name="Testing" component={TestingFlow} />
//           <Tab.Screen name="FAQ" component={FAQScreen} />
//         </Tab.Navigator>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(255,255,255,0.3)", // translucent glass layer
//   },
// });





// import React from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import HomeScreen from "../screens/Home/HomeScreen";
// import TestingFlow from "../screens/Testing/TestingFlow";
// import FAQScreen from "../screens/FAQ/FAQScreen";
// import ShopScreen from "../screens/Shop/ShopScreen";

// const Tab = createBottomTabNavigator();

// function Header({ onLogout }) {
//   return (
//     <View style={styles.header}>
//       <View style={styles.headerLeft}>
//         <Image
//           source={require("../../assets/logo.png")}
//           style={styles.logo}
//         />
//         <Text style={styles.headerTitle}>HydroSure</Text>
//       </View>

//       <TouchableOpacity onPress={onLogout}>
//         <Ionicons name="power-outline" size={24} color="#006D77" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// export const MainAppNavigator = ({ onLogout }) =>   {
//   const handleLogout = () => {
//     console.log("Logout pressed");
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Header onLogout={handleLogout} />

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         <Tab.Navigator
//           screenOptions={{
//             headerShown: false,
//             tabBarStyle: styles.tabBar,
//             tabBarActiveTintColor: "#006D77",
//             tabBarInactiveTintColor: "#7FBCC5",
//           }}
//         >
//           <Tab.Screen
//             name="Home"
//             component={HomeScreen}
//             options={{
//               tabBarIcon: ({ color, size }) => (
//                 <Ionicons name="home-outline" color={color} size={size} />
//               ),
//             }}
//           />
//           <Tab.Screen
//             name="Testing"
//             component={TestingFlow}
//             options={{
//               tabBarIcon: ({ color, size }) => (
//                 <Ionicons name="flask-outline" color={color} size={size} />
//               ),
//             }}
//           />
//           <Tab.Screen
//             name="Shop"
//             component={ShopScreen}
//             options={{
//               tabBarIcon: ({ color, size }) => (
//                 <Ionicons name="cart-outline" color={color} size={size} />
//               ),
//             }}
//           />
//           <Tab.Screen
//             name="FAQ"
//             component={FAQScreen}
//             options={{
//               tabBarIcon: ({ color, size }) => (
//                 <Ionicons name="help-circle-outline" color={color} size={size} />
//               ),
//             }}
//           />
//         </Tab.Navigator>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "rgba(240, 252, 255, 0.9)", // light teal glass background
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 50,
//     paddingHorizontal: 24,
//     paddingBottom: 10,
//     backgroundColor: "rgba(255, 255, 255, 0.5)",
//     borderBottomWidth: 0,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 5,
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//   },
// //   headerLeft: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },
// //   logo: {
// //     width: 55,
// //     height: 45,
// //     resizeMode: "contain",
// //     marginRight: 10,
// //   },
// //   headerTitle: {
// //     fontSize: 26,
// //     fontWeight: "bold",
// //     color: "#006D77", // dark teal
// //     letterSpacing: 0.5,
// //   },
// // logo: {
// //   width: 85,     // make it larger (visibly noticeable)
// //   height: 65,
// //   resizeMode: "contain",
// //   marginRight: 12,
// //   marginTop: 4,  // adjusts vertical alignment a bit
// // },
// // headerTitle: {
// //   fontSize: 28,  // slightly bigger text
// //   fontWeight: "bold",
// //   color: "#006D77",
// //   letterSpacing: 0.6,
// // },
// // headerLeft: {
// //   flexDirection: "row",
// //   alignItems: "center",
// //   gap: 6,
// // },
// header: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
//   paddingTop: 40,
//   paddingHorizontal: 20,
//   paddingBottom: 12,
//   backgroundColor: "rgba(255, 255, 255, 0.4)",
//   borderBottomWidth: 0,
//   shadowColor: "#00B4D8",
//   shadowOpacity: 0.15,
//   shadowOffset: { width: 0, height: 2 },
//   shadowRadius: 8,
//   elevation: 6,
//   borderBottomLeftRadius: 20,
//   borderBottomRightRadius: 20,
// },
// headerLeft: {
//   flexDirection: "row",
//   alignItems: "center",
// },
// logo: {
//   width: 48,   // bigger drop
//   height: 35,
//   resizeMode: "contain",
//   marginRight: 10,
//   marginTop: 4,  // adjusts vertical centering
// },
// headerTitle: {
//   fontSize: 26,
//   fontWeight: "700",
//   color: "#006D77",
//   letterSpacing: 0.6,
// },


//   tabContainer: {
//     flex: 1,
//     overflow: "hidden",
//   },
//   tabBar: {
//     position: "absolute",
//     backgroundColor: "rgba(255, 255, 255, 0.7)",
//     borderTopWidth: 0,
//     borderRadius: 20,
//     margin: 10,
//     height: 60,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 10,
//     elevation: 10,
//   },
// });

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import HomeScreen from "../screens/Home/HomeScreen";
import TestingFlow from "../screens/Testing/TestingFlow";
import FAQScreen from "../screens/FAQ/FAQScreen";
import ShopScreen from "../screens/Shop/ShopScreen";

const Tab = createBottomTabNavigator();

function Header({ onLogout }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headerTitle}>HydroSure</Text>
      </View>

      <TouchableOpacity onPress={onLogout}>
        <Ionicons name="power-outline" size={24} color="#006D77" />
      </TouchableOpacity>
    </View>
  );
}

export const MainAppNavigator = ({ onLogout }) => {
  const handleLogout = () => {
    console.log("Logout pressed");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: "#006D77",
            tabBarInactiveTintColor: "#7FBCC5",
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Testing"
            component={TestingFlow}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="flask-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Shop"
            component={ShopScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cart-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="FAQ"
            component={FAQScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="help-circle-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(240, 252, 255, 0.9)", // light teal glass background
  },

  // ----- HEADER -----
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderBottomWidth: 0,
    shadowColor: "#00B4D8",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 48,
    height: 35,
    resizeMode: "contain",
    marginRight: 10,
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#006D77",
    letterSpacing: 0.6,
  },

  // ----- TABS -----
  tabContainer: {
    flex: 1,
    overflow: "hidden",
  },
  tabBar: {
    backgroundColor: "rgba(255, 255, 255, 0.85)", // subtle frosted glass effect
    borderTopWidth: 0,
    height: 65,
    position: "relative", // ensures it's fixed, not floating
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backdropFilter: "blur(10px)", // works in web or Expo web
  },
});

export default MainAppNavigator;