import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../../constants/styles';
import { theme } from '../../constants/theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  iconSize?: number;
  iconColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder-outline',
  title,
  message,
  buttonTitle,
  onButtonPress,
  iconSize = 64,
  iconColor = theme.colors.disabled,
}) => {
  return (
    <View style={globalStyles.noDataContainer}>
      <MaterialCommunityIcons name={icon} size={iconSize} color={iconColor} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {buttonTitle && onButtonPress && (
        <Button
          mode="contained"
          onPress={onButtonPress}
          style={styles.button}
        >
          {buttonTitle}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: theme.colors.disabled,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  button: {
    marginTop: 16,
  },
});
