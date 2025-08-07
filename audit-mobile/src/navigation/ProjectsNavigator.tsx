import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import ProjectsScreen from '../screens/projects/ProjectsScreen';
import ProjectDetailsScreen from '../screens/projects/ProjectDetailsScreen';
import CreateProjectScreen from '../screens/projects/CreateProjectScreen';
import UploadFileScreen from '../screens/projects/UploadFileScreen';

export type ProjectsStackParamList = {
  Projects: undefined;
  ProjectDetails: { projectId: string };
  CreateProject: undefined;
  UploadFile: { projectId: string };
};

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export const ProjectsNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: '#1976D2',
      }}
    >
      <Stack.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          title: t('projects'),
        }}
      />
      <Stack.Screen
        name="ProjectDetails"
        component={ProjectDetailsScreen}
        options={{
          title: t('projectDetails'),
        }}
      />
      <Stack.Screen
        name="CreateProject"
        component={CreateProjectScreen}
        options={{
          title: t('createProject'),
        }}
      />
      <Stack.Screen
        name="UploadFile"
        component={UploadFileScreen}
        options={{
          title: t('uploadTrialBalance'),
        }}
      />
    </Stack.Navigator>
  );
};
