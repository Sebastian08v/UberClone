// AI-assisted: see docs/AI_LOG.md
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View, Text, Button, ScrollView, ActivityIndicator, KeyboardAvoidingView,
} from 'react-native';
import { SessionContext } from '../context/SessionContext';
import { getDriverProfile, updateDriverProfile } from '../services/driverService';
import {
  required, validateFullName, validateIdNumber, validatePhone, validateBirthDate,
  validateEmail, validatePlate, validateMaxLength, validateYear, validateCapacity,
  validateExpiryDate, isRtmRequired,
} from '../utils/validators';
import FormField from '../components/FormField';
import DropdownField from '../components/DropdownField';
import DatePickerField from '../components/DatePickerField';
import ImagePickerField from '../components/ImagePickerField';

// Firestore guarda las fechas como Timestamp
const toDate = (v) => (v?.toDate ? v.toDate() : v ? new Date(v) : null);

const profileToForm = (d) => ({
  profilePhoto: d.profilePhotoUrl,
  fullName: d.fullName,
  idNumber: d.idNumber,
  phone: d.phone,
  birthDate: toDate(d.birthDate),
  gender: d.gender,
  email: d.email,
  category: d.vehicle?.category,
  plate: d.vehicle?.plate,
  brand: d.vehicle?.brand,
  model: d.vehicle?.model,
  year: String(d.vehicle?.year ?? ''),
  color: d.vehicle?.color,
  capacity: String(d.vehicle?.capacity ?? ''),
  vehiclePhoto: d.vehicle?.photoUrl,
  licenseNumber: d.documents?.license?.number,
  licensePhoto: d.documents?.license?.photoUrl,
  licenseExpiry: toDate(d.documents?.license?.expiryDate),
  soatPhoto: d.documents?.soat?.photoUrl,
  soatExpiry: toDate(d.documents?.soat?.expiryDate),
  rtmPhoto: d.documents?.technicalReview?.photoUrl ?? null,
  rtmExpiry: toDate(d.documents?.technicalReview?.expiryDate),
  mercadoPagoEmail: d.mercadoPagoEmail,
});

export default function ProfileSettingsScreen() {
  const { driver, approvalStatus, language, changeLanguage, signOut, t } =
    useContext(SessionContext);

  const [f, setF] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [emailTaken, setEmailTaken] = useState(false);

  useEffect(() => {
    if (!driver?.id) return;
    getDriverProfile(driver.id)
      .then((d) => d && setF(profileToForm(d)))
      .catch((e) => console.log('Profile error:', e))
      .finally(() => setLoading(false));
  }, [driver?.id]);

  const set = (field, value) => {
    setMessage('');
    setF((prev) => ({ ...prev, [field]: value }));
  };

  // Mismas reglas del registro
  const errors = useMemo(() => {
    if (!f) return {};
    const rtm = isRtmRequired(f.year);
    return {
      profilePhoto: required(f.profilePhoto),
      fullName: validateFullName(f.fullName),
      idNumber: validateIdNumber(f.idNumber),
      phone: validatePhone(f.phone),
      birthDate: validateBirthDate(f.birthDate),
      gender: required(f.gender),
      email: validateEmail(f.email),
      category: required(f.category),
      plate: validatePlate(f.plate),
      brand: validateMaxLength(f.brand, 30),
      model: validateMaxLength(f.model, 30),
      year: validateYear(f.year),
      color: required(f.color),
      capacity: validateCapacity(f.capacity, f.category),
      vehiclePhoto: required(f.vehiclePhoto),
      licenseNumber: required(f.licenseNumber),
      licensePhoto: required(f.licensePhoto),
      licenseExpiry: validateExpiryDate(f.licenseExpiry),
      soatPhoto: required(f.soatPhoto),
      soatExpiry: validateExpiryDate(f.soatExpiry),
      rtmPhoto: rtm ? required(f.rtmPhoto) : null,
      rtmExpiry: rtm ? validateExpiryDate(f.rtmExpiry) : null,
      mercadoPagoEmail: validateEmail(f.mercadoPagoEmail),
    };
  }, [f]);

  const isValid = Object.values(errors).every((e) => !e);
  const errorText = (field) => (errors[field] ? t.errors[errors[field]] : '');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateDriverProfile(driver.id, f, language);
      setMessage(t.profile.saved);
    } catch (e) {
      if (e.message === 'emailTaken') setEmailTaken(true);
      else setMessage(t.errors.registerFailed);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!f) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t.profile.loadFailed}</Text>
        <Button title={t.profile.signOut} onPress={signOut} />
      </View>
    );
  }

  const img = (field, label, tx) => (
    <ImagePickerField
      label={label}
      value={f[field]}
      onChange={(uri) => set(field, uri)}
      cameraText={tx.camera}
      galleryText={tx.gallery}
      permissionText={tx.permission}
      error={errorText(field)}
    />
  );

  const categoryOptions = [
    { label: t.vehicle.economy, value: 'economy' },
    { label: t.vehicle.xl, value: 'xl' },
    { label: t.vehicle.premium, value: 'premium' },
  ];
  const colorOptions = ['white', 'black', 'gray', 'silver', 'red', 'blue', 'other'].map(
    (c) => ({ label: t.vehicle[c], value: c })
  );
  const genderOptions = [
    { label: t.personalData.genderFemale, value: 'F' },
    { label: t.personalData.genderMale, value: 'M' },
    { label: t.personalData.genderOther, value: 'O' },
  ];
  const languageOptions = [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' },
  ];
  const rtmRequired = isRtmRequired(f.year);
  const sectionStyle = { fontSize: 18, fontWeight: '700', marginVertical: 16 };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ marginBottom: 8 }}>
          {t.home.status}: {approvalStatus}
        </Text>

        <DropdownField
          label={t.language}
          value={language}
          onValueChange={changeLanguage}
          options={languageOptions}
          placeholder={t.personalData.select}
        />

        {/* Datos personales */}
        <Text style={sectionStyle}>{t.tabs.personalData}</Text>
        {img('profilePhoto', t.personalData.photo, t.personalData)}
        <FormField label={t.personalData.fullName} value={f.fullName}
          onChangeText={(v) => set('fullName', v)} maxLength={50}
          error={errorText('fullName')} />
        <FormField label={t.personalData.idNumber} value={f.idNumber}
          onChangeText={(v) => set('idNumber', v)} keyboardType="numeric"
          maxLength={10} error={errorText('idNumber')} />
        <FormField label={t.personalData.phone} value={f.phone}
          onChangeText={(v) => set('phone', v)} keyboardType="phone-pad"
          maxLength={10} error={errorText('phone')} />
        <DatePickerField label={t.personalData.birthDate} value={f.birthDate}
          onChange={(d) => set('birthDate', d)} placeholder={t.personalData.selectDate}
          error={errorText('birthDate')} />
        <DropdownField label={t.personalData.gender} value={f.gender}
          onValueChange={(v) => set('gender', v)} options={genderOptions}
          placeholder={t.personalData.select} error={errorText('gender')} />
        <FormField label={t.personalData.email} value={f.email}
          onChangeText={(v) => { set('email', v); setEmailTaken(false); }}
          keyboardType="email-address" autoCapitalize="none"
          error={emailTaken ? t.errors.emailTaken : errorText('email')} />

        {/* Vehículo */}
        <Text style={sectionStyle}>{t.tabs.vehicle}</Text>
        <DropdownField label={t.vehicle.category} value={f.category}
          onValueChange={(v) => set('category', v)} options={categoryOptions}
          placeholder={t.vehicle.select} error={errorText('category')} />
        <FormField label={t.vehicle.plate} value={f.plate}
          onChangeText={(v) => set('plate', v.toUpperCase())} autoCapitalize="characters"
          maxLength={6} error={errorText('plate')} />
        <FormField label={t.vehicle.brand} value={f.brand}
          onChangeText={(v) => set('brand', v)} maxLength={30} error={errorText('brand')} />
        <FormField label={t.vehicle.model} value={f.model}
          onChangeText={(v) => set('model', v)} maxLength={30} error={errorText('model')} />
        <FormField label={t.vehicle.year} value={f.year}
          onChangeText={(v) => set('year', v)} keyboardType="numeric" maxLength={4}
          error={errorText('year')} />
        <DropdownField label={t.vehicle.color} value={f.color}
          onValueChange={(v) => set('color', v)} options={colorOptions}
          placeholder={t.vehicle.select} error={errorText('color')} />
        <FormField label={t.vehicle.capacity} value={f.capacity}
          onChangeText={(v) => set('capacity', v)} keyboardType="numeric"
          error={errorText('capacity')} />
        {img('vehiclePhoto', t.vehicle.photo, t.vehicle)}

        {/* Documentos */}
        <Text style={sectionStyle}>{t.tabs.documents}</Text>
        <FormField label={t.documents.licenseNumber} value={f.licenseNumber}
          onChangeText={(v) => set('licenseNumber', v)} error={errorText('licenseNumber')} />
        {img('licensePhoto', t.documents.licensePhoto, t.documents)}
        <DatePickerField label={t.documents.licenseExpiry} value={f.licenseExpiry}
          onChange={(d) => set('licenseExpiry', d)} placeholder={t.documents.selectDate}
          error={errorText('licenseExpiry')} />
        {img('soatPhoto', t.documents.soatPhoto, t.documents)}
        <DatePickerField label={t.documents.soatExpiry} value={f.soatExpiry}
          onChange={(d) => set('soatExpiry', d)} placeholder={t.documents.selectDate}
          error={errorText('soatExpiry')} />
        {rtmRequired && (
          <>
            {img('rtmPhoto', t.documents.rtmPhoto, t.documents)}
            <DatePickerField label={t.documents.rtmExpiry} value={f.rtmExpiry}
              onChange={(d) => set('rtmExpiry', d)} placeholder={t.documents.selectDate}
              error={errorText('rtmExpiry')} />
          </>
        )}
        <FormField label={t.documents.mercadoPagoEmail} value={f.mercadoPagoEmail}
          onChangeText={(v) => set('mercadoPagoEmail', v)} keyboardType="email-address"
          autoCapitalize="none" error={errorText('mercadoPagoEmail')} />

        {message ? <Text style={{ marginBottom: 8 }}>{message}</Text> : null}
        <Button
          title={saving ? '...' : t.profile.save}
          onPress={handleSave}
          disabled={!isValid || saving}
        />
        <View style={{ marginTop: 16 }}>
          <Button title={t.profile.signOut} color="#c62828" onPress={signOut} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}