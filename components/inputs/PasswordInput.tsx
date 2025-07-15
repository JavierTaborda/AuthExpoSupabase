import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PasswordInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);

  const isValid = value.length >= 6;

  return (
    <View className="relative">
      <TextInput
        className={`border rounded-xl p-4 dark:text-white bg-transparent ${
          !touched || isValid
            ? "border-gray-300 dark:border-gray-600"
            : "border-red-500 dark:border-red-300"
        }`}
        placeholder="Ingresa tu contraseña..."
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!visible}
        value={value}
        onChangeText={onChangeText}
        onBlur={() => setTouched(true)}
      />

      {/* Hide */}
      <TouchableOpacity
        onPress={() => setVisible((prev) => !prev)}
        className="absolute right-4 top-4"
      >
        <Text className="text-sm text-primary font-medium">
          {visible ? "Ocultar" : "Ver"}
        </Text>
      </TouchableOpacity>

      {/* Error*/}
      {!isValid && touched && (
        <Text className="text-red-500 text-xs mt-1">Mínimo 6 caracteres</Text>
      )}
    </View>
  );
}