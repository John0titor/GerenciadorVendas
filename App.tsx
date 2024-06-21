import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import CadastroFuncionarioScreen from './screens/CadastroFuncionarioScreen';
import ProductListScreen from './screens/ProductListScreen';
import CartScreen from './screens/CartScreen';
import CadastroProdutoScreen from './screens/CadastroProdutoScreen';
import VendaListScreen from './screens/VendaListScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Home" component={AppTabs} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Produtos" component={ProductListScreen} />
    <Tab.Screen name="Carrinho" component={CartScreen} />
    <Tab.Screen name="Vendas" component={VendaListScreen} />
    <Tab.Screen name="Cadastro Funcionario" component={CadastroFuncionarioScreen} />
    <Tab.Screen name="Cadastro Produto" component={CadastroProdutoScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { authToken } = useAuth();

  return (
    <NavigationContainer>
      {authToken ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <CartProvider> 
      <AppNavigator />
    </CartProvider>
  </AuthProvider>
);

export default App;
