# AppHILL React Native App Structure Guide

## 1. Screen Organization & Structure

### Directory Hierarchy
```
src/screens/
├── auth/                    # Authentication flows
│   ├── LoginScreen.js
│   └── SignupScreen.js
├── common/                  # Shared across all roles
│   └── NotificationsScreen.js
├── customer/               # Customer-specific screens
│   ├── CustomerDashboardScreen.js
│   ├── BuyProductsScreen.js
│   ├── RentTractorScreen.js
│   ├── CustomerProfileScreen.js
│   └── MyCustomerBookingsScreen.js
├── farmer/                 # Farmer-specific screens
│   ├── FarmerDashboardScreen.js
│   ├── FarmDataScreen.js
│   ├── AvailableTractorsScreen.js
│   ├── SellProductsScreen.js
│   ├── FarmerProfileScreen.js
│   ├── FarmerOrderRequestsScreen.js
│   └── MyBookingsScreen.js
└── tractorOwner/          # Tractor Owner-specific screens
    ├── TractorOwnerDashboardScreen.js
    ├── RegisterTractorScreen.js
    ├── MyTractorsScreen.js
    ├── RentalRequestsScreen.js
    └── TractorOwnerProfileScreen.js
```

### Standard Screen Pattern
Each screen follows this structure:
```javascript
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';

export default function MyScreen() {
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Load data
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Screen content */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }
});
```

---

## 2. Navigation Structure & Adding New Routes

### Three-Role Navigation Pattern

#### Root Navigator (`RootNavigator.js`)
- Routes users to appropriate navigator based on role
- Checks `currentUser.role`: `'farmer'`, `'tractor_owner'`, or `'customer'`

```javascript
if (currentUser.role === 'farmer') return <FarmerTabNavigator />;
if (currentUser.role === 'tractor_owner') return <TractorOwnerTabNavigator />;
if (currentUser.role === 'customer') return <CustomerStackNavigator />;
```

#### Navigation Types Used

**Tab Navigator** (Farmer, Tractor Owner)
- Bottom tab navigation with emoji icons
- Quick access to main sections
- Uses `createBottomTabNavigator()`

**Stack Navigator** (Customer - special case)
- Main tabs wrapped in a Stack
- Allows modal-like screen transitions
- Example: Booking flows, tractor registration

### How to Add a New Screen

#### Step 1: Create Screen File
Create in appropriate role folder: `src/screens/{role}/NewScreen.js`

```javascript
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function MyNewScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2]}>Screen Title</Text>
        {/* Content */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }
});
```

#### Step 2: Add Import to Navigator
Edit the appropriate navigator file:

**For Tab Screen** (FarmerTabNavigator.js):
```javascript
import MyNewScreen from '../screens/farmer/MyNewScreen';

// In Tab.Navigator:
<Tab.Screen
  name="MyNewScreen"
  component={MyNewScreen}
  options={{
    tabBarLabel: 'Label',
    tabBarIcon: ({ color }) => <TabIcon symbol="📱" color={color} />
  }}
/>
```

**For Stack Screen** (CustomerStackNavigator.js):
```javascript
import MyNewScreen from '../screens/customer/MyNewScreen';

// In Stack.Navigator:
<Stack.Screen
  name="MyNewScreen"
  component={MyNewScreen}
  options={{ title: 'Screen Title' }}
/>
```

#### Step 3: Navigate to Screen
From any screen:
```javascript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('MyNewScreen');
// Or with nested stacks:
navigation.navigate('Tractors', { screen: 'RegisterTractor' });
```

---

## 3. Key Components & Styling Patterns

### Reusable Components Library

#### `AppCard` - Container/Card Pattern
```javascript
import AppCard from '../../components/AppCard';

<AppCard style={{ marginBottom: spacing.md }}>
  <Text>Card content</Text>
</AppCard>
```
- Background white, rounded corners (20px), light border, subtle shadow
- Used for: forms, data display, sections

#### `PrimaryButton` - CTA Button
```javascript
import PrimaryButton from '../../components/PrimaryButton';

<PrimaryButton 
  title="Action" 
  onPress={() => {}}
  disabled={false}
/>
```
- Green background, white text, 50px height
- Properties: `title`, `onPress`, `disabled`, custom `style`, `textStyle`

#### `InputField` - Form Input
```javascript
import InputField from '../../components/InputField';

<InputField
  label="Field Name"
  placeholder="Enter value"
  value={value}
  onChangeText={setValue}
  icon={<Text style={styles.icon}>🌾</Text>}
  multiline={false}
  keyboardType="default"
/>
```
- Supports: icons, labels, multiline, custom keyboard types
- Consistent 52px height for single-line inputs

#### `PageHeader` - Section Headers
```javascript
import PageHeader from '../../components/PageHeader';

<PageHeader 
  title="My Section"
  subtitle="Optional subtitle"
  rightElement={<SomeIcon />}
/>
```

#### `Badge` - Status Indicators
```javascript
import Badge from '../../components/Badge';

<Badge text="Available" variant="success" size="medium" />
<Badge text="In Progress" variant="default" size="small" />
```
- Variants: `'success'` (green), `'default'` (gray)
- Sizes: `'medium'`, `'small'`

#### `StatTile` - Data Display Cards
```javascript
import StatTile from '../../components/StatTile';

<StatTile
  label="Tractors"
  value={5}
  icon={<Text>🚜</Text>}
  subtitle="Active"
/>
```

#### `FarmSummary` - Overview Grid
```javascript
import FarmSummary from '../../components/FarmSummary';

<FarmSummary 
  nodeCount={2} 
  motorCount={3} 
  valveCount={4} 
  areaSize="2.5"
/>
```
- Displays 4 stat tiles in responsive grid

### Theme/Styling System

#### Colors (`theme/colors.js`)
```javascript
const colors = {
  primary: '#0B8F4D',           // Main green
  primaryLight: '#D1F0E0',      // Light green background
  primaryDark: '#0A6E3D',       // Dark green
  background: '#F7F9F8',        // Pale background
  surface: '#FFFFFF',           // White cards/inputs
  surfaceSecondary: '#F1F5F3',  // Light gray
  text: '#1F2937',              // Dark gray text
  textSecondary: '#6B7280',     // Medium gray
  textMuted: '#9CA3AF',         // Light gray
  borderLight: '#E5E7EB',       // Light borders
  success: '#16A34A',           // Green checkmark
  danger: '#DC2626',            // Red errors
  warning: '#F59E0B',           // Orange alerts
};
```

#### Typography (`theme/typography.js`)
```javascript
const typography = {
  h1: { fontSize: 30, fontWeight: '700' },  // 30px bold
  h2: { fontSize: 26, fontWeight: '700' },  // 26px bold
  h3: { fontSize: 22, fontWeight: '700' },  // 22px bold
  h4: { fontSize: 18, fontWeight: '700' },  // 18px bold
  body: { fontSize: 16, fontWeight: '400' }, // 16px regular
  bodySmall: { fontSize: 14, fontWeight: '400' }, // 14px regular
  label: { fontSize: 15, fontWeight: '600' }, // 15px semibold
  caption: { fontSize: 13, fontWeight: '400' }, // 13px regular
  buttonSmall: { fontSize: 14, fontWeight: '700' }, // 14px bold
};
```

#### Spacing (`theme/spacing.js`)
```javascript
const spacing = {
  xs: 8,       // Smallest padding
  sm: 12,      // Small
  md: 16,      // Medium (default)
  lg: 20,      // Large (main padding)
  xl: 24,      // Extra large
  xxl: 32,     // 2x large
  xxxl: 48,    // 3x large
};
```

### Usage Pattern
```javascript
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// In styles:
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.md,
  },
});
```

---

## 4. Existing UI Patterns - No Chat Implementation

### Current Pattern: Notifications Screen
- **Location**: `src/screens/common/NotificationsScreen.js`
- **Data Structure**:
  - Uses `FlatList` for notification items
  - Each notification has: `message`, `createdAt`
  - Auto-refreshes every 5 seconds
- **API Integration**: `getNotifications(phone)` from apiService
- **UI**: Simple `AppCard` items with message + timestamp

### Important: No Message/Chat UI Exists
- **No message bubbles** (user vs other)
- **No message threads** 
- **No input area** for sending messages
- Notifications are **one-way display only**

If you need to add **FAQ or Help screens**, see Section 5 below.

---

## 5. FAQ/Help Screen Organization

### Architecture Decision: Role-Specific vs. Shared

#### Option A: **Shared FAQ** (Recommended for consistency)
- Single `FAQScreen` in `src/screens/common/`
- All roles access same content
- Add to each role's navigator
- **Pros**: Easier to maintain, consistent information
- **Cons**: Some content might not be role-specific

```
src/screens/common/
├── NotificationsScreen.js
└── FAQScreen.js  ← New shared screen

// Add to each navigator:
<Tab.Screen
  name="FAQ"
  component={FAQScreen}
  options={{
    tabBarLabel: 'Help',
    tabBarIcon: ({ color }) => <TabIcon symbol="❓" color={color} />
  }}
/>
```

#### Option B: **Role-Specific FAQs** 
- Create in each role folder:
  - `src/screens/farmer/FarmerFAQScreen.js`
  - `src/screens/customer/CustomerFAQScreen.js`
  - `src/screens/tractorOwner/TractorOwnerFAQScreen.js`
- Different content per role
- **Pros**: Role-specific guidance
- **Cons**: Maintenance burden, code duplication

### Recommended FAQ Component Pattern

```javascript
// src/screens/common/FAQScreen.js
import React, { useState } from 'react';
import { 
  SafeAreaView, View, Text, ScrollView, 
  TouchableOpacity, StyleSheet 
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppCard from '../../components/AppCard';

const FAQ_DATA = [
  {
    id: 1,
    question: 'How do I reset my password?',
    answer: 'Go to Profile > Security > Change Password.',
  },
  {
    id: 2,
    question: 'Is my data secure?',
    answer: 'Yes, we use encrypted connections and secure servers.',
  },
  // Add more FAQs...
];

export default function FAQScreen() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h2, styles.title]}>Frequently Asked Questions</Text>

        {FAQ_DATA.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            onPress={() => 
              setExpandedId(expandedId === faq.id ? null : faq.id)
            }
          >
            <AppCard style={styles.faqCard}>
              <View style={styles.questionRow}>
                <Text style={[typography.label, { flex: 1 }]}>
                  {faq.question}
                </Text>
                <Text style={styles.icon}>
                  {expandedId === faq.id ? '▼' : '▶'}
                </Text>
              </View>

              {expandedId === faq.id && (
                <Text style={[typography.body, styles.answer]}>
                  {faq.answer}
                </Text>
              )}
            </AppCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { color: colors.primary, marginBottom: spacing.lg },
  faqCard: { marginBottom: spacing.md },
  questionRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginLeft: spacing.sm, color: colors.primary },
  answer: { marginTop: spacing.md, color: colors.textSecondary },
});
```

---

## 6. Key Implementation Details

### Authentication Context
All screens access current user via:
```javascript
import { useAuth } from '../../context/AuthContext';
const { currentUser, logout } = useAuth();
// currentUser.role, currentUser.phone, currentUser.name, etc.
```

### API Service Pattern
```javascript
import { getNotifications, getTractors, buyProduct } from '../../services/apiService';

const result = await getNotifications(userPhone);
if (result.success) {
  setData(result.data || []);
}
```

### Network Detection
Some screens detect connection status:
```javascript
import NetInfo from '@react-native-community/netinfo';

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      // Fetch fresh data
    } else {
      // Use cached/offline data
    }
  });
  return unsubscribe;
}, []);
```

### Safe Area & ScrollView
Standard pattern for scrollable screens:
```javascript
<SafeAreaView style={styles.container} edges={['top']}>
  <ScrollView contentContainerStyle={styles.content}>
    {/* Content */}
  </ScrollView>
</SafeAreaView>
```

---

## 7. Quick Reference: Adding a New FAQ Screen

1. **Create file**: `src/screens/common/FAQScreen.js`
2. **Follow pattern** from Section 5
3. **Add to each navigator**:
   - `FarmerTabNavigator.js`
   - `TractorOwnerTabNavigator.js`
   - `CustomerTabNavigator.js`
4. **Import & add Tab.Screen**:
   ```javascript
   import FAQScreen from '../screens/common/FAQScreen';
   
   <Tab.Screen
     name="FAQ"
     component={FAQScreen}
     options={{
       tabBarLabel: 'Help',
       tabBarIcon: ({ color }) => <TabIcon symbol="❓" color={color} />
     }}
   />
   ```

---

## Summary

| Aspect | Details |
|--------|---------|
| **Screen Organization** | Role-based folders (farmer, customer, tractorOwner, common, auth) |
| **Navigation** | Role-based routing from RootNavigator → Tab/Stack navigators |
| **Components** | AppCard, PrimaryButton, InputField, Badge, StatTile, FarmSummary, PageHeader |
| **Styling** | Centralized theme (colors, typography, spacing) |
| **UI Patterns** | No chat/messaging UI; Notifications are one-way display |
| **FAQ Recommendation** | Shared `FAQScreen` in `src/screens/common/` for all roles |
| **Data Fetching** | Auth context + API service with success/data pattern |

