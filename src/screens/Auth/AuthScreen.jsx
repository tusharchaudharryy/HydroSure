// import React, { useState } from "react";
// import {
// View,
// Text,
// TextInput,
// TouchableOpacity,
// Alert,
// Image,
// StyleSheet,
// KeyboardAvoidingView,
// ScrollView,
// Platform,
// } from "react-native";
// import { auth } from "../../firebase";
// import {
// createUserWithEmailAndPassword,
// signInWithEmailAndPassword,
// } from "firebase/auth";
// export const AuthScreen = ({ setPage, onLogin, isSignup = false }) => {
// const [email, setEmail] = useState("");
// const [password, setPassword] = useState("");
// const [fullName, setFullName] = useState("");
// const handleSignUp = () => {
// if (!email || !password || !fullName) {
// Alert.alert("Error", "Please fill in all fields.");
// return;
// }
// createUserWithEmailAndPassword(auth, email, password)
// .then((userCredentials) => {
// const user = userCredentials.user;
// console.log("Registered with:", user.email);
// onLogin();
// })
// .catch((error) => Alert.alert("Sign Up Error", error.message));
// };
// const handleLogin = () => {
// if (!email || !password) {
// Alert.alert("Error", "Please enter both email and password.");
// return;
// }
// signInWithEmailAndPassword(auth, email, password)
// .then((userCredentials) => {
// const user = userCredentials.user;
// console.log("Logged in with:", user.email);
// onLogin();
// })
// .catch((error) => Alert.alert("Login Error", error.message));
// };
// return (
// <KeyboardAvoidingView
// behavior={Platform.OS === "ios" ? "padding" : undefined}
// style={styles.container}
// >
// <ScrollView contentContainerStyle={styles.scrollContent}>
// <View style={styles.card}>
// <Image
// source={require("../../../assets/logo_transparent.png")}
// //style={{ width: 200, height: 200, marginRight: 8, resizeMode: 'contain' }}
// style={styles.logo}
// />
//       <Text style={styles.title}>
//         {isSignup ? "Create Account" : "Welcome Back!"}
//       </Text>
//       <Text style={styles.subtitle}>
//         {isSignup
//           ? "Join to monitor and test your water quality."
//           : "Sign in to continue."}
//       </Text>

//       <View style={styles.form}>
//         {isSignup && (
//           <TextInput
//             placeholder="Full Name"
//             style={styles.input}
//             value={fullName}
//             onChangeText={setFullName}
//             placeholderTextColor="#A0A0A0"
//           />
//         )}
//         <TextInput
//           placeholder="Email Address"
//           style={styles.input}
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//           placeholderTextColor="#A0A0A0"
//         />
//         <TextInput
//           placeholder="Password"
//           style={styles.input}
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//           placeholderTextColor="#A0A0A0"
//         />

//         <TouchableOpacity
//           onPress={isSignup ? handleSignUp : handleLogin}
//           style={styles.button}
//         >
//           <Text style={styles.buttonText}>
//             {isSignup ? "Sign Up" : "Login"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         onPress={() => setPage(isSignup ? "login" : "signup")}
//         style={{ marginTop: 24 }}
//       >
//         <Text style={styles.link}>
//           {isSignup
//             ? "Already have an account? Login"
//             : "Don't have an account? Sign Up"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   </ScrollView>
// </KeyboardAvoidingView>
// );
// };
// const styles = StyleSheet.create({
// container: {
// flex: 1,
// backgroundColor: "#F8FCFF",
// justifyContent: "center",
// },
// scrollContent: {
// flexGrow: 1,
// justifyContent: "center",
// alignItems: "center",
// paddingVertical: 40,
// },
// // card: {
// // width: "85%",
// // backgroundColor: "#FFFFFF",
// // borderRadius: 20,
// // padding: 24,
// // shadowColor: "#000",
// // shadowOpacity: 0.1,
// // shadowRadius: 10,
// // elevation: 5,
// // alignItems: "center",
// // },
// // logo: {
// // width: 200,
// // height: 200,
// // marginBottom: 8,
// // },
// title: {
// fontSize: 26,
// fontWeight: "700",
// color: "#007B83",
// marginBottom: 4,
// },
// subtitle: {
// fontSize: 15,
// color: "#5A5A5A",
// textAlign: "center",
// marginBottom: 20,
// },
// form: {
// width: "100%",
// marginTop: 10,
// },
// input: {
// backgroundColor: "#F2F7FA",
// borderRadius: 12,
// paddingVertical: 12,
// paddingHorizontal: 16,
// fontSize: 16,
// marginBottom: 14,
// borderWidth: 1,
// borderColor: "#E2E8F0",
// },
// button: {
// backgroundColor: "#00A8B5",
// borderRadius: 12,
// paddingVertical: 14,
// alignItems: "center",
// marginTop: 8,
// },
// buttonText: {
// color: "#FFFFFF",
// fontSize: 16,
// fontWeight: "600",
// },
// link: {
// color: "#007B83",
// fontSize: 15,
// fontWeight: "500",
// },

// // logo: {
// //   width: 300,          // increased from 160 → 300
// //   height: 300,
// //   resizeMode: 'contain',
// //   //marginBottom: 28,    // a bit more breathing room below
// //   alignSelf: 'center',
// // },
// // card: {
// //   width: "85%",
// //   backgroundColor: "#FFFFFF",
// //   borderRadius: 20,
// //   padding: 24,
// //   shadowColor: "#000",
// //   shadowOpacity: 0.1,
// //   shadowRadius: 10,
// //   elevation: 5,
// //   alignItems: "center",
// //   //paddingTop: 60,      // slight extra top padding to keep balance
// //   paddingBottom: 30,
// // },
// logo: {
//   width: 300,
//   height: 300,
//   resizeMode: 'contain',
//   marginBottom: -100,   // pulls the text closer to the logo
//   alignSelf: 'center',
// },

// card: {
//   width: "85%",
//   backgroundColor: "#FFFFFF",
//   borderRadius: 20,
//   paddingHorizontal: 24,
//   paddingTop: 10,       // slightly reduced top padding
//   paddingBottom: 30,
//   shadowColor: "#000",
//   shadowOpacity: 0.1,
//   shadowRadius: 10,
//   elevation: 5,
//   alignItems: "center",
// },


// });
// export default AuthScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const AuthScreen = ({ setPage, onLogin, isSignup = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSignUp = () => {
    if (!email || !password || !fullName) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with:", user.email);
        onLogin();
      })
      .catch((error) => Alert.alert("Sign Up Error", error.message));
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
        onLogin();
      })
      .catch((error) => Alert.alert("Login Error", error.message));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Image
            source={require("../../../assets/logo_transparent.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>
            {isSignup ? "Create Account" : "Welcome Back!"}
          </Text>
          <Text style={styles.subtitle}>
            {isSignup
              ? "Join to monitor and test your water quality."
              : "Sign in to continue."}
          </Text>

          <View style={styles.form}>
            {isSignup && (
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#666"
              />
            )}
            <TextInput
              placeholder="Email Address"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#666"
            />

            <TouchableOpacity
              onPress={isSignup ? handleSignUp : handleLogin}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {isSignup ? "Sign Up" : "Login"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setPage(isSignup ? "login" : "signup")}
            style={{ marginTop: 24 }}
          >
            <Text style={styles.link}>
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FCFF",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: -100,
    alignSelf: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#007B83",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#5A5A5A",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F2F7FA",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#000000", // Dark text
  },
  button: {
    backgroundColor: "#00A8B5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#007B83",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default AuthScreen;
