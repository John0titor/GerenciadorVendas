import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { commonStyles as styles } from '../styles/common';
import config from '../config';

const CadastroFuncionarioScreen = () => {
  const [fun_nome, setFunNome] = useState('');
  const [fun_cpf, setFunCpf] = useState('');
  const [fun_senha, setFunSenha] = useState('');
  const [fun_funcao, setFunFuncao] = useState('vendedor');
  const { authToken } = useAuth();

  const handleCadastro = async () => {
    try {
      const response = await fetch(config.API_URL+'/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ fun_nome, fun_cpf, fun_senha, fun_funcao }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso');
      } else {
        Alert.alert('Erro', data.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao cadastrar funcionário');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={fun_nome}
        onChangeText={setFunNome}
        placeholder="Digite o nome do funcionário"
      />
      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        value={fun_cpf}
        onChangeText={setFunCpf}
        placeholder="Digite o CPF"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={fun_senha}
        onChangeText={setFunSenha}
        placeholder="Digite a senha"
        secureTextEntry
      />
      <Text style={styles.label}>Função</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={fun_funcao}
          onValueChange={(itemValue) => setFunFuncao(itemValue)}
        >
          <Picker.Item label="Vendedor" value="vendedor" />
          <Picker.Item label="Gerente" value="gerente" />
        </Picker>
      </View>
      <Button title="Cadastrar Funcionário" onPress={handleCadastro} />
    </View>
  );
};

export default CadastroFuncionarioScreen;
