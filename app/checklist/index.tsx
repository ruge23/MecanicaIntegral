import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const StaticFormScreen = () => {
	const navigation = useNavigation();
	return (
		<SafeAreaView style={styles.safeArea}>
			<LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContainer}>
					<Text style={styles.title}>Comprobación de Vehículo</Text>

					<View style={styles.formContainer}>
						<Text style={styles.sectionTitle}>Datos Generales</Text>

						<Text style={styles.label}>Concesionario</Text>
						<TextInput
							style={styles.input}
							placeholder="Nombre del concesionario"
							placeholderTextColor="#888"
							editable={false}
							value="SCANIA"
						/>

						<Text style={styles.label}>Nombre del Cliente</Text>
						<TextInput
							style={styles.input}
							placeholder="Nombre completo del cliente"
							placeholderTextColor="#888"
							editable={false}
						/>

						<Text style={styles.label}>Fecha</Text>
						<TextInput
							style={styles.input}
							placeholder="DD/MM/AAAA"
							placeholderTextColor="#888"
							editable={false}
						/>

						<Text style={styles.label}>Distancia conducida (km)</Text>
						<TextInput
							style={styles.input}
							placeholder="0"
							placeholderTextColor="#888"
							keyboardType="numeric"
							editable={false}
						/>

						<Text style={styles.label}>Número de Matrícula</Text>
						<TextInput
							style={styles.input}
							placeholder="ABC123"
							placeholderTextColor="#888"
							editable={false}
						/>

						<Text style={styles.label}>Orden de Trabajo</Text>
						<TextInput
							style={styles.input}
							placeholder="Número de orden"
							placeholderTextColor="#888"
							editable={false}
						/>

						<Text style={styles.label}>Tipo de motor/Vehículo</Text>
						<TextInput
							style={styles.input}
							placeholder="Ej: Diésel, Híbrido, etc."
							placeholderTextColor="#888"
							editable={false}
						/>

						<Text style={styles.label}>Número de Serie del Chasis</Text>
						<TextInput
							style={styles.input}
							placeholder="Número de chasis"
							placeholderTextColor="#888"
							editable={false}
						/>

						<Text style={styles.label}>Tipo de Operación</Text>
						<TextInput
							style={styles.input}
							placeholder="Tipo de operación realizada"
							placeholderTextColor="#888"
							editable={false}
						/>

						<Text style={styles.label}>Finalizado por</Text>
						<TextInput
							style={styles.input}
							placeholder="Nombre del técnico"
							placeholderTextColor="#888"
							editable={false}
						/>

						<Text style={styles.sectionTitle}>Estado</Text>

						<View style={styles.checkboxContainer}>
							<View style={styles.checkboxRow}>
								<View style={[styles.checkbox, styles.checkedBox]} />
								<Text style={styles.checkboxLabel}>Realizado sin Nota</Text>
							</View>

							<View style={styles.checkboxRow}>
								<View style={styles.checkbox} />
								<Text style={styles.checkboxLabel}>Realizado con Nota</Text>
							</View>
						</View>
						<View style={styles.navigationButtons}>

							<TouchableOpacity
								style={[styles.navButton, styles.nextButton]}
								onPress={() => navigation.navigate({
									name: 'checklist/checklistitems',
									params: undefined
								})}
							>
								<Text style={styles.navButtonText}>
									Siguiente
								</Text>
							</TouchableOpacity>
						</View>
					</View>
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
	formContainer: {
		backgroundColor: '#1a1a1a',
		borderRadius: 8,
		padding: 16,
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
	label: {
		color: '#fff',
		fontSize: 14,
		marginBottom: 8,
		marginTop: 12,
	},
	input: {
		backgroundColor: '#222',
		color: '#fff',
		borderRadius: 8,
		padding: 14,
		borderWidth: 1,
		borderColor: '#444',
	},
	checkboxContainer: {
		marginVertical: 16,
	},
	checkboxRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#FF4C4C',
		marginRight: 12,
	},
	checkedBox: {
		backgroundColor: '#FF4C4C',
	},
	checkboxLabel: {
		color: '#fff',
		fontSize: 16,
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

export default StaticFormScreen;