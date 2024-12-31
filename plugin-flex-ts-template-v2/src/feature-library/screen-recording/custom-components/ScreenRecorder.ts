export class ScreenRecorder {
    private static instance: ScreenRecorder;
    private mediaRecorder: MediaRecorder | null;
    private chunks: BlobPart[] | undefined;

    private constructor() {
      this.mediaRecorder = null;
      this.chunks = [];
    }

    public static getInstance(): ScreenRecorder {
      if (!ScreenRecorder.instance) {
        ScreenRecorder.instance = new ScreenRecorder();
      }
      return ScreenRecorder.instance;
    }
  
    public async startRecording(): Promise<void> {
      console.log('Starting screen recording...');
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      this.mediaRecorder = new MediaRecorder(stream);
  
      this.mediaRecorder.ondataavailable = (event) => {
        if (this.chunks && event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };
  
      this.mediaRecorder.start();
      console.log('Screen recording has started.');
    }
  
    public async stopRecording(): Promise<unknown> {
      return new Promise((resolve) => {
        if (!this.mediaRecorder) throw new Error('Media Recorder is null');
        this.mediaRecorder.onstop = async () => {
          const blob = new Blob(this.chunks, { type: 'video/webm' });
          console.log('Screen recording has finished.');
          resolve(blob);
        };
        this.mediaRecorder.stop();
        console.log('Stopping screen recording...');
      });
    }
}