// screens/VendaScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function VendaScreen() {
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const registrarVenda = () => {
    // Lógica para registrar a venda
    alert('Venda registrada');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Produto"
        value={produto}
        onChangeText={setProduto}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
      />
      <Button title="Registrar Venda" onPress={registrarVenda} />
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
