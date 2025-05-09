import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { login, loginFailure } from '../redux/slices/loginSlice';
import { RootStackParamList } from '../types';
// import { testFirebaseConnection } from '../testFirebase'; 

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'login'>;

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    setUsernameError('');
    setPasswordError('');
    let isValid = true;

    if (!username.trim()) {
      setUsernameError('Por favor ingresa tu nombre de usuario');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Por favor ingresa tu contraseña');
      isValid = false;
    }
    if (!isValid) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const normalizedUsername = username.toLowerCase().trim();
      console.log('Intento de login con:', { normalizedUsername, password }); // Debug

      if (normalizedUsername === 'santiago' && password === '159753') {
        dispatch(login({ username: normalizedUsername }));
        navigation.reset({
          index: 0,
          routes: [{ name: 'home' }],
        });
      } else {
        dispatch(loginFailure({error: 'Credenciales incorrectas'}));
        setUsernameError('Credenciales incorrectas');
        setPasswordError('Credenciales incorrectas');
      }
      setIsLoading(false);
    }, 1500);
  };

  // useEffect(() => {
    // testFirebaseConnection();
  // }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            {/* Logo centrado en la parte superior */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logo-mecanica-integral.jpeg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Contenedor del formulario */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Mecánica Integral</Text>
              <Text style={styles.subtitle}>Ingresa tus credenciales</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    usernameError ? styles.inputError : null
                  ]}
                  placeholder="Usuario"
                  placeholderTextColor="#888"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
                {usernameError && (
                  <Text style={styles.errorText}>{usernameError}</Text>
                )}
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons 
                    name={showPassword ? 'visibility-off' : 'visibility'} 
                    size={24} 
                    color="#888" 
                  />
                </TouchableOpacity>
              </View>
              {passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
              <TouchableOpacity 
                style={[
                  styles.button,
                  isLoading ? styles.buttonDisabled : null
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.loadingText}>Cargando...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Ingresar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4c4c',
  },
  errorText: {
    color: '#ff4c4c',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 5,
  },
  toggleButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 8,
  },
  button: {
    backgroundColor: '#FF4C4C',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default LoginScreen;