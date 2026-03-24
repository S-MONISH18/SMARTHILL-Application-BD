import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';

export default function SellProductsScreen() {
  const [form, setForm] = useState({
    productName: '',
    category: '',
    quantity: '',
    price: '',
    location: '',
    description: '',
  });

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpload = () => {
    const required = ['productName', 'category', 'quantity', 'price', 'location'];
    const missing = required.some(key => !form[key]);

    if (missing) {
      Alert.alert('Missing Information', 'Please fill all required fields.');
      return;
    }

    Alert.alert('Success', 'Product uploaded successfully.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, styles.title]}>Sell Products</Text>
        <Text style={[typography.body, styles.subtitle]}>
          Upload your farm products for customers to buy.
        </Text>

        <AppCard>
          <InputField
            label="Product Name *"
            placeholder="Enter product name"
            value={form.productName}
            onChangeText={value => updateField('productName', value)}
          />
          <InputField
            label="Category *"
            placeholder="Vegetable / Fruit / Grain"
            value={form.category}
            onChangeText={value => updateField('category', value)}
          />
          <InputField
            label="Quantity *"
            placeholder="e.g. 100 kg"
            value={form.quantity}
            onChangeText={value => updateField('quantity', value)}
          />
          <InputField
            label="Price *"
            placeholder="e.g. 25/kg"
            value={form.price}
            onChangeText={value => updateField('price', value)}
          />
          <InputField
            label="Location *"
            placeholder="Enter location"
            value={form.location}
            onChangeText={value => updateField('location', value)}
          />
          <InputField
            label="Description"
            placeholder="Add a short description"
            value={form.description}
            onChangeText={value => updateField('description', value)}
          />

          <View style={styles.buttonWrap}>
            <PrimaryButton title="Upload Product" onPress={handleUpload} />
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120 },
  title: { color: colors.primary, marginBottom: spacing.sm },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.lg },
  buttonWrap: { marginTop: spacing.md },
});