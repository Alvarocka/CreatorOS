import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link, router } from 'expo-router';

import { GlassCard } from '@/src/components/glass-card';
import { GradientButton } from '@/src/components/gradient-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { TextField } from '@/src/components/text-field';
import { useAuth } from '@/src/providers/auth-provider';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');

    try {
      await signIn({ email, password });
      router.replace('/(app)/(tabs)');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'No pudimos iniciar sesion.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      heading="CreatorOS Mobile"
      subheading="Tu archivo creativo nativo para capturar ideas en el momento exacto en que aparecen.">
      <GlassCard>
        <View style={{ gap: 14 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900' }}>
            Entra a tu estudio movil
          </Text>
          <Text style={{ color: '#9CA7C6', fontSize: 14, lineHeight: 21 }}>
            Guarda una idea, una letra, una referencia o una nota mental apenas aparezca.
          </Text>
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
            placeholder="Tu password"
            secureTextEntry
            value={password}
          />
          {error ? <Text style={{ color: '#FF8AA9' }}>{error}</Text> : null}
          <GradientButton loading={loading} onPress={handleLogin}>
            Entrar
          </GradientButton>
        </View>
      </GlassCard>
      <Link href="/(auth)/signup" style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
        Crear una cuenta nueva
      </Link>
    </ScreenShell>
  );
}
