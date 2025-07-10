import { useState } from 'react';
import {
  Appearance,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

const { height } = Dimensions.get('window');

export default function PasswordRecoveryModal() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');

  const styles = StyleSheet.create({
    modalContainer: {
      height: height * 0.8,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      gap: 20,

    },
  });

  return (
    <>

      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text className="text-primary dark:text-primary-light font-semibold">
          Olvidé mi contraseña
        </Text>
      </TouchableOpacity>

      {/* Modal  swipe */}
      <Modal
        isVisible={visible}
        swipeDirection="down"
        onSwipeComplete={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}
        style={{
          justifyContent: 'flex-end', margin: 0,
          width: '100%'
        }}
        backdropOpacity={0.6}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <View className="bg-background dark:bg-dark-background" style={styles.modalContainer}>
              <View className="p-4 gap-4">

                <Text className="text-2xl font-bold text-center mb-2 text-gray-700 dark:text-gray-300">
                  Recuperar contraseña
                </Text>


                <Text className="text-base text-gray-600 dark:text-gray-400 text-start mb-2">
                  Ingresa tu correo electrónico para recibir instrucciones de recuperación de contraseña.
                </Text>


                <TextInput
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 dark:text-white bg-transparent"
                  placeholderTextColor={
                    Appearance.getColorScheme() === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                />

                <TouchableOpacity
                  className="bg-primary dark:bg-dark-primary rounded-xl p-4 items-center"
                  onPress={() => {
                    if (!email.trim()) {
                      alert('Por favor ingresa tu correo electrónico.');
                      return;
                    }
                    alert(`Se enviará un correo de recuperación a: ${email}`);
                    setVisible(false);
                  }}
                >
                  <Text className="text-white font-bold text-lg">Enviar</Text>
                </TouchableOpacity>


                <View className="flex-row justify-center items-center mt-4">
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <Text className="text-primary dark:text-primary-light font-semibold">
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}