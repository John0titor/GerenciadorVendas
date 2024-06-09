// screens/CadastroProdutoScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function CadastroProdutoScreen() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const cadastrarProduto = async () => {
    try {
      const response = await axios.post('http://192.168.3.246:3000/produtos', {
        pro_descricao: descricao,
        pro_valor: parseFloat(valor),
        pro_quantidade: parseInt(quantidade, 10),
      });
      if (response.data) {
        alert('Produto cadastrado com sucesso');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar produto');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      <Button title="Cadastrar Produto" onPress={cadastrarProduto} />
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
