import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../constants/styles';

type StatusType = 'draft' | 'active' | 'completed';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const { t } = useTranslation();

  const getStatusStyle = () => {
    switch (status) {
      case 'active':
        return { container: globalStyles.statusActive, text: globalStyles.statusActiveText };
      case 'completed':
        return { container: globalStyles.statusCompleted, text: globalStyles.statusCompletedText };
      case 'draft':
        return { container: globalStyles.statusDraft, text: globalStyles.statusDraftText };
      default:
        return { container: {}, text: {} };
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return t('active');
      case 'completed':
        return t('completed');
      case 'draft':
        return t('draft');
      default:
        return '';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return {};
    }
  };

  const statusStyle = getStatusStyle();
  const statusText = getStatusText();
  const sizeStyle = getSizeStyle();

  return (
    <View style={[globalStyles.statusBadge, statusStyle.container, sizeStyle]}>
      <Text style={[globalStyles.statusBadgeText, statusStyle.text]}>{statusText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
