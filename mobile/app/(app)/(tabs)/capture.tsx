import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

import { GlassCard } from '@/src/components/glass-card';
import { GradientButton } from '@/src/components/gradient-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { TextField } from '@/src/components/text-field';
import {
  createRecordedAudioDraft,
  createStudioDocument,
  formatMediaSize,
  pickStudioMedia,
} from '@/src/lib/studio-documents';
import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';
import type { StudioMediaDraft } from '@/src/types/app';

function formatRecordingTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export default function CaptureScreen() {
  const { user } = useAuth();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [noteText, setNoteText] = useState('');
  const [mediaDraft, setMediaDraft] = useState<StudioMediaDraft | null>(null);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [pickingMedia, setPickingMedia] = useState(false);

  const mediaLabel = useMemo(() => {
    if (!mediaDraft) return null;
    return `${mediaDraft.mediaType.toUpperCase()} · ${mediaDraft.name} · ${formatMediaSize(
      mediaDraft.sizeBytes
    )}`;
  }, [mediaDraft]);

  async function handlePickMedia() {
    setPickingMedia(true);
    setFeedback('');

    try {
      const pickedMedia = await pickStudioMedia();
      if (!pickedMedia) return;

      setMediaDraft(pickedMedia);
      if (!title.trim()) {
        setTitle(pickedMedia.name.replace(/\.[a-z0-9]+$/i, ''));
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No pudimos cargar ese archivo.');
    } finally {
      setPickingMedia(false);
    }
  }

  async function handleToggleRecording() {
    setFeedback('');

    try {
      if (recorderState.isRecording) {
        await audioRecorder.stop();
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });

        if (!audioRecorder.uri) {
          throw new Error('La grabacion termino, pero no encontramos el archivo.');
        }

        const recordedDraft = await createRecordedAudioDraft(audioRecorder.uri);
        setMediaDraft(recordedDraft);

        if (!title.trim()) {
          setTitle('Idea grabada');
        }

        return;
      }

      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Necesitamos el microfono',
          'Para grabar una captura de audio debes permitir acceso al microfono.'
        );
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : 'No pudimos iniciar o detener la grabacion.'
      );
    }
  }

  async function handleCreateDocument() {
    if (!user) return;

    if (!mediaDraft && !noteText.trim()) {
      setFeedback('Agrega un archivo multimedia o una nota inicial antes de crear el documento.');
      return;
    }

    setSaving(true);
    setFeedback('');

    try {
      const document = await createStudioDocument({
        description,
        mediaDraft,
        noteText,
        title,
        userId: user.id,
      });

      setTitle('');
      setDescription('');
      setNoteText('');
      setMediaDraft(null);

      router.push(`/(app)/studio/${document.id}`);
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : 'No pudimos crear tu documento multimedia.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenShell
      heading="Captura Rapida"
      subheading="Este es el punto de entrada fuerte: subes un audio, video o imagen, o grabas en el momento, y abres un documento donde sigues pensando encima del material.">
      <GlassCard style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>El corazón de CreatorOS</Text>
        <Text style={styles.heroTitle}>Sube o graba. Luego escribe mientras reproduces.</Text>
        <Text style={styles.heroCopy}>
          Ideal para letras, apuntes mentales, beat drops, referencias visuales o notas sobre un
          video.
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>1. Elige tu medio</Text>
        <View style={styles.primaryActions}>
          <GradientButton loading={pickingMedia} onPress={handlePickMedia} size="large">
            Subir audio, video o foto
          </GradientButton>

          <Pressable
            onPress={handleToggleRecording}
            style={({ pressed }) => [
              styles.recordButton,
              recorderState.isRecording && styles.recordButtonActive,
              pressed && styles.recordButtonPressed,
            ]}>
            <View
              style={[
                styles.recordIndicator,
                recorderState.isRecording && styles.recordIndicatorActive,
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.recordTitle}>
                {recorderState.isRecording ? 'Detener grabacion' : 'REC · Captura de audio'}
              </Text>
              <Text style={styles.recordCopy}>
                {recorderState.isRecording
                  ? `Grabando ${formatRecordingTime(audioRecorder.currentTime)}`
                  : 'Graba en M4A para abrir el documento al instante sin subir WAV pesados.'}
              </Text>
            </View>
            <Feather color="#FFFFFF" name={recorderState.isRecording ? 'square' : 'mic'} size={20} />
          </Pressable>
        </View>

        {mediaDraft ? (
          <View style={styles.mediaSummary}>
            <Text style={styles.mediaSummaryLabel}>Medio listo</Text>
            <Text style={styles.mediaSummaryText}>{mediaLabel}</Text>
          </View>
        ) : null}
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>2. Nota inicial</Text>
        <View style={styles.form}>
          <TextField
            label="Titulo"
            onChangeText={setTitle}
            placeholder="Ej: Coro con gritos del publico"
            value={title}
          />
          <TextField
            label="Descripcion breve"
            onChangeText={setDescription}
            placeholder="Que quieres recordar o desarrollar mas tarde"
            value={description}
          />
          <TextField
            label="Texto base"
            multiline
            onChangeText={setNoteText}
            placeholder="Escribe una idea inicial. Luego en el documento podras insertar timestamps tipo --------------02:15-------------- mientras el audio o video sigue reproduciendose."
            value={noteText}
          />

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <GradientButton loading={saving} onPress={handleCreateDocument} size="large">
            Crear documento multimedia
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
  heroCard: {
    gap: 10,
  },
  heroCopy: {
    color: creatorTheme.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  heroEyebrow: {
    color: creatorTheme.orange,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: creatorTheme.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 32,
  },
  mediaSummary: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: creatorTheme.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
    marginTop: 16,
    padding: 14,
  },
  mediaSummaryLabel: {
    color: creatorTheme.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  mediaSummaryText: {
    color: creatorTheme.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  primaryActions: {
    gap: 14,
    marginTop: 16,
  },
  recordButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  recordButtonActive: {
    borderColor: 'rgba(243, 154, 74, 0.75)',
    backgroundColor: 'rgba(243, 154, 74, 0.10)',
  },
  recordButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  recordCopy: {
    color: creatorTheme.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  recordIndicator: {
    backgroundColor: '#6B738C',
    borderRadius: 999,
    height: 16,
    width: 16,
  },
  recordIndicatorActive: {
    backgroundColor: creatorTheme.orange,
  },
  recordTitle: {
    color: creatorTheme.text,
    fontSize: 17,
    fontWeight: '900',
  },
  sectionTitle: {
    color: creatorTheme.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
});
