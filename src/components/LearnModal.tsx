"use client";
import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './LearnModal.module.css';

interface LearnModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LearnModal({ isOpen, onClose }: LearnModalProps) {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'intro' | 'forms' | 'tones' | 'history'>('intro');

    if (!isOpen) return null;

    const tabs = [
        { id: 'intro', label: t('learn.tabs.intro') },
        { id: 'forms', label: t('learn.tabs.forms') },
        { id: 'tones', label: t('learn.tabs.tones') },
        { id: 'history', label: t('learn.tabs.history') },
    ];

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className={styles.modal}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>

                    <div className={styles.header}>
                        <h2 className={styles.title}>{t('learn.title')}</h2>
                        <div className={styles.tabs}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab(tab.id as any)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.content}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'intro' && (
                                <motion.div
                                    key="intro"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className={styles.tabContent}
                                >
                                    <p className={styles.lead}>{t('learn.intro.content')}</p>
                                    <ul className={styles.featureList}>
                                        <li>{t('learn.intro.point1')}</li>
                                        <li>{t('learn.intro.point2')}</li>
                                        <li>{t('learn.intro.point3')}</li>
                                    </ul>
                                    <div className={styles.note}>
                                        <strong>{t('learn.intro.themes').split('：')[0]}:</strong> {t('learn.intro.themes').split('：')[1] || t('learn.intro.themes')}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'forms' && (
                                <motion.div
                                    key="forms"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className={styles.tabContent}
                                >
                                    <p className={styles.text}>{t('learn.forms.intro')}</p>
                                    <div className={styles.grid}>
                                        <div className={styles.card}>
                                            <h4 className={styles.cardTitle}>{t('learn.jueju.title')}</h4>
                                            <p className={styles.text}>{t('learn.jueju.desc')}</p>
                                        </div>
                                        <div className={styles.card}>
                                            <h4 className={styles.cardTitle}>{t('learn.lvshi.title')}</h4>
                                            <p className={styles.text}>{t('learn.lvshi.desc')}</p>
                                        </div>
                                    </div>
                                    <div className={styles.exampleBox} style={{ marginTop: '2rem', textAlign: 'left' }}>
                                        <h4 className={styles.cardTitle}>{t('learn.forms.duizhang.title')}</h4>
                                        <p className={styles.text}>{t('learn.forms.duizhang.desc')}</p>
                                    </div>
                                    <p className={styles.note}>{t('learn.forms.chars')}</p>
                                </motion.div>
                            )}

                            {activeTab === 'tones' && (
                                <motion.div
                                    key="tones"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className={styles.tabContent}
                                >
                                    <p className={styles.text}>{t('learn.tones.intro')}</p>
                                    <div className={styles.toneGrid}>
                                        <div className={`${styles.toneCard} ${styles.ping}`}>
                                            <div className={styles.toneSymbol}>—</div>
                                            <h4>{t('learn.tones.ping')}</h4>
                                            <p>{t('learn.tones.ping.desc')}</p>
                                        </div>
                                        <div className={`${styles.toneCard} ${styles.ze}`}>
                                            <div className={styles.toneSymbol}>|</div>
                                            <h4>{t('learn.tones.ze')}</h4>
                                            <p>{t('learn.tones.ze.desc')}</p>
                                        </div>
                                    </div>
                                    <div className={styles.exampleBox}>
                                        <h5>{t('learn.tones.rule')}</h5>
                                        <div className={styles.patternRow}>
                                            <span className={styles.ze}>仄</span>
                                            <span className={styles.ze}>仄</span>
                                            <span className={styles.ping}>平</span>
                                            <span className={styles.ping}>平</span>
                                            <span className={styles.ze}>仄</span>
                                        </div>
                                        <div style={{ marginTop: '1.5rem', borderTop: '1px dashed #ddd', paddingTop: '1rem' }}>
                                            <h5 style={{ marginBottom: '0.5rem', color: 'var(--nanjing-red)' }}>{t('learn.tones.tips.title')}</h5>
                                            <p style={{ fontSize: '0.95rem' }}>{t('learn.tones.tips.desc')}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'history' && (
                                <motion.div
                                    key="history"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className={styles.tabContent}
                                >
                                    <h3 className={styles.sectionTitle}>{t('learn.history.title')}</h3>
                                    <div className={styles.poetList}>
                                        <div className={styles.poetCard}>
                                            <h4>{t('learn.history.libai')}</h4>
                                            <p>{t('learn.history.libai.desc')}</p>
                                        </div>
                                        <div className={styles.poetCard}>
                                            <h4>{t('learn.history.dufu')}</h4>
                                            <p>{t('learn.history.dufu.desc')}</p>
                                        </div>
                                        <div className={styles.poetCard}>
                                            <h4>{t('learn.history.wangwei')}</h4>
                                            <p>{t('learn.history.wangwei.desc')}</p>
                                        </div>
                                        <div className={styles.poetCard}>
                                            <h4>{t('learn.history.baijuyi')}</h4>
                                            <p>{t('learn.history.baijuyi.desc')}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
