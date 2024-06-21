import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Button, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { commonStyles } from '../styles/common';
import config from '../config';

const VendaListScreen = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para o carregamento
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { authToken } = useAuth();

  const fetchVendas = async () => {
    setLoading(true);
    try {
      const response = await fetch(config.API_URL+'/vendas', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setVendas(data);
      } else {
        console.error('Erro ao buscar vendas:', response.status);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchVendas();
    }, [authToken])
  );

  const handleVendaPress = (venda) => {
    setSelectedVenda(venda);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVendaPress(item)}>
      <View style={styles.vendaItem}>
        <Text style={commonStyles.label}>Código da Venda: {item.ven_codigo}</Text>
        <Text style={styles.vendaText}>Horário: {new Date(item.ven_horario).toLocaleString()}</Text>
        <Text style={styles.vendaText}>Funcionário: {item.funcionario_nome}</Text>
        <Text style={styles.vendaText}>Total: R$ {item.ven_valor_total}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      <Spinner visible={loading} textContent={'Carregando...'} textStyle={styles.spinnerTextStyle} />
      <FlatList
        data={vendas}
        renderItem={renderItem}
        keyExtractor={(item) => item.ven_codigo.toString()}
      />
      {selectedVenda && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalhes da Venda</Text>
              <Text style={styles.modalText}>Código da Venda: {selectedVenda.ven_codigo}</Text>
              <Text style={styles.modalText}>Horário: {new Date(selectedVenda.ven_horario).toLocaleString()}</Text>
              <Text style={styles.modalText}>Funcionário: {selectedVenda.funcionario_nome}</Text>
              <Text style={styles.modalText}>Total: R$ {selectedVenda.ven_valor_total}</Text>
              <Text style={styles.modalTitle}>Itens</Text>
              <FlatList
                data={selectedVenda.itens}
                renderItem={({ item }) => (
                  <View style={styles.itemDetail}>
                    <Text style={styles.modalText}>Produto: {item.pro_descricao}</Text>
                    <Text style={styles.modalText}>Quantidade: {item.item_quantidade}</Text>
                    <Text style={styles.modalText}>Valor: R$ {item.item_valor}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <Button title="Fechar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  vendaItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  vendaText: {
    fontSize: 16,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  itemDetail: {
    marginBottom: 10,
  },
});

export default VendaListScreen;
