import React, { useContext, useState } from 'react';
import { ScrollView, Text, View, Button, KeyboardAvoidingView } from 'react-native';
import Checkbox from 'expo-checkbox';
import { SessionContext } from '../context/SessionContext';
import { RegistrationContext } from '../context/RegistrationContext';
import { registerDriver } from '../services/driverService';
import { isRtmRequired } from '../utils/validators';
import { COMMISSION_RATE } from '../config/pricing';
import FormField from '../components/FormField';
import DatePickerField from '../components/DatePickerField';
import ImagePickerField from '../components/ImagePickerField';

export default function DocumentsScreen() {
  const { setApprovalStatus, setDriver, language, t } =
    useContext(SessionContext);
  const {
    forms,
    setField,
    touch,
    setAndTouch,
    getError,
    isRegistrationValid,
    emailTaken,
    setEmailTaken,
  } = useContext(RegistrationContext);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const form = forms.documents;
  const set = (field, value) => setField('documents', field, value);
  const blur = (field) => touch('documents', field);
  const setSel = (field, value) => setAndTouch('documents', field, value);

  const errorText = (field) => {
    const key = getError('documents', field);
    return key ? t.errors[key] : '';
  };

  const rtmRequired = isRtmRequired(forms.vehicle.year);

  // Porcentaje leído de pricing.js
  const commissionPercent = parseFloat((COMMISSION_RATE * 100).toFixed(2));
  const termsText = t.documents.termsText.replace('{rate}', String(commissionPercent));

  const handleRegister = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const id = await registerDriver({
        personal: forms.personal,
        vehicle: forms.vehicle,
        documents: forms.documents,
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

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
          {t.documents.title}
        </Text>

        <FormField
          label={t.documents.licenseNumber}
          value={form.licenseNumber}
          onChangeText={(text) => set('licenseNumber', text)}
          onBlur={() => blur('licenseNumber')}
          error={errorText('licenseNumber')}
        />

        <ImagePickerField
          label={t.documents.licensePhoto}
          value={form.licensePhoto}
          onChange={(uri) => setSel('licensePhoto', uri)}
          cameraText={t.documents.camera}
          galleryText={t.documents.gallery}
          permissionText={t.documents.permission}
          error={errorText('licensePhoto')}
        />

        <DatePickerField
          label={t.documents.licenseExpiry}
          value={form.licenseExpiry}
          onChange={(date) => setSel('licenseExpiry', date)}
          placeholder={t.documents.selectDate}
          error={errorText('licenseExpiry')}
        />

        <ImagePickerField
          label={t.documents.soatPhoto}
          value={form.soatPhoto}
          onChange={(uri) => setSel('soatPhoto', uri)}
          cameraText={t.documents.camera}
          galleryText={t.documents.gallery}
          permissionText={t.documents.permission}
          error={errorText('soatPhoto')}
        />

        <DatePickerField
          label={t.documents.soatExpiry}
          value={form.soatExpiry}
          onChange={(date) => setSel('soatExpiry', date)}
          placeholder={t.documents.selectDate}
          error={errorText('soatExpiry')}
        />

        {rtmRequired && (
          <>
            <ImagePickerField
              label={t.documents.rtmPhoto}
              value={form.rtmPhoto}
              onChange={(uri) => setSel('rtmPhoto', uri)}
              cameraText={t.documents.camera}
              galleryText={t.documents.gallery}
              permissionText={t.documents.permission}
              error={errorText('rtmPhoto')}
            />

            <DatePickerField
              label={t.documents.rtmExpiry}
              value={form.rtmExpiry}
              onChange={(date) => setSel('rtmExpiry', date)}
              placeholder={t.documents.selectDate}
              error={errorText('rtmExpiry')}
            />
          </>
        )}

        <FormField
          label={t.documents.mercadoPagoEmail}
          value={form.mercadoPagoEmail}
          onChangeText={(text) => set('mercadoPagoEmail', text)}
          onBlur={() => blur('mercadoPagoEmail')}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errorText('mercadoPagoEmail')}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Checkbox
            value={form.termsAccepted}
            onValueChange={(value) => setSel('termsAccepted', value)}
          />
          <Text style={{ marginLeft: 8, flex: 1 }}>{termsText}</Text>
        </View>
        {errorText('termsAccepted') ? (
          <Text style={{ color: '#d32f2f', fontSize: 12, marginBottom: 12 }}>
            {errorText('termsAccepted')}
          </Text>
        ) : null}

        {emailTaken ? (
          <Text style={{ color: '#d32f2f', marginVertical: 8 }}>
            {t.errors.emailTaken}
          </Text>
        ) : null}
        {submitError ? (
          <Text style={{ color: '#d32f2f', marginVertical: 8 }}>{submitError}</Text>
        ) : null}

        <Button
          title={t.documents.simulateRegister}
          onPress={handleRegister}
          disabled={!isRegistrationValid() || submitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}