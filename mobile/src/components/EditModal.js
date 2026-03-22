import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateMobil } from '../api/api';

export default function EditModal({ visible, mobil, gyartok, onClose, onSave }) {
  const [formData, setFormData] = useState({ nev: '', ar: '', gyartId: '' });

  useEffect(() => {
    if (mobil) {
      const gyartIdValue =
        typeof mobil.gyartId === 'object'
          ? String(mobil.gyartId._id)
          : String(mobil.gyartId || '');
      setFormData({
        nev: mobil.nev || '',
        ar: String(mobil.ar || ''),
        gyartId: gyartIdValue,
      });
    }
  }, [mobil]);

  const handleSave = async () => {
    if (!formData.nev || !formData.ar) {
      Alert.alert('Hiba', 'Kérjük, töltse ki az összes mezőt');
      return;
    }
    if (!formData.gyartId) {
      Alert.alert('Hiba', 'Kérjük, válasszon egy gyártót');
      return;
    }
    try {
      await updateMobil(mobil._id, {
        nev: formData.nev,
        ar: Number(formData.ar),
        gyartId: Number(formData.gyartId),
      });
      Alert.alert('Siker', 'Telefon sikeresen módosítva');
      onSave();
    } catch (error) {
      Alert.alert('Hiba', error.message || 'Hiba a módosítás során');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Telefon módosítása</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              {mobil && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>ID:</Text>
                    <TextInput
                      style={[styles.input, styles.inputDisabled]}
                      value={String(mobil._id)}
                      editable={false}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Mobiltelefon Neve:</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.nev}
                      onChangeText={(text) =>
                        setFormData({ ...formData, nev: text })
                      }
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Ár (Ft):</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.ar}
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        setFormData({ ...formData, ar: text })
                      }
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Gyártó:</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={formData.gyartId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gyartId: value })
                        }
                        style={styles.picker}
                      >
                        <Picker.Item label="-- Válasszon gyártót --" value="" />
                        {gyartok.map((g) => (
                          <Picker.Item
                            key={g._id}
                            label={g.nev}
                            value={String(g._id)}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerBtn, styles.cancelBtn]}
                onPress={onClose}
              >
                <Text style={styles.cancelBtnText}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerBtn, styles.saveBtn]}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>Mentés</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  modalHeader: {
    backgroundColor: '#667eea',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#e9ecef',
    color: '#666',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  cancelBtnText: {
    color: '#6c757d',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#667eea',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
