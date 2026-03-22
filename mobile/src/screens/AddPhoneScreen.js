import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchGyartok, addMobil } from '../api/api';

export default function AddPhoneScreen() {
  const [formData, setFormData] = useState({ _id: '', nev: '', ar: '', gyartId: '' });
  const [errors, setErrors] = useState({});
  const [gyartok, setGyartok] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGyartok()
      .then(setGyartok)
      .catch(() => Alert.alert('Hiba', 'Nem sikerült betölteni a gyártókat'));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData._id) newErrors._id = 'Kötelező kitölteni';
    if (!formData.nev) newErrors.nev = 'Kötelező kitölteni';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await addMobil({
        _id: Number(formData._id),
        nev: formData.nev,
        ar: formData.ar ? Number(formData.ar) : 0,
        gyartId: formData.gyartId ? Number(formData.gyartId) : undefined,
      });
      Alert.alert('Siker', 'Sikeres adatfelvétel');
      setFormData({ _id: '', nev: '', ar: '', gyartId: '' });
    } catch (error) {
      Alert.alert('Hiba', error.message || 'Hiba az adatfelvétel során');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Mobiltelefon Felvétel</Text>
          </View>
          <View style={styles.formBody}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>ID:</Text>
              <TextInput
                style={[styles.input, errors._id && styles.inputError]}
                placeholder="Adjon meg egy egyedi ID-t"
                keyboardType="numeric"
                value={formData._id}
                onChangeText={(text) => setFormData({ ...formData, _id: text })}
              />
              {errors._id && <Text style={styles.errorText}>{errors._id}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Telefon Neve:</Text>
              <TextInput
                style={[styles.input, errors.nev && styles.inputError]}
                placeholder="pl. iPhone 15 Pro"
                value={formData.nev}
                onChangeText={(text) => setFormData({ ...formData, nev: text })}
              />
              {errors.nev && <Text style={styles.errorText}>{errors.nev}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ár (Ft):</Text>
              <TextInput
                style={styles.input}
                placeholder="pl. 500000"
                keyboardType="numeric"
                value={formData.ar}
                onChangeText={(text) => setFormData({ ...formData, ar: text })}
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
                  {gyartok.map((gyarto) => (
                    <Picker.Item
                      key={gyarto._id}
                      label={gyarto.nev}
                      value={String(gyarto._id)}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Hozzáadás</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2ff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  formHeader: {
    backgroundColor: '#667eea',
    padding: 20,
  },
  formTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formBody: {
    padding: 20,
    gap: 4,
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
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
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
  submitBtn: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#a0aec0',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
