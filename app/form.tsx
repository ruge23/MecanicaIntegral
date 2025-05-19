import NumberInput from '@/components/NumberInput';
import PriceInput from '@/components/PriceInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BRAND_TRUCK, DATA_ITEMS, formatNumber, parseInputToNumber } from '../constants';
import { clearFormData, saveInvoiceData } from '../redux/slices/invoiceSlice';
import { FormData, RootStackParamList } from '../types';

const FormScreen = () => {
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    companyName: 'Mecanica Integral Tucumán',
    companyAddress: 'Los Aguirres',
    companyNIF: '20-35789965-5',
    companyPhone: '3584014717',
    companyEmail: 'mecanicaIntegral@gmail.com',
    validityDays: '30',
    items: [{ description: '', units: 0, price: 0, total: 0 }],
    subtotal: 0,
    discount: 0,
    taxRate: 21,
    total: 0
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ patente?: string }>({});
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const flagConFactura = useSelector((state: any) => state.invoice.flagConFactura);

  const handleChange = <T extends keyof FormData>(name: T, value: FormData[T]) => {
    const newData = { ...formData, [name]: value };

    // Recalcular totales si cambia descuento o IVA
    if (name === 'discount' || name === 'taxRate') {
      const { subtotal, totalWithTax } = calculateTotals(newData);
      newData.subtotal = subtotal;
      newData.total = totalWithTax;
    }

    setFormData(newData);
  };

  const handleItemChange = (index: number, name: string, value: string | number) => {
    if (name === 'Item') {
      setSelectedItem(value.toString());
      return;
    }

    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: value };

    // Asegurarse que units y price sean números
    const units = typeof newItems[index].units === 'number' ? newItems[index].units : 0;
    const price = typeof newItems[index].price === 'number' ? newItems[index].price : 0;

    newItems[index].total = parseFloat((units * price).toFixed(2));

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', units: 0, price: 0, total: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = (data = formData) => {
    const subtotal = parseFloat(data.items.reduce(
      (sum, item) => sum + (item?.total || 0),
      0
    ).toFixed(2));

    const discountPercentage = data.discount || 0;
    const discountAmount = parseFloat((subtotal * discountPercentage / 100).toFixed(2));
    const taxRate = data.taxRate || 21;

    const totalBeforeTax = parseFloat((subtotal - discountAmount).toFixed(2));
    const totalWithTax = parseFloat((totalBeforeTax * (1 + taxRate / 100)).toFixed(2));

    return { subtotal, discountAmount, totalBeforeTax, totalWithTax };
  };

  const handleSubmit = () => {
    if (!formData.Patente?.trim()) {
      setErrors({ patente: "La patente es obligatoria" });
      return;
    }
    setErrors({});
    const { subtotal, discountAmount, totalWithTax } = calculateTotals();
    const invoiceData = { ...formData, subtotal, total: totalWithTax, discount: discountAmount };
    dispatch(saveInvoiceData(invoiceData));
    navigation.navigate('preview');
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({
        ...formData,
        engineOrChassisNumberDate: selectedDate.toISOString().split('T')[0]
      });
    }
  };

  // Ocultar header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false
    });
    return () => {
      dispatch(clearFormData());
    };
  }, [navigation, dispatch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Nuevo Presupuesto {flagConFactura ? 'Con Factura' : 'Sin Factura'}</Text>

          <View style={styles.form}>
            <Text style={styles.subtitle}>Datos del Cliente</Text>
            <TextInput
              style={styles.input}
              placeholder="Apellido y Nombre"
              placeholderTextColor="#888"
              value={formData.clientName}
              onChangeText={(text) => handleChange('clientName', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={formData.Teléfono}
              onChangeText={(text) => handleChange('Teléfono', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={formData.Email}
              onChangeText={(text) => handleChange('Email', text)}
            />

            <Text style={styles.subtitle}>Datos del Camión</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.Marca}
                style={styles.picker}
                onValueChange={(itemValue) => handleChange('Marca', itemValue)}
                mode='dropdown'
              >
                <Picker.Item label="Seleccione una Marca" value="" />
                {BRAND_TRUCK.map((brand) => (
                  <Picker.Item key={brand} label={brand} value={brand} />
                ))}
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Modelo"
              placeholderTextColor="#888"
              value={formData.Modelo}
              onChangeText={(text) => handleChange('Modelo', text)}
            />

            <TextInput
              style={[
                styles.input,
                errors.patente && styles.inputError, // Aplica estilo de error si existe
              ]}
              placeholder="Patente"
              placeholderTextColor="#888"
              value={formData.Patente}
              onChangeText={(text) => {
                handleChange('Patente', text);
                if (errors.patente) setErrors({}); // Limpiar error al editar
              }}
            />
            {errors.patente && (
              <Text style={styles.errorText}>{errors.patente}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="N° de motor / chasis"
              placeholderTextColor="#888"
              value={formData.Ndemotorchasis}
              onChangeText={(text) => handleChange('Ndemotorchasis', text)}
            />

            <Text style={styles.label}>Fecha de ingreso</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: formData.engineOrChassisNumberDate ? '#fff' : '#888' }}>
                {formData.engineOrChassisNumberDate || 'Seleccione fecha'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.engineOrChassisNumberDate || new Date())}
                mode="date"
                display="spinner"
                textColor="red"
                locale="es-ES"
                positiveButton={{ label: 'OK', textColor: 'red' }}
                negativeButton={{ label: 'Cancel', textColor: 'red' }}
                onChange={onDateChange}
              />
            )}

            <Text style={styles.subtitle}>Agregar Items</Text>
            {formData.items?.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={item.Item}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleItemChange(index, 'Item', itemValue)}
                    mode='dropdown'
                  >
                    <Picker.Item label="Seleccione un Item" value="" />
                    {Object.keys(DATA_ITEMS).map((brand) => (
                      <Picker.Item key={brand} label={brand} value={brand} />
                    ))}
                  </Picker>
                </View>

                {selectedItem && selectedItem in DATA_ITEMS && (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={item.description}
                      style={styles.picker}
                      onValueChange={(itemValue) => handleItemChange(index, 'description', itemValue)}
                      mode='dropdown'
                    >
                      <Picker.Item label="Descripcion reparación" value="" />
                      {DATA_ITEMS[selectedItem].map((brand: string) => (
                        <Picker.Item key={brand} label={brand} value={brand} />
                      ))}
                    </Picker>
                  </View>
                )}

                <Text style={styles.label}>Unidades:</Text>
                <NumberInput
                  value={item.units}
                  onChangeText={(value) => handleItemChange(index, 'units', parseInt(value, 10) || 0)}
                  style={styles.input}
                  decimalPlaces={0}
                  placeholder="0"
                />

                <Text style={styles.label}>Precio: </Text>
                <PriceInput
                  value={item.price}
                  onChangeText={(value) => handleItemChange(index, 'price', value)}
                  style={styles.input}
                />

                <Text style={styles.totalText}>
                  Total: $ {item.total.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Text>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(index)}
                >
                  <Text style={styles.removeButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={addItem}
            >
              <Text style={styles.addButtonText}>Añadir Item</Text>
            </TouchableOpacity>

            <View style={styles.totalsContainer}>
              <Text style={styles.label}>Descuento en porcentaje (%):</Text>
              <NumberInput
                style={styles.input}
                value={formData.discount}
                onChangeText={(value) => {
                  const numericValue = Math.min(parseFloat(value) || 0, 100);
                  handleChange('discount', numericValue);
                }}
                decimalPlaces={0}
                placeholder="0"
              />

              {flagConFactura && (
                <>
                  <Text style={styles.label}>IVA (%):</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={formData.taxRate.toString()}
                    onChangeText={(text) => {
                      handleChange('taxRate', parseInputToNumber(text));
                    }}
                  />
                </>
              )}

              <Text style={styles.totalText}>
                Subtotal: ${formatNumber(calculateTotals().subtotal)}
              </Text>
              <Text style={styles.totalText}>
                Total después de descuento: ${formatNumber(calculateTotals().totalBeforeTax)}
              </Text>
              {flagConFactura && (
                <Text style={styles.totalText}>
                  Total con IVA: ${formatNumber(calculateTotals().totalWithTax)}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={['#FF4C4C', '#FF0000']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitButtonText}>Siguiente</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Estilos (se mantienen iguales)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  form: {
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    color: '#FF4C4C',
    fontSize: 18,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: '#FF4C4C',
    paddingBottom: 8,
    marginBottom: 16,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  inputError: {
    borderColor: "#FF4C4C", // Borde rojo para indicar error
    borderWidth: 2,
  },
  errorText: {
    color: "#FF4C4C",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  pickerContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    height: 50,
    width: '100%',
  },
  itemContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  label: {
    color: '#ccc',
    marginBottom: 6,
    fontSize: 14,
  },
  totalText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#800000',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  totalsContainer: {
    marginTop: 20,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
  },
  submitButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FormScreen;