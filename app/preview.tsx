import React from 'react';
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { InvoiceData, RootStackParamList } from '../types';

type PreviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'preview'>;

const PreviewScreen: React.FC = () => {
  const invoiceData = useSelector((state: any) => state.invoice.invoiceData) as InvoiceData | null;
  const navigation = useNavigation<PreviewScreenNavigationProp>(); 

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
      body { 
        font-family: Arial; 
        margin: 40px;
        font-size: 14px;
      }
      h1 { 
        color: #333;
        font-size: 18px;
        margin-bottom: 5px;
      }
      .header-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.left-cards {
  width: 60%;
}

.right-info {
  width: 35%;
  border-left: 1px solid #ddd;
  padding-left: 15px;
}

.company-card, 
.client-data,
.truck-data {
  margin-bottom: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #eee;
}
.invoice-info-card {
  margin-bottom: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #eee;
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

.info-table {
  width: auto;
  margin-left: 0;
}

.info-table td {
  border: none;
  padding: 3px 15px 3px 0;
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
        width: auto;
        margin-left: 0;
      }
      .info-table td {
        border: none;
        padding: 3px 15px 3px 0;
      }
      .items-table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .items-table td {
        font-style: italic;
      }
      .totals { 
        margin-top: 20px;
        text-align: right;
      }
      .totals p {
        margin: 5px 0;
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
        <img src="assets/images/logo-mecanica-integral.jpeg" alt="Logo" class="card-logo">
        <h1>Presupuesto #${invoiceData.invoiceNumber || '0001'}</h1>
      </div>
    </div>

  <div class="header-container">
    <div class="left-cards">
      <div class="company-card">
        <p class="bold">${invoiceData.companyName}</p>
        <p>${invoiceData.companyAddress}</p>
        <p>NIF: ${invoiceData.companyNIF}</p>
        <p>Tel: ${invoiceData.companyPhone} | Email: ${invoiceData.companyEmail}</p>
      </div>
    </div>
  
  <div class="right-info">
    <div class="client-data">
      <p class="bold">${invoiceData.clientName || 'Nombre del cliente'}</p>
      <p>${'Dirección del cliente'}</p>
      <p>NIF: ${'NIF del cliente'}</p>
      <p>Tel: ${'Teléfono del cliente'}</p>
      <p>Matrícula: ${'Matrícula'}</p>
      <p>Conductor: ${'Nombre conductor'}</p>
      <p>DNI: ${'DNI conductor'}</p>
    </div>
  </div>
</div>

    
    
    <table class="info-table">
      <tr>
        <table>
          <tr>
            <th>Fecha de Ingreso</th>
            <th>${invoiceData.date}</th>
          </tr>
        </table>
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
      <p>SUB-TOTAL: ${subtotal} $</p>
      <p>DESCUENTO: ${discount} $</p>
      <p>IVA (${taxRate}%): ${(total - subtotal + discount)} $</p>
      <p>TOTAL PRESUPUESTADO: ${total} $</p>
    </div>
    
    <div class="signature">
      <p>Firma</p>
      <p>Firma del cliente</p>
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
            <Text style={styles.infoLabel}>Fecha de Ingreso:</Text>
            <Text style={styles.infoValue}>{invoiceData.date}</Text>
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