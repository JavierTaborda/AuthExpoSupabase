import { useThemeStore } from '@/stores/useThemeStore';
import React, { useEffect } from 'react';
import { Dimensions, Modal, Platform, StatusBar, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 👈 Importante

type BottomModalProps = {
  visible: boolean;
  onClose: () => void;
  heightPercentage?: number; // % height
  children: React.ReactNode;
};

export default function BottomModal({
  visible,
  onClose,
  children,
  heightPercentage = 0.8,
}: BottomModalProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const insets = useSafeAreaInsets(); 
  const windowHeight = Dimensions.get('window').height;
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;


  const modalHeight = (windowHeight - statusBarHeight) * heightPercentage + insets.bottom;

  const translateY = useSharedValue(modalHeight);
  const ANIMATION_CONFIG = {
    damping: 20,
    stiffness: 230,
    mass: 1,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };

  // Show/Hide Modal
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, ANIMATION_CONFIG);
    } else {
      translateY.value = withSpring(modalHeight, ANIMATION_CONFIG);
    }
  }, [visible, modalHeight]);

  // Drag and close
  const dragGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 800) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, ANIMATION_CONFIG);
      }
    });

  // animate
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    bottom: 0,
    left: 0,
    right: 0,
  }));

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-end bg-overlay dark:bg-dark-overlay">
          <Animated.View
            style={[
              sheetStyle,
              {
                height: modalHeight,
                paddingBottom: insets.bottom, //space fo home iindicator or navigation button 
              },
            ]}
            className="px-5 rounded-t-3xl bg-background dark:bg-dark-background"
          >
            <GestureDetector gesture={dragGesture}>
              <View>
                <View className="w-20 h-1.5 bg-neutral-400 self-center rounded-full mt-3 mb-3" />
              </View>
            </GestureDetector>
            {children}
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
