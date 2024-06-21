import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    const success = await login(cpf, senha);
    if (success) {
      navigation.navigate('Home'); // Ajuste conforme suas rotas
    } else {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        placeholder="Digite seu CPF"
        //keyboardType="numeric"
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;
