import React, { useContext, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SessionContext } from '../context/SessionContext';
import FormField from '../components/FormField';
import DropdownField from '../components/DropdownField';
import ImagePickerField from '../components/ImagePickerField';
import {
  required,
  validatePlate,
  validateMaxLength,
  validateYear,
  validateCapacity,
} from '../utils/validators';

const initialForm = {
  category: '',
  plate: '',
  brand: '',
  model: '',
  year: '',
  color: '',
  capacity: '',
  photo: '',
};

// Cada validador recibe todo el formulario, así la capacidad puede leer la categoría
const validators = {
  category: (f) => required(f.category),
  plate: (f) => validatePlate(f.plate),
  brand: (f) => validateMaxLength(f.brand, 30),
  model: (f) => validateMaxLength(f.model, 30),
  year: (f) => validateYear(f.year),
  color: (f) => required(f.color),
  capacity: (f) => validateCapacity(f.capacity, f.category),
  photo: (f) => required(f.photo),
};

export default function VehicleScreen() {
  const { t } = useContext(SessionContext);
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const touch = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // Para selectores (foto, listas): se marca como tocado al cambiar
  const setAndTouch = (field, value) => {
    setField(field, value);
    touch(field);
  };

  // Devuelve el texto del error solo si el campo ya fue tocado
  const errorText = (field) => {
    if (!touched[field]) return '';
    const key = validators[field](form);
    return key ? t.errors[key] : '';
  };

  const categoryOptions = [
    { label: t.vehicle.economy, value: 'economy' },
    { label: t.vehicle.xl, value: 'xl' },
    { label: t.vehicle.premium, value: 'premium' },
  ];

  const colorOptions = [
    { label: t.vehicle.white, value: 'white' },
    { label: t.vehicle.black, value: 'black' },
    { label: t.vehicle.gray, value: 'gray' },
    { label: t.vehicle.silver, value: 'silver' },
    { label: t.vehicle.red, value: 'red' },
    { label: t.vehicle.blue, value: 'blue' },
    { label: t.vehicle.other, value: 'other' },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
        {t.vehicle.title}
      </Text>

      <DropdownField
        label={t.vehicle.category}
        value={form.category}
        onValueChange={(value) => setAndTouch('category', value)}
        options={categoryOptions}
        placeholder={t.vehicle.select}
        error={errorText('category')}
      />

      <FormField
        label={t.vehicle.plate}
        value={form.plate}
        onChangeText={(text) => setField('plate', text.toUpperCase())}
        onBlur={() => touch('plate')}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={6}
        error={errorText('plate')}
      />

      <FormField
        label={t.vehicle.brand}
        value={form.brand}
        onChangeText={(text) => setField('brand', text)}
        onBlur={() => touch('brand')}
        maxLength={30}
        error={errorText('brand')}
      />

      <FormField
        label={t.vehicle.model}
        value={form.model}
        onChangeText={(text) => setField('model', text)}
        onBlur={() => touch('model')}
        maxLength={30}
        error={errorText('model')}
      />

      <FormField
        label={t.vehicle.year}
        value={form.year}
        onChangeText={(text) => setField('year', text)}
        onBlur={() => touch('year')}
        keyboardType="numeric"
        maxLength={4}
        error={errorText('year')}
      />

      <DropdownField
        label={t.vehicle.color}
        value={form.color}
        onValueChange={(value) => setAndTouch('color', value)}
        options={colorOptions}
        placeholder={t.vehicle.select}
        error={errorText('color')}
      />

      <FormField
        label={t.vehicle.capacity}
        value={form.capacity}
        onChangeText={(text) => setField('capacity', text)}
        onBlur={() => touch('capacity')}
        keyboardType="numeric"
        maxLength={2}
        error={errorText('capacity')}
      />

      <ImagePickerField
        label={t.vehicle.photo}
        value={form.photo}
        onChange={(uri) => setAndTouch('photo', uri)}
        cameraText={t.vehicle.camera}
        galleryText={t.vehicle.gallery}
        permissionText={t.vehicle.permission}
        error={errorText('photo')}
      />
    </ScrollView>
  );
}
