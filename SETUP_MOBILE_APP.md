# Setting Up the Native Mobile App (iOS/Android)

This guide explains how to create a native mobile version of InvoiceHound using Expo and React Native.

## Prerequisites

- Node.js 16+ and npm/pnpm
- **iOS**: Mac with Xcode 13+ (for building iOS app)
- **Android**: Android Studio 2021.1+ (for building Android app)
- Expo Go app installed on your test device (optional, for quick testing)
- Apple Developer Account (optional, for iOS deployment)
- Google Play Developer Account (optional, for Android deployment)

## Quick Start

### 1. Initialize Expo Project

```bash
# Create a new Expo project
npx create-expo-app@latest InvoiceHound-Mobile
cd InvoiceHound-Mobile

# Or use Expo with TypeScript
npx create-expo-app@latest InvoiceHound-Mobile --template
```

### 2. Install Core Dependencies

```bash
npm install
npm install react-native react-native-web expo-router expo-constants
npm install @react-native-async-storage/async-storage
npm install axios react-query
npm install react-native-safe-area-context expo-status-bar
npm install react-native-gesture-handler
```

### 3. Install UI Libraries

```bash
# NativeBase (UI components)
npm install native-base react-native-svg react-native-safe-area-context

# OR React Native Paper (alternative)
npm install react-native-paper

# Icons (same as web app)
npm install react-native-feather
```

### 4. Project Structure

Create the following structure:

```
InvoiceHound-Mobile/
├── app/                          # Expo Router pages
│   ├── (auth)/
│   │   ├── _layout.tsx          # Auth layout
│   │   ├── login.tsx            # Login screen
│   │   └── signup.tsx           # Sign up screen
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Main app layout
│   │   ├── index.tsx            # Dashboard
│   │   ├── invoices.tsx         # Invoices
│   │   ├── clients.tsx          # Clients
│   │   └── settings.tsx         # Settings
│   ├── _layout.tsx              # Root layout
│   └── +html.tsx                # Web fallback
├── components/                   # Reusable components
│   ├── InvoiceCard.tsx
│   ├── ClientCard.tsx
│   └── ui/                       # Shared UI components
├── lib/                          # Utilities
│   ├── api.ts                    # API client
│   ├── storage.ts               # Local storage
│   └── errorHandler.ts          # Error handling
├── app.json                      # Expo configuration
├── package.json
└── tsconfig.json
```

### 5. Configure app.json

```json
{
  "expo": {
    "name": "InvoiceHound",
    "slug": "invoicehound",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.invoicehound.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.invoicehound.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow InvoiceHound to access your camera"
        }
      ]
    ]
  }
}
```

## File Structure Examples

### API Client (lib/api.ts)

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-app.com/api'; // or http://localhost:3000 for dev

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Dashboard Screen (app/(tabs)/index.tsx)

```typescript
import { View, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, Box, VStack, HStack, Spinner } from 'native-base';
import api from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard().then(() => setRefreshing(false));
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner accessibilityLabel="Loading dashboard" />
      </Box>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <VStack space={4} p={4}>
        <Text fontSize="2xl" bold>
          Dashboard
        </Text>

        <HStack space={2}>
          <StatCard
            title="Outstanding"
            value={`$${stats?.totalOutstanding || 0}`}
            color="green"
          />
          <StatCard
            title="Overdue"
            value={stats?.overdueCount || 0}
            color="red"
          />
        </HStack>

        <Box>
          <Text fontSize="lg" bold mb={2}>
            Recent Invoices
          </Text>
          {/* Invoice list */}
        </Box>
      </VStack>
    </ScrollView>
  );
}

function StatCard({ title, value, color }: any) {
  return (
    <Box
      flex={1}
      bg={`${color}.100`}
      p={4}
      rounded="lg"
      borderColor={`${color}.300`}
      borderWidth={1}
    >
      <Text fontSize="xs" color={`${color}.700`} mb={1}>
        {title}
      </Text>
      <Text fontSize="xl" bold color={`${color}.900`}>
        {value}
      </Text>
    </Box>
  );
}
```

### Storage Helper (lib/storage.ts)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  async setAuthToken(token: string) {
    await AsyncStorage.setItem('authToken', token);
  },

  async getAuthToken() {
    return await AsyncStorage.getItem('authToken');
  },

  async removeAuthToken() {
    await AsyncStorage.removeItem('authToken');
  },

  async setUser(user: any) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  async getUser() {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async cacheInvoices(invoices: any[]) {
    await AsyncStorage.setItem('invoices_cache', JSON.stringify(invoices));
  },

  async getCachedInvoices() {
    const invoices = await AsyncStorage.getItem('invoices_cache');
    return invoices ? JSON.parse(invoices) : [];
  },

  async clearCache() {
    await AsyncStorage.removeItem('invoices_cache');
    await AsyncStorage.removeItem('clients_cache');
  },
};
```

## Development Workflow

### Run on iOS Simulator

```bash
# Install Xcode command-line tools
xcode-select --install

# Start Expo server
npm start

# Press 'i' to open in iOS Simulator
```

### Run on Android Emulator

```bash
# Open Android Studio and start an emulator

# Start Expo server
npm start

# Press 'a' to open in Android Emulator
```

### Run on Physical Device

```bash
# Start Expo server
npm start

# Download Expo Go app
# Scan QR code with your device camera
# Open the link in Expo Go app
```

## Building for Production

### iOS Distribution

```bash
# Generate certificates and build
eas build --platform ios

# Monitor build progress
eas build:list

# Submit to App Store
eas submit --platform ios
```

### Android Distribution

```bash
# Build APK for testing
eas build --platform android --local

# Build AAB for Play Store
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

## Key Features for Mobile App

### 1. Offline Support

```typescript
// sync.ts
import { useNetInfo } from '@react-native-community/netinfo';

export function useOfflineMode() {
  const { isConnected } = useNetInfo();

  const syncWhenOnline = async () => {
    if (isConnected) {
      // Sync pending changes
      await api.post('/sync', { changes: pendingChanges });
    }
  };

  return { isOffline: !isConnected, syncWhenOnline };
}
```

### 2. Camera for Receipt Scanning

```bash
npm install expo-camera expo-image-picker
```

```typescript
import * as ImagePicker from 'expo-image-picker';

export async function pickAndUploadReceipt() {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (!result.canceled) {
    // Upload image
    const formData = new FormData();
    formData.append('receipt', {
      uri: result.assets[0].uri,
      type: 'image/jpeg',
      name: 'receipt.jpg',
    } as any);

    await api.post('/receipts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}
```

### 3. Push Notifications

```bash
npm install expo-notifications
```

```typescript
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await api.post('/push-tokens', { token });

  Notifications.addNotificationResponseListener((response) => {
    const { invoiceId } = response.notification.request.content.data;
    // Navigate to invoice
  });
}
```

### 4. Biometric Authentication

```bash
npm install expo-local-authentication
```

```typescript
import * as LocalAuthentication from 'expo-local-authentication';

export async function setupBiometric() {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isAvailableAsync();

  if (compatible && enrolled) {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric auth failed:', error);
    }
  }

  return false;
}
```

## Common Challenges & Solutions

### Challenge: API Connection

**Problem**: Mobile app can't connect to local development server

**Solution**:
```typescript
const API_BASE_URL = Platform.OS === 'ios'
  ? 'http://localhost:3000/api'  // iOS Simulator
  : 'http://10.0.2.2:3000/api';  // Android Emulator
```

### Challenge: Performance

**Problem**: App is slow with large invoice lists

**Solution**:
```typescript
// Use FlatList with virtualization
import { FlatList } from 'react-native';

<FlatList
  data={invoices}
  renderItem={({ item }) => <InvoiceCard invoice={item} />}
  keyExtractor={(item) => item.id}
  maxToRenderPerBatch={10}
  initialNumToRender={10}
  removeClippedSubviews={true}
/>
```

### Challenge: Local Storage Limits

**Problem**: SQLite database for offline support

**Solution**:
```bash
npm install expo-sqlite
```

```typescript
import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('invoicehound.db');

await db.execAsync(`
  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    clientId TEXT,
    amount REAL,
    status TEXT,
    dueDate TEXT
  )
`);
```

## Testing

### Unit Tests
```bash
npm install jest @testing-library/react-native
```

### E2E Tests
```bash
npm install detox detox-cli
```

## Deployment Checklist

- [ ] Update app version in app.json
- [ ] Create app icons (192x192, 512x512)
- [ ] Create splash screen (1242x2436 for iOS)
- [ ] Set up environment variables for API endpoints
- [ ] Test on both iOS and Android
- [ ] Get app reviewed (Apple, Google Play)
- [ ] Set up app store listings
- [ ] Configure analytics and crash reporting
- [ ] Set up push notifications backend
- [ ] Configure error tracking (Sentry)

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://expo.github.io/router/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Paper Components](https://callstack.github.io/react-native-paper/)

## Next Steps

1. Start with the Expo project setup
2. Share API routes with the web app
3. Implement authentication flows
4. Build core screens (Dashboard, Invoices, Clients)
5. Add offline support
6. Implement camera/file upload
7. Set up push notifications
8. Test on real devices
9. Submit to app stores

---

**Note**: This native app will share the same backend API as the web app, making maintenance easier and ensuring feature parity across platforms.
