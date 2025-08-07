import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { ProjectsNavigator } from './ProjectsNavigator';
import ReportsScreen from '../screens/main/ReportsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

export type MainTabParamList = {
  ProjectsTab: undefined;
  ReportsTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: '#64B5F6',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="ProjectsTab"
        component={ProjectsNavigator}
        options={{
          title: t('projects'),
          tabBarIcon: ({ color, size, focused }) => (
            <IconButton
              icon="folder-outline"
              iconColor={color}
              size={focused ? 28 : 24}
              style={{ margin: 0 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsScreen}
        options={{
          title: t('reports'),
          tabBarIcon: ({ color, size, focused }) => (
            <IconButton
              icon="chart-box-outline"
              iconColor={color}
              size={focused ? 28 : 24}
              style={{ margin: 0 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: t('settings'),
          tabBarIcon: ({ color, size, focused }) => (
            <IconButton
              icon="cog-outline"
              iconColor={color}
              size={focused ? 28 : 24}
              style={{ margin: 0 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
