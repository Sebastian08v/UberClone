import React, { useContext, useState } from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { SessionContext } from '../context/SessionContext';
import { RegistrationContext } from '../context/RegistrationContext';
import { registerDriver } from '../services/driverService';
import FormField from '../components/FormField';
import DropdownField from '../components/DropdownField';
import DatePickerField from '../components/DatePickerField';
import ImagePickerField from '../components/ImagePickerField';

export default function PersonalDataScreen() {
  const { setApprovalStatus, setDriver, language, changeLanguage, t } =
    useContext(SessionContext);
  const {
    forms,
    setField,
    touch,
    setAndTouch,
    getError,
    isRegistrationValid,
    touchAll,
  } = useContext(RegistrationContext);

  const [submitting, setSubmitting] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const form = forms.personal;
  const set = (field, value) => setField('personal', field, value);
  const blur = (field) => touch('personal', field);
  const setSel = (field, value) => setAndTouch('personal', field, value);

  const errorText = (field) => {
    const key = getError('personal', field);
    return key ? t.errors[key] : '';
  };

  const handleRegister = async () => {
    setSubmitError('');
    if (!isRegistrationValid()) {
      touchAll();
      return;
    }
    setSubmitting(true);
    try {
      const id = await registerDriver({
        personal: forms.personal,
        vehicle: forms.vehicle,
        language,
      });
      setDriver({ id });
      setApprovalStatus('pending');
    } catch (error) {
      if (error.message === 'emailTaken') {
        setEmailTaken(true);
      } else {
        setSubmitError(t.errors.registerFailed);
      }
    } finally {
      setSubmitting(false);
    }
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

      {submitError ? (
        <Text style={{ color: '#d32f2f', marginBottom: 8 }}>{submitError}</Text>
      ) : null}

      <Button
        title={t.personalData.simulateRegister}
        onPress={handleRegister}
        disabled={submitting}
      />
    </ScrollView>
  );
}