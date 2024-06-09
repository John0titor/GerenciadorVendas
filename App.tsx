// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import CadastroFuncionarioScreen from './screens/CadastroFuncionarioScreen';
import VendaScreen from './screens/VendaScreen';
import CadastroProdutoScreen from './screens/CadastroProdutoScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="CadastroFuncionario" component={CadastroFuncionarioScreen} />
      <Tab.Screen name="Venda" component={VendaScreen} />
      <Tab.Screen name="CadastroProduto" component={CadastroProdutoScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
