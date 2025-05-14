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
  
  const generarSiguienteId = (presupuestoActual: string | null | undefined): string => {
    // Casos iniciales: null, undefined, string vacío o "0"
    if (!presupuestoActual || presupuestoActual === '0') {
        return '00000000000-1';
    }
    // Extraer y aumentar el número
    const partes = presupuestoActual.split('-');
    const siguienteNumero = parseInt(partes[1], 10) + 1;
    // Reconstruir manteniendo 12 dígitos
    const cerosNecesarios = 11 - siguienteNumero.toString().length;
    const ceros = '0'.repeat(Math.max(0, cerosNecesarios));
    
    return `${ceros}-${siguienteNumero}`;
  }

  const generarNuevoIdGlobal = async (flagConfactura : boolean)  => {
    dispatch(setFlagConFactura(flagConfactura));
    const ultimoId = await obtenerUltimoIdPresupuestoGlobal(flagConfactura);
    console.log('ultimoId', ultimoId);
    const nuevoId = generarSiguienteId(ultimoId)
    dispatch(setIdPresupuesto(nuevoId));
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