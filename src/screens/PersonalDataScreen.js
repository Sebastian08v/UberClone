import React, { useContext, useState } from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';
import FormField from '../components/FormField';
import DropdownField from '../components/DropdownField';
import DatePickerField from '../components/DatePickerField';
import ImagePickerField from '../components/ImagePickerField';
import {required,validateFullName,validateIdNumber,validatePhone,validateBirthDate,validateEmail} from '../utils/validators';

const initialForm = {
  photo: '',
  fullName: '',
  idNumber: '',
  phone: '',
  birthDate: null,
  gender: '',
  email: '',
};

const validators = {
  photo: required,
  fullName: validateFullName,
  idNumber: validateIdNumber,
  phone: validatePhone,
  birthDate: validateBirthDate,
  gender: required,
  email: validateEmail,
};

export default function PersonalDataScreen() {
  const { setApprovalStatus, language, changeLanguage, t } =
    useContext(SessionContext);
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const touch = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // Para selectores (foto, fecha, lista): se marca como tocado al cambiar
  const setAndTouch = (field, value) => {
    setField(field, value);
    touch(field);
  };

  // Devuelve el texto del error solo si el campo ya fue tocado
  const errorText = (field) => {
    if (!touched[field]) return '';
    const key = validators[field](form[field]);
    return key ? t.errors[key] : '';
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
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
        {t.personalData.title}
      </Text>

      <ImagePickerField
        label={t.personalData.photo}
        value={form.photo}
        onChange={(uri) => setAndTouch('photo', uri)}
        cameraText={t.personalData.camera}
        galleryText={t.personalData.gallery}
        permissionText={t.personalData.permission}
        error={errorText('photo')}
      />

      <FormField
        label={t.personalData.fullName}
        value={form.fullName}
        onChangeText={(text) => setField('fullName', text)}
        onBlur={() => touch('fullName')}
        maxLength={50}
        error={errorText('fullName')}
      />

      <FormField
        label={t.personalData.idNumber}
        value={form.idNumber}
        onChangeText={(text) => setField('idNumber', text)}
        onBlur={() => touch('idNumber')}
        keyboardType="numeric"
        maxLength={10}
        error={errorText('idNumber')}
      />

      <FormField
        label={t.personalData.phone}
        value={form.phone}
        onChangeText={(text) => setField('phone', text)}
        onBlur={() => touch('phone')}
        keyboardType="phone-pad"
        maxLength={10}
        error={errorText('phone')}
      />

      <DatePickerField
        label={t.personalData.birthDate}
        value={form.birthDate}
        onChange={(date) => setAndTouch('birthDate', date)}
        placeholder={t.personalData.selectDate}
        error={errorText('birthDate')}
      />

      <DropdownField
        label={t.personalData.gender}
        value={form.gender}
        onValueChange={(value) => setAndTouch('gender', value)}
        options={genderOptions}
        placeholder={t.personalData.select}
        error={errorText('gender')}
      />

      <FormField
        label={t.personalData.email}
        value={form.email}
        onChangeText={(text) => setField('email', text)}
        onBlur={() => touch('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errorText('email')}
      />

      <DropdownField
        label={t.personalData.language}
        value={language}
        onValueChange={changeLanguage}
        options={languageOptions}
        placeholder={t.personalData.select}
      />

      <Button
        title={t.personalData.simulateRegister}
        onPress={() => setApprovalStatus('pending')}
      />
    </ScrollView>
  );
}