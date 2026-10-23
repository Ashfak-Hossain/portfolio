import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { contact, connect } from '../../content';
import { Reveal } from '../ui/Reveal';
import { edition } from '../../content/edition';
import { PirateMark } from '../ui/PirateMark';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useMotion } from '../../hooks/useMotion';
import styles from './Contact.module.css';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function Contact() {
  const { reduced } = useMotion();
  const sendRef = useMagnetic<HTMLButtonElement>(!reduced);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const copy = edition.contactPanel;
  const successRef = useRef<HTMLDivElement>(null);

  // Move focus to the confirmation so screen-reader users are told it sent.
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const describedBy = error ? 'form-error' : undefined;
  const invalid = {
    name: error === copy.required && !name.trim(),
    email: (error === copy.required && !email.trim()) || error === copy.invalidEmail,
    message: error === copy.required && !message.trim(),
  };

  const toEmail = connect.email;

  // The configured Vercel endpoint sends mail; mailto remains a fallback.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(copy.required);
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError(copy.invalidEmail);
      return;
    }

    if (!contact.endpoint) {
      if (toEmail) {
        const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
        const subject = encodeURIComponent('New arc — portfolio contact');
        window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
      }
      return;
    }

    setSending(true);
    try {
      const res = await fetch(contact.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const result: unknown = await res.json();
      if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) {
        throw new Error('Invalid mail response');
      }
      setSent(true);
    } catch {
      setError(copy.failure);
    } finally {
      setSending(false);
    }
  };

  const clearError = () => setError('');
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    setCopyError('');
    try {
      await navigator.clipboard.writeText(toEmail);
      setCopied(true);
    } catch {
      setCopyError(copy.copyFailure);
    }
  };

  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-heading">
      <div className={styles.inner}>
        <div className={styles.chapter}><span>{copy.label}</span><span lang="ja">{copy.chapterJp}</span></div>
        <div className={styles.grid}>
          <Reveal className={styles.head}>
            <h2 id="contact-heading" className={styles.heading}>{copy.title.map((line) => <span key={line}>{line}</span>)}</h2>
            <p className={styles.sub}>{copy.note}</p>
            <div className={styles.direct}>
              <span>{copy.direct}</span>
              <a href={`mailto:${toEmail}`}>{toEmail} <span aria-hidden="true">↗</span></a>
              <button className={styles.copyButton} type="button" onClick={copyEmail} aria-live="polite">{copied ? copy.copied : copy.copy} {copied ? '✓' : '⧉'}</button>
              <span className={styles.copyError} role="status">{copyError}</span>
            </div>
          </Reveal>
          <div className={styles.letter}>
            <div className={styles.letterTop}><span>{copy.formLabel}</span><span className={styles.stamp}><PirateMark />{copy.formStamp}</span></div>
            {sent ? (
              <div className={styles.success} role="status" aria-live="polite" tabIndex={-1} ref={successRef}>
                <div className={styles.successJp} lang="ja">{contact.successJp}</div>
                <div className={styles.successEn}>{contact.success}</div>
                <p className={styles.successNote}>{contact.successNote}</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={onSubmit} noValidate aria-label={contact.heading}>
                <div className={styles.row}>
                  <label className={styles.fieldLabel}>{copy.name}
                    <input className={styles.input} name="name" autoComplete="name" maxLength={100} required aria-invalid={invalid.name || undefined} aria-describedby={describedBy} value={name} onChange={(e) => { setName(e.target.value); clearError(); }} placeholder={copy.namePlaceholder} />
                  </label>
                  <label className={styles.fieldLabel}>{copy.email}
                    <input className={styles.input} type="email" name="email" autoComplete="email" maxLength={200} inputMode="email" required aria-invalid={invalid.email || undefined} aria-describedby={describedBy} value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }} placeholder={copy.emailPlaceholder} />
                  </label>
                </div>
                <label className={styles.fieldLabel}>{copy.message}
                  <textarea className={styles.textarea} name="message" maxLength={5000} required aria-invalid={invalid.message || undefined} aria-describedby={describedBy} value={message} onChange={(e) => { setMessage(e.target.value); clearError(); }} placeholder={copy.placeholder} rows={4} />
                </label>
                <div className={styles.actions}>
                  <span id="form-error" className={styles.error} role="alert">{error}</span>
                  <button ref={sendRef} type="submit" className={styles.send} disabled={sending} aria-busy={sending}>{sending ? copy.sending : copy.send}<span aria-hidden="true">↗</span></button>
                </div>
              </form>
            )}
            <span className={styles.postscript} aria-hidden="true">{copy.postscript}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
