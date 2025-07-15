import { useState } from "react";
import { Text, TextInput, View } from "react-native";


export default function EmailInput({
    value,
    onChangeText,
}: {
    value: string;
    onChangeText: (text: string) => void;
}) {
    const [touched, setTouched] = useState(false);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    return (
        <View>
            <TextInput
                className={`border rounded-xl p-4 dark:text-white bg-transparent 
                        ${touched && !isValid ? 'border-red-500 dark:border-red-300' : 'border-gray-300 dark:border-gray-600'}
                `}
                placeholder="correo@ejemplo.com"
                value={value}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={() => setTouched(true)}
                onChangeText={onChangeText}
            />
            {!isValid && touched && (
                <Text className="text-red-500 text-xs mt-1">Correo no válido</Text>
            )}
        </View>
    );
}
