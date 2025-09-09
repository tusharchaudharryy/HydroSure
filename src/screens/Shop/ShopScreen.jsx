import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/globalStyles';

const ShopScreen = () => (
    <View>
        <Text style={styles.pageTitle}>Shop HydroSure Products</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {['16-in-1 Test Kit', 'Bacteria Test Kit', 'Refill Strips', 'Water Filter'].map(item => (
                <View key={item} style={styles.shopItem}>
                    <View style={styles.shopImage}>
                        <Text style={{ fontSize: 40, color: '#9CA3AF' }}>🧪</Text>
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

export default ShopScreen;

