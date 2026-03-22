import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchMobilok, fetchGyartok, deleteMobil } from '../api/api';
import EditModal from '../components/EditModal';

export default function HomeScreen() {
  const [mobilok, setMobilok] = useState([]);
  const [gyartok, setGyartok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingMobil, setEditingMobil] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    try {
      const [mobilokData, gyartokData] = await Promise.all([
        fetchMobilok(),
        fetchGyartok(),
      ]);
      setMobilok(mobilokData);
      setGyartok(gyartokData);
    } catch (error) {
      Alert.alert('Hiba', error.message || 'Nem sikerült betölteni az adatokat');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDelete = (telefon) => {
    Alert.alert(
      'Törlés megerősítése',
      `Biztosan törli a(z) "${telefon.nev}" telefont?`,
      [
        { text: 'Mégse', style: 'cancel' },
        {
          text: 'Törlés',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMobil(telefon._id);
              Alert.alert('Siker', 'Mobiltelefon sikeresen törölve');
              loadData();
            } catch (error) {
              Alert.alert('Hiba', error.message || 'Hiba a törlés során');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (telefon) => {
    setEditingMobil({ ...telefon });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingMobil(null);
  };

  const handleModalSave = () => {
    setShowModal(false);
    setEditingMobil(null);
    loadData();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardAccent} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nev}</Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>ID: </Text>
          {item._id}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Ár: </Text>
          <Text style={styles.price}>{item.ar} Ft</Text>
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Gyártó: </Text>
          {item.gyartId ? item.gyartId.nev : 'Ismeretlen'}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnEdit]}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.btnText}>Módosítás</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnDelete]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.btnText}>Törlés</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Adatok betöltése...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mobilok}
        keyExtractor={(item) => String(item._id)}
        renderItem={renderItem}
        contentContainerStyle={
          mobilok.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Nincsenek telefonok az adatbázisban
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
      />
      <EditModal
        visible={showModal}
        mobil={editingMobil}
        gyartok={gyartok}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2ff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2ff',
  },
  loadingText: {
    marginTop: 10,
    color: '#667eea',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyCard: {
    backgroundColor: '#e8eaff',
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyText: {
    color: '#5c6bc0',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccent: {
    width: 5,
    backgroundColor: '#667eea',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnEdit: {
    backgroundColor: '#ffc107',
  },
  btnDelete: {
    backgroundColor: '#dc3545',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
