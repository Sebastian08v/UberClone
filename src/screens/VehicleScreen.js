import React, { useContext } from 'react';
import { ScrollView, Text, Button, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SessionContext } from '../context/SessionContext';
import { RegistrationContext } from '../context/RegistrationContext';
import FormField from '../components/FormField';
import DropdownField from '../components/DropdownField';
import ImagePickerField from '../components/ImagePickerField';

export default function VehicleScreen() {
  const navigation = useNavigation();
  const { t } = useContext(SessionContext);
  const { forms, setField, touch, setAndTouch, touchSection, getError } =
    useContext(RegistrationContext);

  const form = forms.vehicle;
  const set = (field, value) => setField('vehicle', field, value);
  const blur = (field) => touch('vehicle', field);
  const setSel = (field, value) => setAndTouch('vehicle', field, value);

  const errorText = (field) => {
    const key = getError('vehicle', field);
    return key ? t.errors[key] : '';
  };

  // Navegación libre: avanza siempre y deja visibles los errores de esta pestaña
  const handleContinue = () => {
    touchSection('vehicle');
    const state = navigation.getState();
    const next = state.routes[state.index + 1];
    if (next) navigation.navigate(next.name);
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
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
          {t.vehicle.title}
        </Text>

        <DropdownField
          label={t.vehicle.category}
          value={form.category}
          onValueChange={(value) => setSel('category', value)}
          options={categoryOptions}
          placeholder={t.vehicle.select}
          error={errorText('category')}
        />

        <FormField
          label={t.vehicle.plate}
          value={form.plate}
          onChangeText={(text) => set('plate', text.toUpperCase())}
          onBlur={() => blur('plate')}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
          error={errorText('plate')}
        />

        <FormField
          label={t.vehicle.brand}
          value={form.brand}
          onChangeText={(text) => set('brand', text)}
          onBlur={() => blur('brand')}
          maxLength={30}
          error={errorText('brand')}
        />

        <FormField
          label={t.vehicle.model}
          value={form.model}
          onChangeText={(text) => set('model', text)}
          onBlur={() => blur('model')}
          maxLength={30}
          error={errorText('model')}
        />

        <FormField
          label={t.vehicle.year}
          value={form.year}
          onChangeText={(text) => set('year', text)}
          onBlur={() => blur('year')}
          keyboardType="numeric"
          maxLength={4}
          error={errorText('year')}
        />

        <DropdownField
          label={t.vehicle.color}
          value={form.color}
          onValueChange={(value) => setSel('color', value)}
          options={colorOptions}
          placeholder={t.vehicle.select}
          error={errorText('color')}
        />

        <FormField
          label={t.vehicle.capacity}
          value={form.capacity}
          onChangeText={(text) => set('capacity', text)}
          onBlur={() => blur('capacity')}
          keyboardType="numeric"
          maxLength={2}
          error={errorText('capacity')}
        />

        <ImagePickerField
          label={t.vehicle.photo}
          value={form.photo}
          onChange={(uri) => setSel('photo', uri)}
          cameraText={t.vehicle.camera}
          galleryText={t.vehicle.gallery}
          permissionText={t.vehicle.permission}
          error={errorText('photo')}
        />
        <Button title={t.registration.continue} onPress={handleContinue} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}