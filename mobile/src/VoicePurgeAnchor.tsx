import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export function VoicePurgeAnchor({ onPurgeComplete }: { onPurgeComplete?: () => void }) {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const opacity = useSharedValue(1);

  useSpeechRecognitionEvent('start', () => setIsRecording(true));
  useSpeechRecognitionEvent('end', () => setIsRecording(false));
  useSpeechRecognitionEvent('result', (event) => {
    setTranscript(event.results[0]?.transcript || '');
  });

  const handlePressIn = async () => {
    setTranscript('');
    opacity.value = 1;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const { status } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (status === 'granted') {
        ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true });
      }
    } catch (e) {
      setIsRecording(true);
      setTranscript("Dissolving nocturnal thought into vapor...");
    }
  };

  const handlePressOut = () => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch (e) {}
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Instant Dissolve animation (Ephemeral: Never save text or audio)
    opacity.value = withTiming(0, { duration: 600 }, () => {
      setTranscript('');
      opacity.value = 1;
    });

    if (onPurgeComplete) {
      onPurgeComplete();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.floatingText, animatedStyle]}>
        {transcript || (isRecording ? "Listening... Speak your mind" : "Hold Orb or Button to Speak & Release")}
      </Animated.Text>

      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.orbTrigger, isRecording && styles.orbActive]}
      >
        <Text style={styles.orbLabel}>{isRecording ? "Release to Purge" : "Hold to Talk"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  floatingText: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    minHeight: 48,
    paddingHorizontal: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  orbTrigger: {
    width: 160,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E2333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  orbActive: {
    backgroundColor: '#F43F5E',
    borderColor: '#FDA4AF',
  },
  orbLabel: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
