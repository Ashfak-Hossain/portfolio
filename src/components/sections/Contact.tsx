import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { contact, connect } from '../../content';
import { Reveal } from '../ui/Reveal';
import { Eyebrow } from '../ui/Eyebrow';
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
  const successRef = useRef<HTMLDivElement>(null);

  // Move focus to the confirmation so screen-reader users are told it sent.
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const describedBy = error ? 'form-error' : undefined;
  const invalid = error ? true : undefined;

  const emailHref = connect.links.find((l) => l.label === 'EMAIL')?.href ?? '';

  // Submit path:
  //  • contact.endpoint set (Formspree) → POST the message in-page.
  //  • not set yet → degrade to the visitor's mail client so nothing is ever
  //    silently lost. Paste your Formspree URL into content/contact.ts to upgrade.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('// all fields required');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('// enter a valid email');
      return;
    }

    if (!contact.endpoint) {
      if (emailHref) {
        const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
        const subject = encodeURIComponent('New arc — portfolio contact');
        window.location.href = `${emailHref}?subject=${subject}&body=${body}`;
      }
      setSent(true);
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
      setSent(true);
    } catch {
      setError('// could not send — please email me directly instead');
    } finally {
      setSending(false);
    }
  };

  const clearError = () => setError('');

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <div className={styles.eyebrowWrap}>
            <Eyebrow align="center">04 — Contact</Eyebrow>
          </div>
          <h2 className={styles.heading}>{contact.heading}</h2>
          <p className={styles.sub}>{contact.sub}</p>
        </Reveal>

        {sent ? (
          <div
            className={styles.success}
            role="status"
            aria-live="polite"
            tabIndex={-1}
            ref={successRef}
          >
            <div className={styles.successJp} lang="ja">
              {contact.successJp}
            </div>
            <div className={styles.successEn}>{contact.success}</div>
            <p className={styles.successNote}>{contact.successNote}</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.row}>
              <label className={styles.fieldLabel}>
                Name
                <input
                  className={styles.input}
                  name="name"
                  required
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError();
                  }}
                  placeholder="Your name"
                />
              </label>
              <label className={styles.fieldLabel}>
                Email
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  placeholder="you@domain.com"
                />
              </label>
            </div>
            <label className={styles.fieldLabel}>
              Message
              <textarea
                className={styles.textarea}
                name="message"
                required
                aria-invalid={invalid}
                aria-describedby={describedBy}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  clearError();
                }}
                placeholder="Tell me about the problem..."
                rows={5}
              />
            </label>
            <div className={styles.actions}>
              <span id="form-error" className={styles.error} role="alert" aria-live="assertive">
                {error}
              </span>
              <button
                ref={sendRef}
                type="submit"
                className={styles.send}
                disabled={sending}
                aria-busy={sending}
              >
                {sending ? 'SENDING…' : 'SEND IT →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
