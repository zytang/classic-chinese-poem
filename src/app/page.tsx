"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ScrollText, PenTool } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './page.module.css';
import { useLanguage } from '../context/LanguageContext';
import LearnModal from '../components/LearnModal';
import FadeIn from '../components/FadeIn';

export default function Home() {
  const { t } = useLanguage();
  const [isLearnOpen, setIsLearnOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <FadeIn>
              <div className={styles.heroContent}>
                <div className={styles.seal}>詩</div>
                <h1 className={styles.title}>
                  {t('hero.title').split(' ').map((word, i, arr) => (
                    i === arr.length - 1 ? <span key={i} className="text-gradient"> {word}</span> : word + ' '
                  ))}
                </h1>
                <p className={styles.subtitle}>
                  {t('hero.subtitle')}
                </p>
                <div className={styles.actions}>
                  <Link href="/compose" className="btn btn-primary">
                    <PenTool size={18} style={{ marginRight: 8 }} />
                    {t('hero.start')}
                  </Link>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsLearnOpen(true)}
                  >
                    <ScrollText size={18} style={{ marginRight: 8 }} />
                    {t('hero.learn')}
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <LearnModal isOpen={isLearnOpen} onClose={() => setIsLearnOpen(false)} />
      </main>
      <Footer />
    </div>
  );
}
