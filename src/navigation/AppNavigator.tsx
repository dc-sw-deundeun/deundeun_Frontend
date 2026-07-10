import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Animated, Platform, Dimensions } from 'react-native';
import Text from '@/components/Text';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';
import { useAppStore } from '@/store/useAppStore';
import { COLORS } from '@/constants/theme';
import Svg, { Path } from 'react-native-svg';
import GlobalModal from '@/components/GlobalModal';

// Import Screens
import SplashScreen from '@/screens/auth/SplashScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import TermsScreen from '@/screens/auth/TermsScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import DeviceSyncScreen from '@/screens/auth/DeviceSyncScreen';
import CheckupOcrScreen from '@/screens/auth/CheckupOcrScreen';
import CheckupResultScreen from '@/screens/auth/CheckupResultScreen';
import WelcomeScreen from '@/screens/auth/WelcomeScreen';

import HomeScreen from '@/screens/HomeScreen';
import PracticeScreen from '@/screens/practice/PracticeScreen';
import HistoryScreen from '@/screens/history/HistoryScreen';
import GrowthScreen from '@/screens/growth/GrowthScreen';
import MyPageScreen from '@/screens/mypage/MyPageScreen';

import DetailsScreen from '@/screens/DetailsScreen';
import HealthReportScreen from '@/screens/history/HealthReportScreen';
import EditResultsScreen from '@/screens/history/EditResultsScreen';
import EditRecordScreen from '@/screens/history/EditRecordScreen';
import SearchBrowseScreen from '@/screens/search/SearchBrowseScreen';
import ChangePasswordScreen from '@/screens/mypage/ChangePasswordScreen';
import EditProfileScreen from '@/screens/mypage/EditProfileScreen';
import ConnectedAppsScreen from '@/screens/mypage/ConnectedAppsScreen';
import NotificationsScreen from '@/screens/mypage/NotificationsScreen';
import MetricDetailScreen from '@/screens/history/MetricDetailScreen';

// Import Lucide Icons
import { Home, FileText, PawPrint, User, ListTodo } from 'lucide-react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 1. Custom SVG Tab Bar Background (Bezier Curve Dome Shape for seamless borders)
const CustomTabBarBg = ({ width }: { width: number }) => {
  const center = width / 2;
  const height = 76;

  // Symmetrical Cubic Bezier Curve:
  // Starts flat, transitions smoothly (concave) upwards, rounds over the peak (convex), and transitions back flat.
  const d = `
    M 0,1.5
    L ${center - 45},1.5
    C ${center - 32},1.5 ${center - 34},-21 ${center},-21
    C ${center + 34},-21 ${center + 32},1.5 ${center + 45},1.5
    L ${width},1.5
    L ${width},${height}
    L 0,${height}
    Z
  `;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={d}
          fill="rgba(245, 244, 238, 0.85)" // Translucent cream off-white background
          stroke="rgba(232, 231, 223, 0.9)" // Translucent border outline
          strokeWidth={1.5}
        />
      </Svg>
    </View>
  );
};

// 2. Custom Animated Tab Item for the 4 Outer Tabs (Includes active indicator line & solid icon toggle)
const CustomTabItem = ({ isFocused, renderIcon, label, onPress }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const scaleAnim = useRef(new Animated.Value(isFocused ? 1 : 0.8)).current;
  const lineOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const lineScale = useRef(new Animated.Value(isFocused ? 1 : 0.2)).current;

  // React to focus and hover state changes
  useEffect(() => {
    const isActive = isFocused || isHovered;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1.08 : 1.0,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(lineOpacity, {
        toValue: isFocused ? 1 : (isHovered ? 0.35 : 0),
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(lineScale, {
        toValue: isFocused ? 1 : (isHovered ? 0.6 : 0.2),
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused, isHovered]);

  const activeColor = '#132E16'; // Deep forest green
  const inactiveColor = '#8C897B'; // Muted inactive color

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={styles.tabItem}
    >
      {/* Top Active Indicator Line (renders directly on top of the tab border line) */}
      <Animated.View
        style={[
          styles.topIndicatorLine,
          {
            backgroundColor: activeColor,
            opacity: lineOpacity,
            transform: [{ scaleX: lineScale }],
          },
        ]}
      />

      <View style={styles.iconContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {renderIcon(isFocused || isHovered ? activeColor : inactiveColor, isFocused)}
        </Animated.View>
      </View>

      {/* Text Label */}
      <Text
        style={[
          styles.tabLabel,
          {
            color: isFocused || isHovered ? activeColor : inactiveColor,
            fontWeight: isFocused || isHovered ? '800' : '600',
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

// 3. Custom Floating Tab Bar Button for the Center (Home) Tab (Includes active/hover styling)
const CustomFloatingButton = ({ children, label, isFocused, onPress }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const pressScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(pressScale, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: isHovered ? 1.05 : 1.0,
      tension: 50,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    Animated.spring(pressScale, {
      toValue: isHovered ? 1.05 : 1.0,
      tension: 40,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [isHovered]);

  const buttonBg = isFocused ? '#132E16' : (isHovered ? '#1F341E' : '#354B33');
  const labelColor = isFocused || isHovered ? '#132E16' : '#3A4B39';

  return (
    <View style={styles.floatingTabContainer}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={styles.floatingButtonWrapper}
      >
        <Animated.View
          style={[
            styles.floatingButton,
            {
              transform: [{ scale: pressScale }],
              backgroundColor: buttonBg,
            },
          ]}
        >
          {children}
        </Animated.View>
      </Pressable>

      {/* Home text label aligning with other tab labels */}
      <Text style={[styles.tabLabel, { color: labelColor, fontWeight: '800', marginTop: 3, zIndex: 5 }]}>
        {label}
      </Text>
    </View>
  );
};

// 4. Custom Tab Bar Wrapper Component incorporating Svg Background & Responsive width
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [width, setWidth] = useState(Dimensions.get('window').width);

  return (
    <View
      style={styles.tabBarWrapper}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {/* Render Svg Background dome */}
      <CustomTabBarBg width={width} />

      {/* Render Tab Buttons in a Flex Row on top of background */}
      <View style={styles.tabButtonsContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          // Center tab is Home (Floating Button)
          if (route.name === 'Home') {
            return (
              <CustomFloatingButton
                key={route.key}
                label="홈"
                isFocused={isFocused}
                onPress={onPress}
              >
                {/* Home icon turns filled white when selected */}
                <Home color="#ffffff" size={22} fill={isFocused ? '#ffffff' : 'none'} />
              </CustomFloatingButton>
            );
          }

          // Outer tabs are CustomTabItems
          const getLabel = () => {
            if (route.name === 'Practice') return '실천';
            if (route.name === 'History') return '기록';
            if (route.name === 'Growth') return '성장';
            return '마이';
          };

          // Fills the icon if it is currently selected (focused)
          const renderIcon = (color: string, filled: boolean) => {
            const size = 20;
            const fill = filled ? color : 'none';
            if (route.name === 'Practice') return <ListTodo color={color} size={size} fill={fill} />;
            if (route.name === 'History') return <FileText color={color} size={size} fill={fill} />;
            if (route.name === 'Growth') return <PawPrint color={color} size={size} fill={fill} />;
            return <User color={color} size={size} fill={fill} />;
          };

          return (
            <CustomTabItem
              key={route.key}
              isFocused={isFocused}
              renderIcon={renderIcon}
              label={getLabel()}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Practice" component={PracticeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Growth" component={GrowthScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
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
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="DeviceSync" component={DeviceSyncScreen} />
        <Stack.Screen name="CheckupOcr" component={CheckupOcrScreen} />
        <Stack.Screen name="CheckupResult" component={CheckupResultScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Authenticated Flow Tab Navigation */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />

        {/* Details & Subscreens */}
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="HealthReport" component={HealthReportScreen} />
        <Stack.Screen name="EditResults" component={EditResultsScreen} />
        <Stack.Screen name="EditRecord" component={EditRecordScreen} />
        <Stack.Screen name="MetricDetail" component={MetricDetailScreen} />
        <Stack.Screen name="SearchBrowse" component={SearchBrowseScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ConnectedApps" component={ConnectedAppsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
      <GlobalModal />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    height: 76,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      },
    }),
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    height: 76,
    paddingBottom: Platform.OS === 'ios' ? 16 : 8,
    paddingTop: 4,
    zIndex: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 5,
    position: 'relative',
  },
  topIndicatorLine: {
    position: 'absolute',
    top: 1, // Placed exactly on top of the tab bar border line
    width: 24,
    height: 3,
    borderRadius: 1.5,
  },
  iconContainer: {
    width: 60,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 6,
  },
  capsuleBg: {
    position: 'absolute',
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent', // Capsule background removed
  },
  iconWrapper: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 5,
    letterSpacing: -0.2,
  },
  floatingTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingBottom: 4,
    position: 'relative',
    zIndex: 15,
  },
  floatingButtonWrapper: {
    zIndex: 20,
    marginBottom: 2,
    top: -20, // Floating position
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
