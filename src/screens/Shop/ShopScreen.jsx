// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { styles } from '../../styles/globalStyles';

// const ShopScreen = () => (
//     <View>
//         <Text style={styles.pageTitle}>Shop HydroSure Products</Text>
//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
//             {['16-in-1 Test Kit', 'Bacteria Test Kit', 'Refill Strips', 'Water Filter'].map(item => (
//                 <View key={item} style={styles.shopItem}>
//                     <View style={styles.shopImage}>
//                         <Text style={{ fontSize: 40, color: '#9CA3AF' }}>🧪</Text>
//                     </View>
//                     <Text style={styles.shopTitle}>{item}</Text>
//                     <Text style={styles.shopPrice}>$19.99</Text>
//                     <TouchableOpacity style={styles.addToCartButton}>
//                         <Text style={styles.addToCartText}>Add to Cart</Text>
//                     </TouchableOpacity>
//                 </View>
//             ))}
//         </View>
//     </View>
// );

// export default ShopScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";

const themeColor = "#007B83";
const themeLight = "#E6F7FB";

const products = [
  {
    id: 1,
    name: "16-in-1 Test Kit",
    price: 29.99,
    image: "https://picsum.photos/seed/testkit1/300/300",
  },
  {
    id: 2,
    name: "Bacteria Test Kit",
    price: 24.99,
    image: "https://picsum.photos/seed/bacteria/300/300",
  },
  {
    id: 3,
    name: "Refill Strips (100ct)",
    price: 19.99,
    image: "https://picsum.photos/seed/strips/300/300",
  },
  {
    id: 4,
    name: "Countertop Water Filter",
    price: 79.99,
    image: "https://picsum.photos/seed/filter/300/300",
  },
];

const ShopScreen = () => {
  const [cart, setCart] = useState([]);

  const handleToggleCart = (productId) => {
    const isInCart = cart.includes(productId);

    if (isInCart) {
      setCart((prevCart) => prevCart.filter((id) => id !== productId));
    } else {
      setCart((prevCart) => [...prevCart, productId]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Shop Products</Text>
        <View style={styles.cartIndicator}>
          <Text style={styles.cartText}>Cart ({cart.length})</Text>
        </View>
      </View>

      <View style={styles.productGrid}>
        {products.map((item) => {
          const isInCart = cart.includes(item.id);

          return (
            <View key={item.id} style={styles.shopItem}>
              <Image source={{ uri: item.image }} style={styles.shopImage} />
              <View style={styles.productInfo}>
                <Text style={styles.shopTitle}>{item.name}</Text>
                <Text style={styles.shopPrice}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={[
                    styles.addToCartButton,
                    isInCart && styles.addToCartButtonAdded,
                  ]}
                  // --- UPDATED ONPRESS ---
                  onPress={() => handleToggleCart(item.id)}
                  // --- REMOVED 'disabled' PROP ---
                >
                  <Text style={styles.addToCartText}>
                    {isInCart ? "Remove" : "Add to Cart"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FCFF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: themeColor,
  },
  cartIndicator: {
    backgroundColor: themeLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cartText: {
    color: themeColor,
    fontWeight: "600",
    fontSize: 15,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shopItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 16,
  },
  shopImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 12,
  },
  shopTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  shopPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: themeColor,
    marginBottom: 12,
  },
  addToCartButton: {
    backgroundColor: themeColor,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  addToCartButtonAdded: {
    // Changed to a "remove" style
    backgroundColor: "#777", // A neutral grey for "Remove"
  },
  addToCartText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ShopScreen;