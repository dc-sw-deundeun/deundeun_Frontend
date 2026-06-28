import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

export interface TextProps extends RNTextProps {}

export const Text = React.forwardRef<RNText, TextProps>(
  ({ style, ...props }, ref) => {
    const flattenedStyle = StyleSheet.flatten(style);
    
    let fontFamily = 'NanumSquareRound-Regular';
    let removeWeight = false;

    if (flattenedStyle) {
      const weight = flattenedStyle.fontWeight;
      if (weight === '900' || weight === '800') {
        fontFamily = 'NanumSquareRound-ExtraBold';
        removeWeight = true;
      } else if (weight === 'bold' || weight === '700' || weight === '600' || weight === '500') {
        fontFamily = 'NanumSquareRound-Bold';
        removeWeight = true;
      } else if (weight === '300' || weight === 'light' || weight === '200' || weight === '100') {
        fontFamily = 'NanumSquareRound-Light';
        removeWeight = true;
      }
    }

    const customStyle = [
      { fontFamily },
      style,
      removeWeight ? { fontWeight: 'normal' as const } : null,
    ];

    return <RNText ref={ref} style={customStyle} {...props} />;
  }
);

(Text as any).displayName = 'Text';

export default Text;
