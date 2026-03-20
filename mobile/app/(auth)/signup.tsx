import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';

import { GlassCard } from '@/src/components/glass-card';
import { GradientButton } from '@/src/components/gradient-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { TextField } from '@/src/components/text-field';
import { useAuth } from '@/src/providers/auth-provider';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    setFeedback('');

    try {
      const result = await signUp({ displayName, email, password });
      setFeedback(
        result.needsEmailConfirmation
          ? 'Cuenta creada. Revisa tu correo para confirmar el acceso.'
          : 'Cuenta creada. Ya puedes entrar a CreatorOS Mobile.'
      );
    } catch (nextError) {
      setFeedback(nextError instanceof Error ? nextError.message : 'No pudimos crear la cuenta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      heading="Crear cuenta"
      subheading="Empieza tu version movil nativa de CreatorOS y deja de perder ideas por dispersion.">
      <GlassCard>
        <View style={{ gap: 14 }}>
          <TextField
            label="Nombre visible"
            onChangeText={setDisplayName}
            placeholder="Rocka"
            value={displayName}
          />
          <TextField
            autoCapitalize="none"
            keyboardType="email-address"
            label="Email"
            onChangeText={setEmail}
            placeholder="tu@email.com"
            value={email}
          />
          <TextField
            label="Password"
            onChangeText={setPassword}
            placeholder="Crea un password"
            secureTextEntry
            value={password}
          />
          {feedback ? <Text style={{ color: '#9CA7C6', lineHeight: 20 }}>{feedback}</Text> : null}
          <GradientButton loading={loading} onPress={handleSignup}>
            Crear cuenta
          </GradientButton>
        </View>
      </GlassCard>
      <Link href="/(auth)/login" style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
        Ya tengo cuenta
      </Link>
    </ScreenShell>
  );
}
