import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FormData {
  [key: string]: {
    [key: number]: boolean;
  };
}

interface CheckItemProps {
  number: number;
  title: string;
  description: string;
  checked?: boolean;
  onChange: () => void;
}

const VehicleCheckScreen = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({});
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentPage < 4) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCheckboxChange = (section: string, item: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [item]: !prev[section]?.[item]
      }
    }));
  };

  const renderPage1 = () => (
    <View style={styles.pageContainer}>
      <Text style={styles.sectionTitle}>Prueba de conducción corta</Text>
      
      <CheckItem 
        number={1} 
        title="Volante" 
        description="Compruebe la posición de marcha en línea recta. Compruebe el ajuste del volante."
        checked={formData?.conduccion?.[1]}
        onChange={() => handleCheckboxChange('conduccion', 1)}
      />
      
      <CheckItem 
        number={2} 
        title="Embrague y caja de cambios" 
        description="Realizar una comprobación del funcionamiento."
        checked={formData?.conduccion?.[2]}
        onChange={() => handleCheckboxChange('conduccion', 2)}
      />
      
      <CheckItem 
        number={3} 
        title="Frenos" 
        description="Realizar una comprobación del funcionamiento."
        checked={formData?.conduccion?.[3]}
        onChange={() => handleCheckboxChange('conduccion', 3)}
      />
      
      <CheckItem 
        number={4} 
        title="Ruido" 
        description="Escuche el ruido procedente del vehículo."
        checked={formData?.conduccion?.[4]}
        onChange={() => handleCheckboxChange('conduccion', 4)}
      />

      <CheckItem 
        number={5} 
        title="Sistema de combustible" 
        description="Compruebe que no haya fugas de gas antes de trabajar en el taller."
        checked={formData?.conduccion?.[5]}
        onChange={() => handleCheckboxChange('conduccion', 5)}
      />

      <CheckItem 
        number={6} 
        title="Sistema de combustible" 
        description="Compruebe que el vehiculo no tiene fugas de combustible antes de entrar en el taller."
        checked={formData?.conduccion?.[6]}
        onChange={() => handleCheckboxChange('conduccion', 6)}
      />

      <CheckItem 
        number={7} 
        title="Función de arranque y parada automático a ralentí" 
        description="Asegúrese que la llave de encendido/botón de encendido esté en el modo de conducción y que la función esté desactivada a través del interruptor para detener y arrancar el ralentí."
        checked={formData?.conduccion?.[7]}
        onChange={() => handleCheckboxChange('conduccion', 7)}
      />

      <CheckItem 
        number={8} 
        title="Vehículos híbridos" 
        description="Realizar los Procedimientos para operaciones de taller en vehículos híbridos antes de comenzar el trabajo. En las instrucciones se puede encontrar información sobre estos procedimientos."
        checked={formData?.conduccion?.[8]}
        onChange={() => handleCheckboxChange('conduccion', 8)}
      />
    </View>
  );

  const renderPage2 = () => (
    <View style={styles.pageContainer}>
      <Text style={styles.sectionTitle}>En la cabina</Text>
      
      {[9, 10, 11, 12].map(num => (
        <CheckItem 
          key={num}
          number={num} 
          title={getCabinaTitle(num)} 
          description={getCabinaDescription(num)}
          checked={formData?.cabina?.[num]}
          onChange={() => handleCheckboxChange('cabina', num)}
        />
      ))}

      <Text style={styles.sectionTitle}>Acciones fuera del vehículo</Text>
      
      {[13, 14, 15, 16, 17].map(num => (
        <CheckItem 
          key={num}
          number={num} 
          title={getExteriorTitle(num)} 
          description={getExteriorDescription(num)}
          checked={formData?.exterior?.[num]}
          onChange={() => handleCheckboxChange('exterior', num)}
        />
      ))}
    </View>
  );

  const renderPage3 = () => (
    <View style={styles.pageContainer}>
      <Text style={styles.sectionTitle}>Basculamiento de la cabina</Text>
      
      {[18, 19, 20, 21, 22, 23, 24].map(num => (
        <CheckItem 
          key={num}
          number={num} 
          title={getBasculadaTitle(num)} 
          description={getBasculadaDescription(num)}
          checked={formData?.basculada?.[num]}
          onChange={() => handleCheckboxChange('basculada', num)}
        />
      ))}
    </View>
  );

  const renderPage4 = () => (
    <View style={styles.pageContainer}>
      <Text style={styles.sectionTitle}>Basculamiento de la cabina</Text>
      
      {Array.from({length: 12}, (_, i) => i + 25).map(num => (
        <CheckItem 
          key={num}
          number={num} 
          title={getMecanicosTitle(num)} 
          description={getMecanicosDescription(num)}
          checked={formData?.mecanicos?.[num]}
          onChange={() => handleCheckboxChange('mecanicos', num)}
        />
      ))}

      <Text style={[styles.sectionTitle, {marginTop: 20}]}>Bajada de la cabina</Text>
      <CheckItem 
        number={37} 
        title="Vehículos híbridos" 
        description="Realizar los Procedimientos para operaciones de taller en vehículos híbridos antes de comenzar el trabajo."
        checked={formData?.hibridos?.[37]}
        onChange={() => handleCheckboxChange('hibridos', 37)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Comprobación de estado del vehículo</Text>
          
          <View style={styles.headerInfo}>
            <Text style={styles.infoText}>SCANIA</Text>
            {/* <Text style={styles.infoText}>N.º de matrícula: {formData.plate || '---'}</Text> */}
          </View>

          {currentPage === 1 && renderPage1()}
          {currentPage === 2 && renderPage2()}
          {currentPage === 3 && renderPage3()}
          {currentPage === 4 && renderPage4()}

          <View style={styles.navigationButtons}>
            {currentPage > 1 && (
              <TouchableOpacity 
                style={[styles.navButton, styles.prevButton]}
                onPress={handlePrevious}
              >
                <Text style={styles.navButtonText}>Anterior</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
            >
              <Text style={styles.navButtonText}>
                {currentPage === 4 ? 'Finalizar' : 'Siguiente'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const CheckItem: React.FC<CheckItemProps> = ({ number, title, description, checked = false, onChange }) => (
  <View style={styles.itemContainer}>
    <View style={styles.checkboxContainer}>
      <Text style={styles.itemNumber}>{number}.</Text>
      <TouchableOpacity 
        style={[styles.checkbox, checked && styles.checkedBox]}
        onPress={onChange}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </View>
    
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
    </View>
  </View>
);

// Funciones helper para obtener títulos y descripciones
const getCabinaTitle = (num: number): string => {
  const titles: {[key: number]: string} = {
    9: 'Frenos de disco',
    10: 'Parabrisas, limpiaparabrisas',
    11: 'Retrovisores',
    12: 'Cabina'
  };
  return titles[num] || '';
};

const getCabinaDescription = (num: number): string => {
  const descriptions: {[key: number]: string} = {
    9: 'Compruebe el grosor de los forros de freno.',
    10: 'Comprobar el parabrisas, los limpiaparabrisas y la función de lavado.',
    11: 'Compruebe si hay daños. Compruebe su ajuste y funcionamiento de la calefacción.',
    12: 'Compruebe el estado del interior de la cabina.'
  };
  return descriptions[num] || '';
};

const getExteriorTitle = (num: number): string => {
  const titles: {[key: number]: string} = {
    13: 'Iluminación exterior',
    14: 'Ruedas',
    15: 'Carrocería',
    16: 'Cabina',
    17: 'Motor'
  };
  return titles[num] || '';
};

const getExteriorDescription = (num: number): string => {
  const descriptions: {[key: number]: string} = {
    13: 'Compruebe si hay daños. Realice una comprobación del funcionamiento.',
    14: 'Comprobar si la llanta y el neumático están dañados y los patrones de desgaste.',
    15: 'Comprobar si hay daños.',
    16: 'Compruebe si hay daños externos.',
    17: 'Comprobar el nivel de aceite. Comprobar si hay fugas.'
  };
  return descriptions[num] || '';
};

const getBasculadaTitle = (num: number): string => {
  const titles: {[key: number]: string} = {
    18: 'Sistema de basculamiento de la cabina',
    19: 'Fugas',
    20: 'Sistema de refrigeración',
    21: 'Techo de la cabina',
    22: 'Pantallas insonorizantes',
    23: 'Frenos de tambor',
    24: 'Tubos flexibles de los frenos'
  };
  return titles[num] || '';
};

const getBasculadaDescription = (num: number): string => {
  const descriptions: {[key: number]: string} = {
    18: 'Efectúe una prueba de funcionamiento y compruebe si hay fugas procedentes de la bomba y el cilindro hidráulico.',
    19: 'Compruebe si hay fugas de aceite, refrigerante, combustible, aire o gases de escape.',
    20: 'Comprobar las correas de transmisión, el tensor de correa y las poleas locas.',
    21: 'Compruebe si hay daños en el techo y en el equipo del techo.',
    22: 'Compruebe el estado de las pantallas insonorizantes. Observe si falta algún componente.',
    23: 'Compruebe el grosor de los forros de freno.',
    24: 'Compruebe los latiguillos de freno.'
  };
  return descriptions[num] || '';
};

const getMecanicosTitle = (num: number): string => {
  const titles: {[key: number]: string} = {
    25: 'Calderines de aire comprimido',
    26: 'Sistema de escape',
    27: 'Suspensión',
    28: 'Grupo diferencial, delantero',
    29: 'Caja de cambios',
    30: 'Caja de reenvío',
    31: 'Ralentizador',
    32: 'Árboles de transmisión',
    33: 'Grupos diferenciales traseros',
    34: 'Bogle de doble eje motriz',
    35: 'Bastidor del chasis y soportes',
    36: 'Cables eléctricos y conductos'
  };
  return titles[num] || '';
};

const getMecanicosDescription = (num: number): string => {
  const descriptions: {[key: number]: string} = {
    25: 'Vaciar el agua de condensación. Comprobar que los calderines no presenten corrosión ni daños externos.',
    26: 'Compruebe si hay daños y holgura.',
    27: 'Compruebe si hay daños. Compruebe si hay fugas.',
    28: 'Comprobar si hay fugas.',
    29: 'Comprobar si hay fugas.',
    30: 'Comprobar si hay fugas.',
    31: 'Comprobar si hay fugas.',
    32: 'Compruebe si hay daños y holgura.',
    33: 'Comprobar si hay fugas.',
    34: 'Comprobar si hay daños.',
    35: 'Compruebe si hay daños y holgura.',
    36: 'Compruebe si hay daños y holgura.'
  };
  return descriptions[num] || '';
};

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
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  headerInfo: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  pageContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FF4C4C',
    fontSize: 18,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: '#FF4C4C',
    paddingBottom: 8,
    marginBottom: 16,
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  itemNumber: {
    color: '#FF4C4C',
    fontWeight: 'bold',
    marginRight: 8,
    width: 24,
    textAlign: 'right',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FF4C4C',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkedBox: {
    backgroundColor: '#FF4C4C',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#333',
  },
  nextButton: {
    backgroundColor: '#FF4C4C',
    marginLeft: 'auto',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VehicleCheckScreen;