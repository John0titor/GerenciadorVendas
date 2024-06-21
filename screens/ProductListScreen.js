import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { commonStyles } from '../styles/common';
import config from '../config';

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { authToken } = useAuth();
  const { addToCart } = useCart();

  useFocusEffect(
    React.useCallback(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch(config.API_URL+'/products', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          } else {
            console.error('Erro ao buscar produtos:', response.status);
          }
        } catch (error) {
          console.error('Erro na requisição:', error);
        }
      };

      fetchProducts();

      return () => { /* Limpeza opcional (se necessário) */ };
    }, [authToken]) 
  );

  const handleAddToCart = (product) => {
    const quantity = quantities[product.pro_codigo] || 1;
    if (quantity <= product.pro_quantidade) {
      addToCart(product, quantity, true);
    } else {
      alert('Quantidade solicitada excede o estoque disponível');
    }
  };

  const handleQuantityChange = (productId, text) => {
    const quantity = text ? parseInt(text) : 0;
    if (!isNaN(quantity)) {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [productId]: quantity
      }));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productDetails}>
        <Text style={commonStyles.label}>{item.pro_descricao}</Text>
        <Text style={styles.productPrice}>R$ {item.pro_valor}</Text>
        <Text>Estoque disponível: {item.pro_quantidade}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantities[item.pro_codigo]?.toString() || ''}
          onChangeText={(text) => handleQuantityChange(item.pro_codigo, text)}
          placeholder="1"
        />
        <Button title="Adicionar ao Carrinho" onPress={() => handleAddToCart(item)} />
      </View>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.pro_codigo.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  quantityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    height: 40,
    width: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  productDetails: {
    flex: 1,
    paddingRight: 16,
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
});

export default ProductListScreen;
