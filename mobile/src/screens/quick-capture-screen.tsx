import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
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
} from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '@/src/components/gradient-button';
import { TextField } from '@/src/components/text-field';
import {
  createRecordedAudioDraft,
  createStudioDocument,
  formatMediaSize,
  pickStudioMedia,
} from '@/src/lib/studio-documents';
import { creatorGradients, creatorTheme } from '@/src/lib/theme';
import { parseTags } from '@/src/lib/studio-format';
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

export function QuickCaptureScreen({
  modal = false,
}: {
  modal?: boolean;
}) {
  const { user } = useAuth();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [noteText, setNoteText] = useState('');
  const [mediaDraft, setMediaDraft] = useState<StudioMediaDraft | null>(null);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [pickingMedia, setPickingMedia] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

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
      if (recording) {
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
        setRecording(false);
        setRecordingSeconds(0);

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
      setRecording(true);
      setRecordingSeconds(0);
    } catch (error) {
      setRecording(false);
      setFeedback(
        error instanceof Error ? error.message : 'No pudimos iniciar o detener la grabacion.'
      );
    }
  }

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (recording) {
      intervalId = setInterval(() => {
        setRecordingSeconds(Math.floor(audioRecorder.currentTime || 0));
      }, 300);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [audioRecorder, recording]);

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
        tags: parseTags(tagValue),
        title,
        userId: user.id,
      });

      setTitle('');
      setDescription('');
      setTagValue('');
      setNoteText('');
      setMediaDraft(null);

      router.replace(`/(app)/studio/${document.id}`);
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : 'No pudimos crear tu documento multimedia.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <LinearGradient colors={creatorGradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Quick Capture</Text>
            <Text style={styles.title}>Sube o graba. Luego escribe mientras reproduces.</Text>
          </View>
          {modal ? (
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <Feather color={creatorTheme.text} name="x" size={20} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.zone}>
            <Text style={styles.zoneTitle}>A. Upload zone</Text>
            <Text style={styles.zoneCopy}>
              MP3, M4A, AAC, OGG, MP4, WebM, JPG, PNG, WebP o HEIC. Nada se sube a un servidor.
            </Text>

            <Pressable
              onPress={handlePickMedia}
              style={({ pressed }) => [styles.uploadZone, pressed && styles.uploadZonePressed]}>
              <View style={styles.uploadIconWrap}>
                <Feather color={creatorTheme.amber} name="upload-cloud" size={22} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.uploadTitle}>
                  {pickingMedia ? 'Abriendo selector...' : 'Tap para elegir un archivo'}
                </Text>
                <Text style={styles.uploadCopy}>
                  Lo guardaremos localmente en el dispositivo para trabajar sin nube ni formatos
                  pesados.
                </Text>
              </View>
            </Pressable>

            {mediaDraft ? (
              <View style={styles.mediaSummary}>
                <Text style={styles.mediaSummaryLabel}>Medio listo</Text>
                <Text style={styles.mediaSummaryText}>{mediaLabel}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.zone}>
            <Text style={styles.zoneTitle}>B. REC</Text>
            <Text style={styles.zoneCopy}>Gran botón rojo. Graba una idea al vuelo y abre el documento.</Text>

            <Pressable
              onPress={handleToggleRecording}
              style={({ pressed }) => [
                styles.recordZone,
                recording && styles.recordZoneActive,
                pressed && styles.recordZonePressed,
              ]}>
              <View style={[styles.recordOrb, recording && styles.recordOrbActive]} />
              <View style={styles.recordCopyWrap}>
                <Text style={styles.recordTitle}>{recording ? 'Detener grabacion' : 'REC'}</Text>
                <Text style={styles.recordBody}>
                  {recording
                    ? `Grabando ${formatRecordingTime(recordingSeconds)}`
                    : 'Captura audio local en M4A para escribir encima sin pasar por una DAW.'}
                </Text>
              </View>
              <Feather color={creatorTheme.text} name={recording ? 'square' : 'mic'} size={22} />
            </Pressable>
          </View>

          <View style={styles.zone}>
            <Text style={styles.zoneTitle}>C. Nota inicial</Text>
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
              label="Tags"
              onChangeText={setTagValue}
              placeholder="letra, beat-drop, referencia"
              value={tagValue}
            />
            <TextField
              label="Add an initial note..."
              multiline
              onChangeText={setNoteText}
              placeholder="Escribe lo primero que no quieres perder. Luego en el documento podras insertar timestamps, marks e ideas rapidas."
              value={noteText}
            />
          </View>

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <GradientButton loading={saving} onPress={handleCreateDocument} size="large">
            ✦ Create document
          </GradientButton>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: creatorTheme.panelSoft,
    borderColor: creatorTheme.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 120,
  },
  eyebrow: {
    color: creatorTheme.amber,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  feedback: {
    color: creatorTheme.warm,
    fontFamily: creatorTheme.fontUiMedium,
    lineHeight: 20,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  mediaSummary: {
    backgroundColor: creatorTheme.panelSoft,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    gap: 4,
    marginTop: 14,
    padding: 14,
  },
  mediaSummaryLabel: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  mediaSummaryText: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiSemiBold,
    fontSize: 15,
    lineHeight: 22,
  },
  recordBody: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  recordCopyWrap: {
    flex: 1,
    gap: 4,
  },
  recordOrb: {
    backgroundColor: 'rgba(196, 90, 69, 0.55)',
    borderRadius: 999,
    height: 18,
    width: 18,
  },
  recordOrbActive: {
    backgroundColor: creatorTheme.recordingRed,
    shadowColor: creatorTheme.recordingRed,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
  },
  recordTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiExtraBold,
    fontSize: 22,
  },
  recordZone: {
    alignItems: 'center',
    backgroundColor: creatorTheme.panelSoft,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusXl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  recordZoneActive: {
    backgroundColor: 'rgba(196, 90, 69, 0.10)',
    borderColor: 'rgba(196, 90, 69, 0.45)',
  },
  recordZonePressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  safeArea: {
    flex: 1,
  },
  title: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiExtraBold,
    fontSize: 30,
    letterSpacing: -0.9,
    lineHeight: 34,
  },
  uploadCopy: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  uploadIconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(232, 168, 76, 0.08)',
    borderRadius: creatorTheme.radiusLg,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  uploadTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiSemiBold,
    fontSize: 16,
  },
  uploadZone: {
    alignItems: 'center',
    backgroundColor: creatorTheme.panelSoft,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusXl,
    borderWidth: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
    gap: 14,
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  uploadZonePressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  zone: {
    backgroundColor: creatorTheme.panel,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusXl,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  zoneCopy: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 14,
    lineHeight: 21,
  },
  zoneTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 20,
  },
});
