import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { commonStyles as styles } from '../styles/common';
import config from '../config';

const CadastroProdutoScreen = () => {
  const [pro_descricao, setProDescricao] = useState('');
  const [pro_valor, setProValor] = useState('');
  const [pro_quantidade, setProQuantidade] = useState('');
  const { authToken } = useAuth();

  const handleCadastroProduto = async () => {
    try {
      const response = await fetch(config.API_URL+'/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Seu token de autorização
        },
        body: JSON.stringify({ pro_descricao, pro_valor, pro_quantidade  }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso');
      } else {
        const data = await response.json();
        Alert.alert('Erro', data.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao cadastrar produto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={pro_descricao}
        onChangeText={setProDescricao}
        placeholder="Digite a descrição do produto"
      />
      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        value={pro_valor}
        onChangeText={setProValor}
        placeholder="Digite o valor do produto"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={pro_quantidade}
        onChangeText={setProQuantidade}
        placeholder="Digite a quantidade do produto"
        keyboardType="numeric"
      />
      <Button title="Cadastrar Produto" onPress={handleCadastroProduto} />
    </View>
  );
};

export default CadastroProdutoScreen;
