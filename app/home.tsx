import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { obtenerUltimoIdPresupuestoGlobal } from '@/services/invoiceService';
import { setFlagConFactura, setIdPresupuesto } from '@/redux/slices/invoiceSlice';


const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const generarNuevoIdGlobal = async (flagConfactura : boolean)  => {
    const ultimoId = await obtenerUltimoIdPresupuestoGlobal(flagConfactura);
    const numero = parseInt(ultimoId, 10);
    const nuevoNumero = numero + 1;
    console.log('nuevoID', nuevoNumero)
    dispatch(setIdPresupuesto(String(nuevoNumero).padStart(12, '0')));
    // return String(nuevoNumero).padStart(12, '0');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Panel de Navegación</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                generarNuevoIdGlobal(false);
                setFlagConFactura(false);
                navigation.navigate('form');
              }}
            >
              <LinearGradient
                colors={['#FF4C4C', '#FF0000']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Presupuesto sin Factura</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                generarNuevoIdGlobal(true);
                setFlagConFactura(true);
                navigation.navigate('form');
              }}
            >
              <LinearGradient
                colors={['#FF4C4C', '#FF0000']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Presupuesto con Factura</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          <TouchableOpacity
            style={styles.exitButton}
          onPress={() => navigation.navigate('login')}
          >
            <Text style={styles.exitButtonText}>Salir</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: 20,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  spacer: {
    flex: 1,
  },
  exitButton: {
    borderWidth: 2,
    borderColor: '#FF4C4C',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: 'transparent',
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;