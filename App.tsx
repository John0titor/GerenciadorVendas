import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [produtos, setProdutos] = useState([]); // Lista de produtos da venda
  const [produtoSelecionado, setProdutoSelecionado] = useState(''); // Produto atual
  const [quantidade, setQuantidade] = useState('');
  const [listaDeProdutos, setListaDeProdutos] = useState([
    { id: '1', nome: 'Produto 1', preco: 10 },
    { id: '2', nome: 'Produto 2', preco: 20 },
    { id: '3', nome: 'Produto 3', preco: 30 },
  ]); // Lista de produtos disponíveis

  const adicionarProduto = () => {
    const produto = listaDeProdutos.find(p => p.nome.toLowerCase() === produtoSelecionado.toLowerCase());
    if (produto && quantidade > 0) {
      setProdutos([...produtos, { ...produto, quantidade: parseInt(quantidade) }]);
      setProdutoSelecionado('');
      setQuantidade('');
    }
  };

  const calcularTotal = () => {
    return produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
  };

  const finalizarVenda = () => {
    // Lógica para finalizar a venda (ex: salvar no banco de dados, limpar o carrinho, etc.)
    console.log('Venda finalizada:', produtos);
    setProdutos([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Venda</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Buscar produto"
        value={produtoSelecionado}
        onChangeText={setProdutoSelecionado}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      
      <Button title="Adicionar Produto" onPress={adicionarProduto} />

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.nome} - {item.quantidade} x {item.preco} = {item.quantidade * item.preco}</Text>
          </View>
        )}
      />

      <Text style={styles.total}>Total: R$ {calcularTotal()}</Text>

      <Button title="Finalizar Venda" onPress={finalizarVenda} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  productItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
});

