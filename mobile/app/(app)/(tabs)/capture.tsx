import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GlassCard } from '@/src/components/glass-card';
import { GradientButton } from '@/src/components/gradient-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { TextField } from '@/src/components/text-field';
import { createQuickItem } from '@/src/lib/mobile-data';
import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';
import type { CreativeItemType } from '@/src/types/app';

const options: { description: string; label: string; value: CreativeItemType }[] = [
  {
    description: 'Idea escrita, lyric, caption o estructura.',
    label: 'Texto',
    value: 'text',
  },
  {
    description: 'Nota mental o referencia corta para no perderla.',
    label: 'Nota',
    value: 'note',
  },
  {
    description: 'Guarda un link publico para volver a verlo rapido.',
    label: 'Link',
    value: 'link',
  },
];

export default function CaptureScreen() {
  const { user } = useAuth();
  const [type, setType] = useState<CreativeItemType>('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!user) return;
    setLoading(true);
    setFeedback('');

    try {
      await createQuickItem({
        contentText: type === 'link' ? '' : content,
        description,
        fileUrl: type === 'link' ? url : undefined,
        title,
        type,
        userId: user.id,
      });

      setTitle('');
      setDescription('');
      setContent('');
      setUrl('');
      setFeedback('Captura guardada en CreatorOS.');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No pudimos guardar la captura.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      heading="Captura rapida"
      subheading="La idea aparece, la guardas y sigues. Sin romper el momento creativo.">
      <GlassCard>
        <Text style={styles.sectionTitle}>Tipo de captura</Text>
        <View style={styles.optionGrid}>
          {options.map((option) => {
            const active = option.value === type;

            return (
              <Pressable
                key={option.value}
                onPress={() => setType(option.value)}
                style={[
                  styles.optionCard,
                  active && styles.optionCardActive,
                ]}>
                <Text style={styles.optionTitle}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </Pressable>
            );
          })}
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Nueva pieza</Text>
        <View style={styles.form}>
          <TextField
            label="Titulo"
            onChangeText={setTitle}
            placeholder="Ej: Hook que se me ocurrio en la micro"
            value={title}
          />
          <TextField
            label="Descripcion breve"
            onChangeText={setDescription}
            placeholder="Por que vale la pena volver a esto"
            value={description}
          />
          {type === 'link' ? (
            <TextField
              autoCapitalize="none"
              keyboardType="url"
              label="URL"
              onChangeText={setUrl}
              placeholder="https://..."
              value={url}
            />
          ) : (
            <TextField
              label={type === 'note' ? 'Nota' : 'Texto principal'}
              multiline
              onChangeText={setContent}
              placeholder={
                type === 'note'
                  ? 'Ej: en el minuto 2:13 deberia entrar mas agudo'
                  : 'Escribe la idea, la letra, el caption o el texto base'
              }
              value={content}
            />
          )}
          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
          <GradientButton loading={loading} onPress={save}>
            Guardar captura
          </GradientButton>
        </View>
      </GlassCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  feedback: {
    color: creatorTheme.textMuted,
    lineHeight: 20,
  },
  form: {
    gap: 14,
    marginTop: 16,
  },
  optionCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: creatorTheme.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 14,
  },
  optionCardActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: '#FFFFFF',
  },
  optionDescription: {
    color: creatorTheme.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  optionGrid: {
    gap: 12,
    marginTop: 16,
  },
  optionTitle: {
    color: creatorTheme.text,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionTitle: {
    color: creatorTheme.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
});
