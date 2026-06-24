import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '@appTypes/index';
import { colors, palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { shadows, spacing } from '@theme/spacing';

// Real screens
import HomeScreen    from '@screens/HomeScreen';
import FeedScreen    from '@screens/FeedScreen';
import ReportScreen  from '@screens/ReportScreen';
import MapScreen     from '@screens/MapScreen';
import ProfileScreen from '@screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab icon data
const TAB_ICONS: Record<keyof MainTabParamList, { active: string; inactive: string; label: string }> = {
  Home:    { active: '🏙️',  inactive: '🏙️',  label: 'Home'    },
  Report:  { active: '📍',  inactive: '📍',  label: 'Report'  },
  Feed:    { active: '📋',  inactive: '📋',  label: 'Feed'    },
  Map:     { active: '🗺️',  inactive: '🗺️',  label: 'Map'     },
  Profile: { active: '👤',  inactive: '👤',  label: 'Profile' },
};

interface TabBarIconProps {
  routeName: keyof MainTabParamList;
  focused: boolean;
  isReport?: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ routeName, focused, isReport }) => {
  const icon = TAB_ICONS[routeName];

  if (isReport) {
    // FAB-style center button
    return (
      <View style={styles.fabButton}>
        <Text style={{ fontSize: 22 }}>📍</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabItem}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
        {focused ? icon.active : icon.inactive}
      </Text>
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
};

export const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.tabActive,
      tabBarInactiveTintColor: colors.tabInactive,
      tabBarLabelStyle: [typography.labelSM, { marginTop: -2 }],
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          routeName={route.name as keyof MainTabParamList}
          focused={focused}
          isReport={route.name === 'Report'}
        />
      ),
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen
      name="Feed"
      component={FeedScreen}
      options={{ tabBarLabel: 'Feed' }}
    />
    <Tab.Screen
      name="Report"
      component={ReportScreen}
      options={{
        tabBarLabel: '',
        tabBarStyle: { display: 'none' },
      }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{ tabBarLabel: 'Map' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...shadows.md,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.tabActive,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...shadows.teal,
  },
});