import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { commonStyles } from '../styles/common';
import config from '../config';

const CartScreen = () => {
  const { cartItems, removeFromCart } = useCart();
  const { authToken } = useAuth();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems.reduce((sum, item) => sum + (Number(item.pro_valor) * item.quantity), 0);
      setTotal(total);
    };

    calculateTotal();
  }, [cartItems]);

  const handleFinalizePurchase = async () => {
    try {
      const response = await fetch(config.API_URL+'/venda/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ cartItems }),
      });

      if (response.ok) {
        alert('Compra registrada com sucesso!');
        // Limpar o carrinho após a compra
        cartItems.forEach(item => removeFromCart(item.pro_codigo));
      } else {
        const error = await response.json();
        alert(`Erro ao registrar a compra: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
      alert('Erro ao finalizar a compra');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={commonStyles.label}>{item.pro_descricao}</Text>
      <Text style={styles.itemPrice}>R$ {item.pro_valor.toString()}</Text>
      <Text>Quantidade: {item.quantity}</Text>
      <Button title="Remover" onPress={() => removeFromCart(item.pro_codigo)} />
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.pro_codigo.toString()}
      />
      <Text style={styles.total}>Total: R$ {total.toFixed(2).toString()}</Text>
      <Button title="Finalizar Compra" onPress={handleFinalizePurchase} />
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default CartScreen;
