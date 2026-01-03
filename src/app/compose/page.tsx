"use client";

import { useState } from 'react';
import { Feather, RefreshCw, Copy, Bookmark, Palette, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './page.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import FadeIn from '../../components/FadeIn';
import InkLoading from '../../components/InkLoading';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '../../lib/imageUtils';




export default function ComposePage() {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState('wujue');
    const [mood, setMood] = useState('Joyful');
    const [isGenerating, setIsGenerating] = useState(false);
    const [poem, setPoem] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isIllustrating, setIsIllustrating] = useState(false);

    // Keep helper for initial state or fallback
    // Keep helper for initial state or fallback
    const getMoodImage = (currentMood: string) => {
        const m = currentMood.toLowerCase();
        if (m.includes('joy')) return '/images/moods/joyful.png';
        if (m.includes('heroic')) return '/images/moods/heroic.png';
        if (m.includes('peace')) return '/images/moods/peaceful.png';
        if (m.includes('longing')) return '/images/moods/nostalgic.png';
        if (m.includes('nostalgic')) return '/images/moods/nostalgic.png';
        if (m.includes('solitary')) return '/images/moods/melancholic.png';
        if (m.includes('melanchol')) return '/images/moods/melancholic.png';
        if (m.includes('desolate')) return '/images/moods/melancholic.png';
        return '/images/moods/nostalgic.png';
    };

    // ... (rest of code)




    const { user, isSignedIn } = useUser();

    // ... (rest of code)

    const handleSave = async () => {
        if (!poem) return;

        try {
            let imageToSave = generatedImage || getMoodImage(mood);

            // If it's a generated base64 image, compress it
            if (generatedImage && generatedImage.startsWith('data:image')) {
                showToast('Optimizing image...', 'success');
                imageToSave = await compressImage(generatedImage);
            }

            if (isSignedIn) {
                // Cloud Save
                showToast('Saving to cloud...', 'info');
                const res = await fetch('/api/poems/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: topic,
                        author: user?.fullName || "User",
                        content: poem.split('\n'),
                        style,
                        image: imageToSave
                    })
                });
                if (res.ok) {
                    showToast(t('compose.msg.saved') + ' (Cloud)', 'success');
                } else {
                    throw new Error('Cloud save failed');
                }

            } else {
                // Local Save (Fallback)
                const savedPoems = JSON.parse(localStorage.getItem('savedPoems') || '[]');
                const newPoem = {
                    id: Date.now(),
                    title: topic,
                    author: "User • AI",
                    content: poem.split('\n'),
                    style: style,
                    image: imageToSave
                };

                localStorage.setItem('savedPoems', JSON.stringify([...savedPoems, newPoem]));
                showToast(t('compose.msg.saved') + ' (Local)', 'success');
            }

        } catch (e: any) {
            console.error("Save failed", e);
            if (e.name === 'QuotaExceededError') {
                showToast('Storage full! Please delete some old poems.', 'error');
            } else {
                showToast('Failed to save poem.', 'error');
            }
        }
    };

    const handleIllustrate = async () => {
        if (!poem) return;
        setIsIllustrating(true);
        try {
            const imgRes = await fetch('/api/illustrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: topic, content: poem }),
            });
            const imgData = await imgRes.json();
            if (imgData.success) {
                setGeneratedImage(imgData.image);
                showToast(t('compose.msg.illustrated') || 'Illustration created!', 'success');
            }
        } catch (imgError) {
            console.error("Illustration failed", imgError);
            showToast('Failed to create illustration', 'error');
        } finally {
            setIsIllustrating(false);
        }
    };

    const handleCompose = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setPoem(null);
        setGeneratedImage(null);

        try {
            // 1. Generate Poem
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, style, mood }),
            });

            const data = await response.json();
            if (data.poem) {
                setPoem(data.poem);
            }
        } catch (error) {
            console.error('Generation failed', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <Header />
            <main className={styles.main}>
                <div className="container">
                    <FadeIn delay={0.2}>
                        <div className={styles.grid}>
                            {/* Input Section */}
                            <section className={styles.inputSection}>
                                <h1 className={styles.pageTitle}>{t('compose.title')}</h1>

                                <form onSubmit={handleCompose} className={styles.form}>
                                    <div className={styles.field}>
                                        <label className={styles.label}>{t('compose.topic')}</label>
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder={t('compose.topic.placeholder')}
                                            className={styles.input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label className={styles.label}>{t('compose.style')}</label>
                                            <div className={styles.optionsGrid}>
                                                <button
                                                    type="button"
                                                    onClick={() => setStyle('wujue')}
                                                    className={`${styles.option} ${style === 'wujue' ? styles.active : ''}`}
                                                >
                                                    {t('compose.style.wujue')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setStyle('qijue')}
                                                    className={`${styles.option} ${style === 'qijue' ? styles.active : ''}`}
                                                >
                                                    {t('compose.style.qijue')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setStyle('wulv')}
                                                    className={`${styles.option} ${style === 'wulv' ? styles.active : ''}`}
                                                >
                                                    {t('compose.style.wulv')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setStyle('qilv')}
                                                    className={`${styles.option} ${style === 'qilv' ? styles.active : ''}`}
                                                >
                                                    {t('compose.style.qilv')}
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.field}>
                                            <label className={styles.label}>{t('compose.mood')}</label>
                                            <select
                                                className={styles.select}
                                                value={mood}
                                                onChange={(e) => setMood(e.target.value)}
                                            >
                                                <option value="Joyful">{t('compose.mood.joyful')}</option>
                                                <option value="Heroic">{t('compose.mood.heroic')}</option>
                                                <option value="Peaceful">{t('compose.mood.peaceful')}</option>
                                                <option value="Longing">{t('compose.mood.longing')}</option>
                                                <option value="Nostalgic">{t('compose.mood.nostalgic')}</option>
                                                <option value="Solitary">{t('compose.mood.solitary')}</option>
                                                <option value="Melancholic">{t('compose.mood.melancholic')}</option>
                                                <option value="Desolate">{t('compose.mood.desolate')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${styles.submitBtn}`}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <>
                                                {t('compose.btn.generating')}
                                            </>
                                        ) : (
                                            <>
                                                {t('compose.btn.generate')} <Feather size={18} style={{ marginLeft: 8 }} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </section>

                            {/* Output Section */}
                            <section className={styles.outputSection}>
                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={styles.loadingContainer}
                                        >
                                            <InkLoading />
                                            <p className={styles.loadingText}>{t('compose.btn.generating')}</p>
                                        </motion.div>
                                    ) : poem ? (
                                        <motion.div
                                            key="poem"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className={styles.paper}
                                        >
                                            <div className={styles.paperTexture}></div>

                                            {/* Dynamic Background Image */}
                                            {(generatedImage || isIllustrating) && (
                                                <motion.div
                                                    className={styles.dynamicBackground}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: isIllustrating ? 0.5 : 0.2 }}
                                                >
                                                    {generatedImage && (
                                                        <Image
                                                            src={generatedImage}
                                                            alt="AI Illustration"
                                                            fill
                                                            style={{ objectFit: 'cover', mixBlendMode: 'multiply' }}
                                                        />
                                                    )}
                                                </motion.div>
                                            )}
                                            <div className={styles.poemContent}>
                                                <h2 className={styles.poemTitle}>{topic || "Untitled"}</h2>
                                                <div className={styles.poemMeta}>User • AI Dynasty</div>
                                                <div className={`${styles.poemBody} poem-text-modern`}>
                                                    {poem.replace(/([，。！？])/g, '$1\n')
                                                        .split('\n')
                                                        .map(line => line.trim())
                                                        .filter(line => line.length > 0)
                                                        .map((line, i) => (
                                                            <motion.p
                                                                key={i}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: i * 0.1 + 0.5 }} // Faster stagger for more lines
                                                                style={{ marginBottom: '4px' }} // Tighten spacing for split lines
                                                            >
                                                                {line}
                                                            </motion.p>
                                                        ))}
                                                </div>
                                            </div>
                                            <div className={styles.poemActions}>
                                                <button
                                                    className="btn btn-secondary"
                                                    title={t('compose.btn.save')}
                                                    onClick={() => handleSave()}
                                                >
                                                    <Bookmark size={16} />
                                                </button>

                                                {/* Manual Illustrate Button */}
                                                <button
                                                    className="btn btn-secondary"
                                                    title={t('compose.btn.paint')}
                                                    onClick={handleIllustrate}
                                                    disabled={isIllustrating || !!generatedImage}
                                                >
                                                    {isIllustrating ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Palette size={16} />
                                                    )}
                                                </button>

                                                <button
                                                    className="btn btn-secondary"
                                                    title={t('compose.btn.regenerate')}
                                                    onClick={handleCompose}
                                                >
                                                    <RefreshCw size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={styles.emptyState}
                                        >
                                            <div className={styles.emptyIcon}>
                                                <Feather size={48} color="var(--charcoal-gray)" opacity={0.3} />
                                            </div>
                                            <p>Your masterpiece awaits.<br />Select a topic to begin.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </section>
                        </div>
                    </FadeIn>
                </div>
            </main>
            <Footer />
        </div>
    );
}
