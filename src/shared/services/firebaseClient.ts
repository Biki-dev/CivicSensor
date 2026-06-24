export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export class FirebaseClient {
  constructor(public config: FirebaseClientConfig) {}

  initialize() {
    // Placeholder for Firebase SDK initialization.
    // Swap in real Firebase app initialization in Phase 8.
    return Promise.resolve();
  }
}
