// ─── Video Recorder ──────────────────────────────────────────────────────────
// Records ASCII canvas output as a .webm video using the MediaRecorder API.

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private onStopCallback: ((blob: Blob) => void) | null = null;

  /**
   * Starts recording from a canvas element.
   * @param canvas - The canvas element to record
   * @param fps - Target frames per second (default 30)
   */
  start(canvas: HTMLCanvasElement, fps: number = 30): void {
    this.chunks = [];
    const stream = canvas.captureStream(fps);

    // Prefer VP9 codec, fallback to VP8, then default
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
        ? 'video/webm;codecs=vp8'
        : 'video/webm';

    this.mediaRecorder = new MediaRecorder(stream, { mimeType });

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: mimeType });
      if (this.onStopCallback) {
        this.onStopCallback(blob);
      } else {
        this.downloadBlob(blob);
      }
      this.chunks = [];
    };

    this.mediaRecorder.start(100); // Collect data every 100ms
  }

  /**
   * Stops recording and triggers download.
   */
  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  /**
   * Sets a callback to handle the recorded blob instead of auto-downloading.
   */
  onStop(callback: (blob: Blob) => void): void {
    this.onStopCallback = callback;
  }

  /**
   * Returns whether the recorder is currently recording.
   */
  get isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  private downloadBlob(blob: Blob, filename: string = 'ascii-recording.webm'): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
