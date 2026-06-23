import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppStore } from '@store/index';
import { RootStackParamList, MainTabParamList } from '@appTypes/index';
import LoginScreen from '@screens/LoginScreen';
import OnboardingScreen from '@screens/OnboardingScreen';
import HomeScreen from '@screens/HomeScreen';
import FeedScreen from '@screens/FeedScreen';
import ReportScreen from '@screens/ReportScreen';
import MapScreen from '@screens/MapScreen';
import ProfileScreen from '@screens/ProfileScreen';
import { colors } from '@theme/colors';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom SVG Icons to avoid reliance on native fonts setup
const TabIcon = ({ name, color, size = 24 }: { name: string; color: string; size?: number }) => {
  switch (name) {
    case 'Home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      );
    case 'Feed':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 20H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M3 20V18C3 15.7909 4.79086 14 7 14H9C11.2091 14 13 15.7909 13 18V20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <Circle cx="8" cy="7" r="4" stroke={color} strokeWidth="2"/>
          <Path d="M16 8H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <Path d="M16 12H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </Svg>
      );
    case 'Report':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
          <Path d="M12 8V16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <Path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </Svg>
      );
    case 'Map':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
        </Svg>
      );
    case 'Profile':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2"/>
        </Svg>
      );
    default:
      return null;
  }
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <TabIcon name={route.name} color={color} size={size} />
        ),
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.bgDark,
          elevation: 4,
          shadowOpacity: 0.15,
        },
        headerTintColor: colors.textOnDark,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'CivicSensor' }} />
      <Tab.Screen name="Feed" component={FeedScreen} options={{ title: 'Civic Feed' }} />
      <Tab.Screen name="Report" component={ReportScreen} options={{ title: 'Report Issue' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Local Map' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Civic Passport' }} />
    </Tab.Navigator>
  );
};

export const Navigation = () => {
  const { isAuthenticated, isOnboarded } = useAppStore();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <RootStack.Screen name="Auth" component={LoginScreen} />
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        </>
      ) : !isOnboarded ? (
        <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      )}
    </RootStack.Navigator>
  );
};
