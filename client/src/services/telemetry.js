/**
 * Aura Enterprise Observability & Privacy-Preserving Telemetry
 * - Strict PII (Personally Identifiable Information) Redaction
 * - Scrubbing user inputs, emails, tokens, and raw cipher keys from crash logs
 * - Compliant with HIPAA Security Rule (§ 164.312) & GDPR Data Minimization (Art. 5)
 */

class PrivacyPreservingTelemetry {
  constructor() {
    this.events = [];
    this.scrubPatterns = [
      /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, // Emails
      /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})/g, // Phone numbers
      /(GCM|ENV):[0-9a-fA-F:]+/g, // Ciphertext envelopes
      /Bearer\s+[A-Za-z0-9-_=.]+/g, // JWT / Auth tokens
    ];
  }

  redact(data) {
    if (typeof data === 'string') {
      let cleaned = data;
      for (const pattern of this.scrubPatterns) {
        cleaned = cleaned.replace(pattern, '[REDACTED]');
      }
      return cleaned;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.redact(item));
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized = {};
      for (const [key, val] of Object.entries(data)) {
        if (['burden', 'plaintext', 'thoughtText', 'decryptedContent', 'password', 'token', 'key'].includes(key)) {
          sanitized[key] = '[ENCLAVE_SHIELDED]';
        } else {
          sanitized[key] = this.redact(val);
        }
      }
      return sanitized;
    }

    return data;
  }

  logEvent(eventName, metadata = {}) {
    const sanitizedMeta = this.redact(metadata);
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      metadata: sanitizedMeta
    };

    this.events.push(event);
    if (this.events.length > 50) this.events.shift();

    // Development diagnostic log (only sanitized metadata output)
    if (import.meta.env.DEV) {
      console.log(`[Aura Telemetry : ${eventName}]`, sanitizedMeta);
    }
  }

  captureError(error, context = {}) {
    const sanitizedCtx = this.redact(context);
    console.error(`[Aura Error Captured]`, error?.message || error, sanitizedCtx);
  }
}

export const telemetry = new PrivacyPreservingTelemetry();
