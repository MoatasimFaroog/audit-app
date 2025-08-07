import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message, 
  fullScreen = false 
}) => {
  const { t } = useTranslation();
  const displayMessage = message || t('loading');

  return (
    <View style={[globalStyles.loadingContainer, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {displayMessage && (
        <Text style={styles.loadingText}>{displayMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 12,
    color: theme.colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
});
