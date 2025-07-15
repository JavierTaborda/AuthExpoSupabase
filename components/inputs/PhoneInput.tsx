import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface PhoneInputProps {
    value: string;
    onChange: (text: string) => void;
    error?: string;
}

export default function PhoneInput({ value, onChange, error }: PhoneInputProps) {
    return (
        <View>
            <TextInput
                className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 dark:text-white bg-transparent"
                placeholder="+584121234567"
                keyboardType="phone-pad"
                value={value}
                onChangeText={(text) => {
                    // start with +58 and allow only numbers
                    if (/^\+58\d*$/.test(text)) {
                        onChange(text);
                    }
                }} 
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={13}
            />
            {error && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
        </View>
    );
}
