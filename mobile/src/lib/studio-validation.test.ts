import { validateStudioMediaDraft } from './studio-validation';

describe('studio-validation', () => {
  it('accepts lightweight allowed audio formats', () => {
    expect(() =>
      validateStudioMediaDraft({
        mediaType: 'audio',
        mimeType: 'audio/mpeg',
        name: 'demo.mp3',
        sizeBytes: 1024,
        source: 'upload',
        uri: 'file:///demo.mp3',
      })
    ).not.toThrow();
  });

  it('blocks DAW audio formats with a specific message', () => {
    expect(() =>
      validateStudioMediaDraft({
        mediaType: 'audio',
        mimeType: 'audio/wav',
        name: 'master.wav',
        sizeBytes: 1024,
        source: 'upload',
        uri: 'file:///master.wav',
      })
    ).toThrow('Este formato es para DAWs. Exporta a MP3 o M4A primero.');
  });

  it('blocks oversized videos', () => {
    expect(() =>
      validateStudioMediaDraft({
        mediaType: 'video',
        mimeType: 'video/mp4',
        name: 'clip.mp4',
        sizeBytes: 250 * 1024 * 1024,
        source: 'upload',
        uri: 'file:///clip.mp4',
      })
    ).toThrow('El video supera el limite de 200 MB.');
  });
});
