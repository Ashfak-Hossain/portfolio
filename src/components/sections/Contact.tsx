import { useState } from 'react';
import type { FormEvent } from 'react';
import { contact } from '../../content';
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
  const [error, setError] = useState('');

  // Decorative: validates client-side and shows the success state, but does not
  // send anywhere. To go live, POST to `contact.endpoint` (Formspree/Getform).
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('// all fields required');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('// enter a valid email');
      return;
    }
    setSent(true);
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
          <div className={styles.success}>
            <div className={styles.successJp}>{contact.successJp}</div>
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
              <span className={styles.error}>{error}</span>
              <button ref={sendRef} type="submit" className={styles.send}>
                SEND IT →
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
