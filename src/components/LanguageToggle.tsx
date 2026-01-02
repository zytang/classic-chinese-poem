"use client";

import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className={styles.toggle}
            title="Switch Language / 切换语言"
        >
            <Globe size={18} />
            <span>{language === 'en' ? '中文' : 'EN'}</span>
        </button>
    );
}
