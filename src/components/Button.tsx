import React, { useRef } from 'react';
import { 
  Text, 
  StyleSheet, 
  Pressable, 
  Animated, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  // 스케일 애니메이션 변수
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleValue, {
      toValue: 1.0,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyles: any[] = [styles.button, styles[size]];
    
    if (variant === 'primary') {
      baseStyles.push(styles.primary);
    } else if (variant === 'secondary') {
      baseStyles.push(styles.secondary);
    } else if (variant === 'outline') {
      baseStyles.push(styles.outline);
    }

    if (disabled) {
      baseStyles.push(styles.disabled);
    }

    return baseStyles;
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseStyles: any[] = [styles.text, styles[`text_${size}` as keyof typeof styles]];

    if (variant === 'outline') {
      baseStyles.push(styles.textOutline);
    } else if (variant === 'secondary') {
      baseStyles.push(styles.textSecondary);
    } else {
      baseStyles.push(styles.textPrimary);
    }

    if (disabled) {
      baseStyles.push(styles.textDisabled);
    }

    return baseStyles;
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={({ pressed }) => [
          getButtonStyle(),
          pressed && !disabled && !loading && styles.pressed,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator 
            color={variant === 'outline' ? COLORS.primary : '#ffffff'} 
            size="small" 
          />
        ) : (
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pressed: {
    opacity: 0.9,
  },
  // Sizes
  sm: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  md: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  lg: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.primaryLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  disabled: {
    backgroundColor: COLORS.light.disabledBg,
    borderColor: COLORS.light.disabledBg,
  },
  // Text Styles
  text: {
    ...TYPOGRAPHY.bodyBold,
    textAlign: 'center',
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: COLORS.primaryDark,
  },
  textOutline: {
    color: COLORS.primary,
  },
  textDisabled: {
    color: COLORS.light.disabledText,
  },
});

export default Button;
