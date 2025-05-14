import React from 'react';
import {
  AppState,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
import { db } from '@/firebase/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { InvoiceData, RootStackParamList } from '../types';

type PreviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'preview'>;

const PreviewScreen: React.FC = () => {
  const invoiceData = useSelector((state: any) => state.invoice.invoiceData) as InvoiceData | null;
  const flagConFactura = useSelector((state: any) => state.invoice.flagConFactura);
  const navigation = useNavigation<PreviewScreenNavigationProp>(); 
  const newIdPresupuesto = useSelector((state: any) => state.invoice.idPresupuesto);
  
  if (!invoiceData) {
    return (
      <View style={styles.container}>
        <Text>No hay datos de factura disponibles</Text>
      </View>
    );
  }

  const { subtotal, total, taxRate, discount, items } = invoiceData;

  // Generar HTML para el PDF con TypeScript
  const generateInvoiceHTML = (): string => {
    const itemsHTML = items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.units}</td>
        <td>$ ${item.price.toLocaleString('es-ES', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</td>
        <td>$ ${item.total.toLocaleString('es-ES', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</td>
      </tr>
    `).join('');

    return `
            <html>
              <head>
                <style>
                  body { 
                    font-family: Arial, sans-serif; 
                    margin: 0;
                    padding: 20px;
                    color: #333;
                    font-size: 14px;
                    line-height: 1.4;
                  }
                  h1 {
                    font-size: 18px;
                    color: #222;
                    text-align: center;
                    margin: 10px 0;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #444;
                  }
                  .header-container {
                    display: flex;
                    justify-content: space-around; /* Cambiado a space-around */
                    margin-bottom: 20px;
                  }
                  .left-cards {
                    width: 30%;
                  }
                  .right-info {
                    width: 50%; /* Reduje el ancho para que el espacio alrededor se note más */
                  }
                  .company-card, 
                  .client-data,
                  .truck-data {
                    margin-bottom: 15px;
                    padding: 10px;
                    // background: #f9f9f9;
                    // border-radius: 5px;
                    // border: 1px solid #eee;
                  }
                  .invoice-info-card {
                    margin-bottom: 15px;
                    padding: 10px;
                    // background: #f9f9f9;
                    // border-radius: 5px;
                    // border: 1px solid #eee;
                    display: flex;
                    align-items: center;
                  }
                  .card-content {
                    display: flex;
                    align-items: center;
                    width: 100%;
                  }
                  .card-logo {
                    width: 50px; /* Ajusta según necesites */
                    height: auto;
                    margin-right: 15px;
                  }
                  .invoice-info-card h1 {
                    background-color: #444;
                    color: white;
                    text-align: center;
                    flex-grow: 1; /* Esto hace que el h1 ocupe el espacio restante */
                    margin: 0; /* Elimina márgenes por defecto */
                  }
                  .client-data,
                  .truck-data {
                    margin-bottom: 10px;
                  }
                  .bold {
                    font-weight: bold;
                  }
                  table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 15px 0;
                  }
                  th, td { 
                    border: 1px solid #ddd; 
                    padding: 8px; 
                    text-align: left;
                    font-weight: normal;
                  }
                  .info-table {
                    width: 100%;
                    margin-left: 0;
                  }
                  .info-table th {
                    background-color: #444;
                    color: white;
                    font-weight: bold;
                  }
                  .info-table td {
                    border: none;
                    padding: 3px 15px 3px 0;
                  }
                  .items-table th {
                    background-color: #444;
                    color: white;
                    font-weight: bold;
                  }
                  .items-table td {
                    font-style: italic;
                  }
                  .totals {
                    padding: 10px: 
                    margin-top: 20px;
                    text-align: right;
                    border: 1px solid #ddd;
                  }
                  .totals p {
                    margin: 5px;
                  }
                  .signature { 
                    margin-top: 60px;
                  }
                  .signature p {
                    margin: 25px 0 0 0;
                  }
                  .divider {
                    border-top: 1px solid #000;
                    margin: 10px 0;
                  }
                  .bold {
                    font-weight: bold;
                  }
                </style>
              </head>
              <body>
                <div class="invoice-info-card">
                  <div class="card-content">
                    <h1>Presupuesto - ${newIdPresupuesto}</h1>
                  </div>
                </div>
                <div class="divider"></div>
                <div class="header-container">
                  <div class="left-cards">
                    <div class="company-card">
                      <p class="bold">${invoiceData.companyName}</p>
                      <p>Dirección: ${invoiceData.companyAddress}</p>
                      <p>Cuit: ${invoiceData.companyNIF}</p>
                      <p>Tel: ${invoiceData.companyPhone} </p>
                      <p>Email: ${invoiceData.companyEmail}</p>
                    </div>
                  </div>
                  <div class="right-info">
                    <div class="client-data">
                      <p class="bold">Datos del Cliente: </p>
                      <p>Nombre: ${invoiceData.clientName || 'Nombre del cliente'}</p>
                      <p>Telefono: ${invoiceData.Teléfono || 'Telefono del cliente'}</p>
                      <p>Email: ${invoiceData.Email || 'Email del cliente'}</p>
                      <p class="bold">Datos del Camión: </p>
                      <p>Marca: ${invoiceData.Marca || 'Marca del camión'}</p>
                      <p>Modelo: ${invoiceData.Modelo || 'Modelo'}</p>
                      <p>Patente: ${invoiceData.Patente || 'Patente'}</p>
                      <p>N°chasis: ${invoiceData.Ndemotorchasis || 'N°chasis'}</p>
                    </div>
                  </div>
                </div>
                <table class="info-table">
                  <tr>
                    <th>Fecha de Ingreso</th>
                    <th>${invoiceData.date}</th>
                  </tr>
                </table>
                
                <table class="items-table">
                  <tr>
                    <th>DESCRIPCIÓN</th>
                    <th>UNIDADES</th>
                    <th>PRECIO</th>
                    <th>TOTAL</th>
                  </tr>
                  ${itemsHTML}
                </table>

                <div class="divider"></div>
                

                <div class="totals">
                  <p>SUB-TOTAL: $ ${subtotal.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} </p>
                  <p>DESCUENTO: $ ${discount.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</p>
                  ${ flagConFactura ? 
                    `<p>IVA (${taxRate}%): $ ${(total - subtotal + discount).toLocaleString('es-ES', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</p>` 
                    : '' }
                  <p>TOTAL PRESUPUESTADO: $ ${ flagConFactura ? total.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) : (subtotal - discount).toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} </p>
                </div>

                <div class="signature">
                  <p>Firma</p>
                  <p>Firma del cliente</p>
                </div>
              </body>
            </html>
    `;
  };

  const guardarNuevaFacturaDB = async () => {
    try {
      const nuevaFactura = {
        idPresupuesto: newIdPresupuesto,
        numPatente: invoiceData.Patente,
        userId: invoiceData.clientName,
        fechaCreacion: serverTimestamp(),
        items, 
        total,
        estado: 'activa'
      };
      const docRef = await addDoc(collection(db, flagConFactura ? 'conFactura' : 'sinFactura'), nuevaFactura);
      return { ...nuevaFactura, firebaseId: docRef.id };
    
    } catch (error) {
      console.error("Error al crear factura:", error);
      throw error;
    }
  }

  const generatePDF = async (): Promise<void> => {
    try {
      const html = generateInvoiceHTML();
      const { uri: tempUri } = await Print.printToFileAsync({
        html,
        width: 595, 
        height: 842,
        base64: false,
        // fileName: `${invoiceData.invoiceNumber || 'NRO'}.pdf` // Nombre personalizado
      });

      // 2. Crear nombre personalizado
      const newFileName = `${newIdPresupuesto}-${invoiceData.Patente}.pdf`;
      const directory = FileSystem.cacheDirectory;
      const newUri = `${directory}${newFileName}`;

      // 3. Renombrar/mover el archivo
      await FileSystem.moveAsync({
        from: tempUri,
        to: newUri
      });

      if (await Sharing.isAvailableAsync()) {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
          if (nextAppState === 'active') {
            await guardarNuevaFacturaDB();
            navigation.reset({
              index: 0,
              routes: [{ name: 'home' }],
            });
            subscription.remove();
          }
        });
        await Sharing.shareAsync(newUri, {
          dialogTitle: 'Compartir presupuesto',
          mimeType: 'application/pdf',
          UTI: 'com.adobe.pdf'
        });
        
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  return (
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.invoiceContainer}>
          <Text style={styles.invoiceTitle}>Presupuesto #{newIdPresupuesto}</Text>

          <View style={styles.header}>
            <Text style={styles.companyName}>{invoiceData.companyName}</Text>
            <Text style={styles.companyInfo}>Dirección: {invoiceData.companyAddress}</Text>
            <Text style={styles.companyInfo}>Cuil: {invoiceData.companyNIF}</Text>
            <Text style={styles.companyInfo}>Tel: {invoiceData.companyPhone} </Text>
            <Text style={styles.companyInfo}>Email: {invoiceData.companyEmail} </Text>

          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de Ingreso:</Text>
            <Text style={styles.infoValue}>{invoiceData.date}</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.tableCell]}>Descripción</Text>
              <Text style={[styles.tableHeader, styles.tableCell]}>Unidades</Text>
              <Text style={[styles.tableHeader, styles.tableCell]}>Precio</Text>
              <Text style={[styles.tableHeader, styles.tableCell]}>Total</Text>
            </View>

            {items.map((item, index) => (
              <View key={`item-${index}`} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.description}</Text>
                <Text style={styles.tableCell}>{item.units}</Text>
                <Text style={styles.tableCell}>$ {item.price.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} </Text>
                <Text style={styles.tableCell}>$ {item.total.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsContainer}>
            <Text style={styles.totalText}>Descuento:$ {discount.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</Text>
            <Text style={styles.totalText}>
              Sub-total:$ {subtotal.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Text>
            { flagConFactura && (
              <Text style={styles.totalText}>IVA ({taxRate}%): $ {(total - subtotal + discount).toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} </Text>
            )}
            <Text style={styles.grandTotal}>
              Total Presupuestado: $ { flagConFactura ? total.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) : (subtotal - discount).toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} 
            </Text>
          </View>

          <View style={styles.signatureContainer}>
            <Text style={styles.signature}>Firma:</Text>
            <Text style={styles.signature}>Firma del cliente:</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={generatePDF}
            accessibilityLabel="Compartir factura como PDF"
          >
            <MaterialIcons name="share" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Compartir PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF4C4C' }]}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Volver al formulario"
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Estilos (TypeScript infiere los tipos automáticamente)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  invoiceContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF4C4C',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 15,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#FF4C4C',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
  },
  table: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#333',
    fontSize: 15,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    color: '#fff',
    textAlign: 'center',
    fontSize: 8,
  },
  totalsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 5,
  },
  totalText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 3,
  },
  grandTotal: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FF4C4C',
    marginTop: 10,
  },
  signatureContainer: {
    marginTop: 40,
  },
  signature: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    minWidth: 150,
    gap: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PreviewScreen;