import { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Feather, Menu, X } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import styles from './Header.module.css';
import { useLanguage } from '../context/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';

function HeaderContent() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                    <LanguageToggle />
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
                            <div className={styles.mobileLang}>
                                <LanguageToggle />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
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
