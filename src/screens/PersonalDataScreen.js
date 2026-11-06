import React, { useContext } from 'react';
import { ScrollView, Text, Button, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SessionContext } from '../context/SessionContext';
import { RegistrationContext } from '../context/RegistrationContext';
import FormField from '../components/FormField';
import DropdownField from '../components/DropdownField';
import DatePickerField from '../components/DatePickerField';
import ImagePickerField from '../components/ImagePickerField';

export default function PersonalDataScreen() {
  const navigation = useNavigation();
  const { language, changeLanguage, t } = useContext(SessionContext);
  const {
    forms,
    setField,
    touch,
    setAndTouch,
    touchSection,
    getError,
    emailTaken,
    setEmailTaken,
  } = useContext(RegistrationContext);

  const form = forms.personal;
  const set = (field, value) => setField('personal', field, value);
  const blur = (field) => touch('personal', field);
  const setSel = (field, value) => setAndTouch('personal', field, value);

  const errorText = (field) => {
    const key = getError('personal', field);
    return key ? t.errors[key] : '';
  };

  // Navegación libre: avanza siempre y deja visibles los errores de esta pestaña
  const handleContinue = () => {
    touchSection('personal');
    const state = navigation.getState();
    const next = state.routes[state.index + 1];
    if (next) navigation.navigate(next.name);
  };

  const genderOptions = [
    { label: t.personalData.genderFemale, value: 'F' },
    { label: t.personalData.genderMale, value: 'M' },
    { label: t.personalData.genderOther, value: 'O' },
  ];

  const languageOptions = [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' },
  ];

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
          {t.personalData.title}
        </Text>

        <ImagePickerField
          label={t.personalData.photo}
          value={form.photo}
          onChange={(uri) => setSel('photo', uri)}
          cameraText={t.personalData.camera}
          galleryText={t.personalData.gallery}
          permissionText={t.personalData.permission}
          error={errorText('photo')}
        />

        <FormField
          label={t.personalData.fullName}
          value={form.fullName}
          onChangeText={(text) => set('fullName', text)}
          onBlur={() => blur('fullName')}
          maxLength={50}
          error={errorText('fullName')}
        />

        <FormField
          label={t.personalData.idNumber}
          value={form.idNumber}
          onChangeText={(text) => set('idNumber', text)}
          onBlur={() => blur('idNumber')}
          keyboardType="numeric"
          maxLength={10}
          error={errorText('idNumber')}
        />

        <FormField
          label={t.personalData.phone}
          value={form.phone}
          onChangeText={(text) => set('phone', text)}
          onBlur={() => blur('phone')}
          keyboardType="phone-pad"
          maxLength={10}
          error={errorText('phone')}
        />

        <DatePickerField
          label={t.personalData.birthDate}
          value={form.birthDate}
          onChange={(date) => setSel('birthDate', date)}
          placeholder={t.personalData.selectDate}
          error={errorText('birthDate')}
        />

        <DropdownField
          label={t.personalData.gender}
          value={form.gender}
          onValueChange={(value) => setSel('gender', value)}
          options={genderOptions}
          placeholder={t.personalData.select}
          error={errorText('gender')}
        />

        <FormField
          label={t.personalData.email}
          value={form.email}
          onChangeText={(text) => {
            set('email', text);
            setEmailTaken(false);
          }}
          onBlur={() => blur('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailTaken ? t.errors.emailTaken : errorText('email')}
        />

        <DropdownField
          label={t.personalData.language}
          value={language}
          onValueChange={changeLanguage}
          options={languageOptions}
          placeholder={t.personalData.select}
        />

        <Button title={t.registration.continue} onPress={handleContinue} />
      </ScrollView>
    </KeyboardAvoidingView> 
  );
}