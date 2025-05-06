import { Stack, Redirect } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="index" // Ruta especial que se ejecuta al abrir la app
          options={{ headerShown: false }}
          redirect
        />
        <Stack.Screen 
          name="login" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="home" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="preview" 
          options={{ headerShown: false }}
        />
      </Stack>
    </Provider>
  );
}