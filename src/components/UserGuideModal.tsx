"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Lock, Trash2, User, UserCheck, Bookmark, Palette, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './LearnModal.module.css'; // Reusing styles for consistency

interface UserGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
    const { t } = useLanguage();

    if (!isOpen) return null;

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
                        <h2 className={styles.title}>{t('guide.title')}</h2>
                    </div>

                    <div className={styles.content} style={{ padding: '0 2rem 2rem 2rem' }}>

                        {/* Purpose */}
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--ink-black)' }}>{t('guide.purpose.title')}</h3>
                            <p className={styles.lead} style={{ textAlign: 'center', fontSize: '1rem' }}>{t('guide.purpose.content')}</p>
                        </div>

                        {/* Features */}
                        <div className={styles.card} style={{ marginBottom: '2rem' }}>
                            <h4 className={styles.cardTitle}>{t('guide.features.title')}</h4>
                            <ul className={styles.featureList} style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}>{t('guide.features.compose')}</li>
                                <li style={{ marginBottom: '0.5rem' }}>{t('guide.features.share')}</li>
                                <li>{t('guide.features.learn')}</li>
                            </ul>
                        </div>

                        {/* Creation Process */}
                        <div className={styles.card} style={{ marginBottom: '2rem', borderLeft: '4px solid var(--nanjing-red)' }}>
                            <h4 className={styles.cardTitle}>{t('guide.creation.title')}</h4>
                            <ul className={styles.featureList} style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}>{t('guide.creation.step1')}</li>
                                <li style={{ marginBottom: '0.5rem' }}>{t('guide.creation.step2')}</li>
                                <li style={{ marginBottom: '0.5rem' }}>{t('guide.creation.step3')}</li>
                            </ul>
                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                                <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.8 }}>{t('guide.tool.title')}</h5>
                                <div style={{ fontSize: '0.95rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <RefreshCw size={16} style={{ marginRight: '10px' }} /> {t('guide.tool.regen')}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <Palette size={16} style={{ marginRight: '10px' }} /> {t('guide.tool.paint')}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Bookmark size={16} style={{ marginRight: '10px' }} /> {t('guide.tool.save')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Icons */}
                        <div className={styles.card} style={{ marginBottom: '2rem' }}>
                            <h4 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {t('guide.icons.title')}
                            </h4>
                            <div className={styles.featureList} style={{ listStyle: 'none', padding: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                    <Lock size={20} style={{ marginRight: '1rem', flexShrink: 0 }} />
                                    <span>{t('guide.icons.lock')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                    <Globe size={20} color="var(--jade-green)" style={{ marginRight: '1rem', flexShrink: 0 }} />
                                    <span>{t('guide.icons.globe')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                    <Trash2 size={20} color="var(--nanjing-red)" style={{ marginRight: '1rem', flexShrink: 0 }} />
                                    <span>{t('guide.icons.trash')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Auth */}
                        <div className={styles.card} style={{ marginBottom: '2rem' }}>
                            <h4 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {t('guide.auth.title')}
                            </h4>
                            <div className={styles.featureList} style={{ listStyle: 'none', padding: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'start', marginBottom: '1rem' }}>
                                    <User size={20} style={{ marginRight: '1rem', marginTop: '4px', flexShrink: 0 }} />
                                    <span>{t('guide.auth.guest')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'start', marginBottom: '1rem' }}>
                                    <UserCheck size={20} color="var(--jade-green)" style={{ marginRight: '1rem', marginTop: '4px', flexShrink: 0 }} />
                                    <span>{t('guide.auth.signed')}</span>
                                </div>
                                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '8px', fontStyle: 'italic', borderLeft: '4px solid var(--jade-green)' }}>
                                    {t('guide.auth.tip')}
                                </div>
                            </div>
                        </div>

                        {/* Learn Note & Contact */}
                        <div style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.8, borderTop: '1px dashed #ccc', paddingTop: '1rem' }}>
                            <p style={{ marginBottom: '0.5rem', fontWeight: 500, color: 'var(--nanjing-red)' }}>{t('guide.learn.note')}</p>
                            {t('guide.contact')}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
