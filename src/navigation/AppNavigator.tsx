import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';
import { useAppStore } from '@/store/useAppStore';
import { COLORS } from '@/constants/theme';

// Import Screens
import SplashScreen from '@/screens/auth/SplashScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import TermsScreen from '@/screens/auth/TermsScreen';
import DeviceSyncScreen from '@/screens/auth/DeviceSyncScreen';
import WelcomeScreen from '@/screens/auth/WelcomeScreen';

import HomeScreen from '@/screens/HomeScreen';
import PracticeScreen from '@/screens/practice/PracticeScreen';
import HistoryScreen from '@/screens/history/HistoryScreen';
import GrowthScreen from '@/screens/growth/GrowthScreen';
import MyPageScreen from '@/screens/mypage/MyPageScreen';

import DetailsScreen from '@/screens/DetailsScreen';
import HealthReportScreen from '@/screens/history/HealthReportScreen';
import EditResultsScreen from '@/screens/history/EditResultsScreen';
import SearchBrowseScreen from '@/screens/search/SearchBrowseScreen';
import ChangePasswordScreen from '@/screens/mypage/ChangePasswordScreen';
import ConnectedAppsScreen from '@/screens/mypage/ConnectedAppsScreen';
import NotificationsScreen from '@/screens/mypage/NotificationsScreen';

// Import Lucide Icons
import { Home, ListTodo, Clipboard, Award, User } from 'lucide-react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { isDarkMode } = useAppStore();
  const themeColors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: themeColors.textMuted,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
          borderTopWidth: 1.5,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{
          tabBarLabel: '실천',
          tabBarIcon: ({ color, size }) => <ListTodo color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: '기록',
          tabBarIcon: ({ color, size }) => <Clipboard color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Growth"
        component={GrowthScreen}
        options={{
          tabBarLabel: '성장',
          tabBarIcon: ({ color, size }) => <Award color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isDarkMode } = useAppStore();
  const themeColors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: themeColors.background,
          },
        }}
      >
        {/* Authentication Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="DeviceSync" component={DeviceSyncScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Authenticated Flow Tab Navigation */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />

        {/* Details & Subscreens */}
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="HealthReport" component={HealthReportScreen} />
        <Stack.Screen name="EditResults" component={EditResultsScreen} />
        <Stack.Screen name="SearchBrowse" component={SearchBrowseScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="ConnectedApps" component={ConnectedAppsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
