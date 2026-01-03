import { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Feather, Menu, X, HelpCircle } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import LanguageToggle from './LanguageToggle';
import styles from './Header.module.css';
import { useLanguage } from '../context/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import UserGuideModal from './UserGuideModal';

function HeaderContent() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
                    <div className={styles.iconWrapper}>
                        <Feather size={20} color="var(--paper-white)" />
                    </div>
                    <span className={styles.title}>{t('app.title')}</span>
                </Link>

                {/* Desktop Nav */}
                <nav className={styles.desktopNav}>
                    <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>
                        {t('nav.home')}
                    </Link>
                    <Link href="/compose" className={`${styles.link} ${pathname === '/compose' ? styles.active : ''}`}>
                        {t('nav.compose')}
                    </Link>
                    <Link href="/gallery?view=masterpieces" className={`${styles.link} ${searchParams.get('view') === 'masterpieces' ? styles.active : ''}`}>
                        {t('gallery.masterpieces')}
                    </Link>
                    <Link href="/gallery?view=my_works" className={`${styles.link} ${searchParams.get('view') === 'my_works' ? styles.active : ''}`}>
                        {t('gallery.my_works')}
                    </Link>
                    <Link href="/gallery?view=community" className={`${styles.link} ${searchParams.get('view') === 'community' ? styles.active : ''}`}>
                        {t('nav.community')}
                    </Link>
                    <LanguageToggle />

                    <button
                        className={styles.link}
                        onClick={() => setIsGuideOpen(true)}
                        title={t('nav.guide')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <HelpCircle size={20} />
                    </button>

                    <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className={styles.link}>{t('nav.sign_in')}</button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Nav Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className={styles.mobileNav}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link href="/" className={styles.mobileLink} onClick={closeMobileMenu}>
                                {t('nav.home')}
                            </Link>
                            <Link href="/compose" className={styles.mobileLink} onClick={closeMobileMenu}>
                                {t('nav.compose')}
                            </Link>
                            <Link href="/gallery?view=masterpieces" className={styles.mobileLink} onClick={closeMobileMenu}>
                                {t('gallery.masterpieces')}
                            </Link>
                            <Link href="/gallery?view=my_works" className={styles.mobileLink} onClick={closeMobileMenu}>
                                {t('gallery.my_works')}
                            </Link>
                            <Link href="/gallery?view=community" className={styles.mobileLink} onClick={closeMobileMenu}>
                                {t('nav.community')}
                            </Link>

                            <button
                                className={styles.mobileLink}
                                onClick={() => { setIsGuideOpen(true); closeMobileMenu(); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', justifyContent: 'center' }}
                            >
                                {t('nav.guide')}
                            </button>

                            <div className={styles.mobileLang}>
                                <LanguageToggle />
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className={styles.mobileLink}>{t('nav.sign_in')}</button>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </header>
    );
}

export default function Header() {
    return (
        <Suspense fallback={<div style={{ height: 'var(--header-height)' }} />}>
            <HeaderContent />
        </Suspense>
    );
}
