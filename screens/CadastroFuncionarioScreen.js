// screens/CadastroFuncionarioScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function CadastroFuncionarioScreen() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [funcao, setFuncao] = useState('');

  const cadastrar = async () => {
    try {
      const response = await axios.post('http://192.168.3.246:3000/users', {
        fun_nome: nome,
        fun_cpf: cpf,
        fun_senha: senha,
        fun_funcao: funcao,
      });
      if (response.data) {
        alert('Usuário cadastrado com sucesso');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar usuário');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Função"
        value={funcao}
        onChangeText={setFuncao}
      />
      <Button title="Cadastrar" onPress={cadastrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
