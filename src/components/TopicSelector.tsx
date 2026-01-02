"use client";

import { useState } from 'react';
import { Cloud, Sun, Moon, Coffee, Heart, Mountain } from 'lucide-react';
import styles from './TopicSelector.module.css';

interface TopicCategory {
    id: string;
    icon: React.ReactNode;
    topics: string[];
}

const CATEGORIES: TopicCategory[] = [
    {
        id: 'Season',
        icon: <Sun size={20} />,
        topics: ['Spring Rain', 'Summer Heat', 'Autumn Moon', 'Winter Snow', 'Falling Blossoms']
    },
    {
        id: 'Nature',
        icon: <Mountain size={20} />,
        topics: ['Mountain Pine', 'Flowing River', 'Bamboo Forest', 'Sunset', 'Mist']
    },
    {
        id: 'Emotion',
        icon: <Heart size={20} />,
        topics: ['Longing', 'Farewell', 'Joy', 'Solitude', 'Nostalgia']
    },
    {
        id: 'Daily Life',
        icon: <Coffee size={20} />,
        topics: ['Reading at Night', 'Drinking Wine', 'Tea Ceremony', 'Old Friend', 'Meditation']
    }
];

interface TopicSelectorProps {
    onSelect: (topic: string) => void;
    selectedTopic: string;
}

export default function TopicSelector({ onSelect, selectedTopic }: TopicSelectorProps) {
    const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        className={`${styles.tab} ${activeCategory === cat.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.icon}
                        <span className={styles.tabText}>{cat.id}</span>
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {CATEGORIES.find(c => c.id === activeCategory)?.topics.map(topic => (
                    <button
                        key={topic}
                        className={`${styles.chip} ${selectedTopic === topic ? styles.activeChip : ''}`}
                        onClick={() => onSelect(topic)}
                    >
                        {topic}
                    </button>
                ))}
            </div>
        </div>
    );
}
