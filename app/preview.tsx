import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, InvoiceData } from '../types';
import { MaterialIcons } from '@expo/vector-icons';

type PreviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'preview'>;

const PreviewScreen: React.FC = () => {
  const invoiceData = useSelector((state: any) => state.invoice.invoiceData) as InvoiceData | null;
  const navigation = useNavigation<PreviewScreenNavigationProp>();
  console.log('state.invoice.invoiceData', invoiceData);

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
        <td>${item.price} $</td>
        <td>${item.total} $</td>
      </tr>
    `).join('');

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; margin: 20px; }
            h1 { color: #333; }
            .header { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .totals { margin-top: 20px; font-weight: bold; }
            .signature { margin-top: 50px; }
          </style>
        </head>
        <body>
          <h1>Presupuesto #${invoiceData.invoiceNumber || '0001'}</h1>
          
          <div class="header">
            <p><strong>${invoiceData.companyName}</strong></p>
            <p>${invoiceData.companyAddress}</p>
            <p>NIF: ${invoiceData.companyNIF}</p>
            <p>Tel: ${invoiceData.companyPhone} | Email: ${invoiceData.companyEmail}</p>
          </div>
          
          <table>
            <tr>
              <th>Fecha</th>
              <th>${invoiceData.date}</th>
              <th>Validez</th>
              <th>${invoiceData.validityDays} días</th>
            </tr>
          </table>
          
          <table>
            <tr>
              <th>DESCRIPCIÓN</th>
              <th>UNIDADES</th>
              <th>PRECIO</th>
              <th>TOTAL</th>
            </tr>
            ${itemsHTML}
          </table>
          
          <div class="totals">
            <p>SUB-TOTAL: ${subtotal} $</p>
            <p>DESCUENTO: ${discount} $</p>
            <p>IVA (${taxRate}%): ${(total - subtotal + discount)} $</p>
            <p>TOTAL PRESUPUESTADO: ${total} $</p>
          </div>
          
          <div class="signature">
            <p>Firma: _________________________</p>
            <p>Firma del cliente: _________________________</p>
          </div>
        </body>
      </html>
    `;
  };

  const generatePDF = async (): Promise<void> => {
    try {
      const html = generateInvoiceHTML();
      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const shareInvoice = async () => {
    try {
      const message = `Presupuesto #${invoiceData.invoiceNumber || '0001'}\n` +
        `Cliente: ${invoiceData.clientName}\n` +
        `Total: ${total} $\n` +
        `Validez: ${invoiceData.validityDays} días`;

      return await Share.share({
        message,
        title: 'Presupuesto Mecánica Integral'
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  return (
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.invoiceContainer}>
          <Text style={styles.invoiceTitle}>Presupuesto #{invoiceData.invoiceNumber || '0001'}</Text>

          <View style={styles.header}>
            <Text style={styles.companyName}>{invoiceData.companyName}</Text>
            <Text style={styles.companyInfo}>{invoiceData.companyAddress}</Text>
            <Text style={styles.companyInfo}>NIF: {invoiceData.companyNIF}</Text>
            <Text style={styles.companyInfo}>Tel: {invoiceData.companyPhone} | Email: {invoiceData.companyEmail}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>{invoiceData.date}</Text>
            <Text style={styles.infoLabel}>Validez:</Text>
            <Text style={styles.infoValue}>{invoiceData.validityDays} días</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.tableCell]}>DESCRIPCIÓN</Text>
              <Text style={[styles.tableHeader, styles.tableCell]}>UNIDADES</Text>
              <Text style={[styles.tableHeader, styles.tableCell]}>PRECIO</Text>
              <Text style={[styles.tableHeader, styles.tableCell]}>TOTAL</Text>
            </View>

            {items.map((item, index) => (
              <View key={`item-${index}`} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.description}</Text>
                <Text style={styles.tableCell}>{item.units}</Text>
                <Text style={styles.tableCell}>{item.price} $</Text>
                <Text style={styles.tableCell}>{item.total} $</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsContainer}>
            <Text style={styles.totalText}>SUB-TOTAL: {subtotal} $</Text>
            <Text style={styles.totalText}>DESCUENTO: {discount} $</Text>
            <Text style={styles.totalText}>IVA ({taxRate}%): {(total - subtotal + discount)} $</Text>
            <Text style={styles.grandTotal}>TOTAL PRESUPUESTADO: {total} $</Text>
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
            <Text style={styles.actionButtonText}>Exportar PDF</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.actionButton}
            onPress={shareInvoice}
            accessibilityLabel="Compartir factura"
          >
            <MaterialIcons name="share" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Compartir</Text>
          </TouchableOpacity> */}

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
  },
  tableCell: {
    flex: 1,
    padding: 8,
    color: '#fff',
    textAlign: 'center',
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
    fontSize: 18,
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