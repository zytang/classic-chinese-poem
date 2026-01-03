
"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Trash2, Globe, Lock, Share2 } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FadeIn from '../../components/FadeIn';
import styles from './page.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

type Poem = {
    id: number;
    title: string;
    author: string;
    content: string[];
    style: string;
    image: string;
    isPublic?: boolean;
};

const MASTERPIECES: Poem[] = [
    {
        id: 1,
        title: "静夜思 (Quiet Night Thought)",
        author: "Li Bai (李白)",
        content: [
            "床前明月光，",
            "疑是地上霜。",
            "举头望明月，",
            "低头思故乡。"
        ],
        style: "Wujue",
        image: "/images/gallery/quiet_night.png"
    },
    {
        id: 2,
        title: "春望 (Spring View)",
        author: "Du Fu (杜甫)",
        content: [
            "国破山河在，城春草木深。",
            "感时花溅泪，恨别鸟惊心。",
            "烽火连三月，家书抵万金。",
            "白头搔更短，浑欲不胜簪。"
        ],
        style: "Wulv",
        image: "/images/gallery/spring_view.png"
    },
    {
        id: 3,
        title: "江雪 (River Snow)",
        author: "Liu Zongyuan (柳宗元)",
        content: [
            "千山鸟飞绝，",
            "万径人踪灭。",
            "孤舟蓑笠翁，",
            "独钓寒江雪。"
        ],
        style: "Wujue",
        image: "/images/gallery/river_snow.png"
    },
    {
        id: 4,
        title: "登鹳雀楼 (On the Stork Tower)",
        author: "Wang Zhihuan (王之涣)",
        content: [
            "白日依山尽，",
            "黄河入海流。",
            "欲穷千里目，",
            "更上一层楼。"
        ],
        style: "Wujue",
        image: "/images/gallery/stork_tower.png"
    },
    {
        id: 5,
        title: "黄鹤楼 (Yellow Crane Tower)",
        author: "Cui Hao (崔颢)",
        content: [
            "昔人已乘黄鹤去，此地空余黄鹤楼。",
            "黄鹤一去不复返，白云千载空悠悠。",
            "晴川历历汉阳树，芳草萋萋鹦鹉洲。",
            "日暮乡关何处是？烟波江上使人愁。"
        ],
        style: "Qilv",
        image: "/images/gallery/yellow_crane_tower.png"
    },
    {
        id: 6,
        title: "春晓 (Spring Dawn)",
        author: "Meng Haoran (孟浩然)",
        content: [
            "春眠不觉晓，",
            "处处闻啼鸟。",
            "夜来风雨声，",
            "花落知多少。"
        ],
        style: "Wujue",
        image: "/images/gallery/spring_dawn.png"
    },
    {
        id: 7,
        title: "鹿柴 (Deer Park)",
        author: "Wang Wei (王维)",
        content: [
            "空山不见人，",
            "但闻人语响。",
            "返景入深林，",
            "复照青苔上。"
        ],
        style: "Wujue",
        image: "/images/gallery/deer_park.png"
    },
    {
        id: 8,
        title: "相思 (Love Seeds)",
        author: "Wang Wei (王维)",
        content: [
            "红豆生南国，",
            "春来发几枝。",
            "愿君多采撷，",
            "此物最相思。"
        ],
        style: "Wujue",
        image: "/images/gallery/love_seeds.png"
    },
    {
        id: 9,
        title: "独坐敬亭山 (Sitting Alone)",
        author: "Li Bai (李白)",
        content: [
            "众鸟高飞尽，",
            "孤云独去闲。",
            "相看两不厌，",
            "只有敬亭山。"
        ],
        style: "Wujue",
        image: "/images/gallery/sitting_alone.png"
    },
    {
        id: 10,
        title: "早发白帝城 (Early Departure)",
        author: "Li Bai (李白)",
        content: [
            "朝辞白帝彩云间，",
            "千里江陵一日还。",
            "两岸猿声啼不住，",
            "轻舟已过万重山。"
        ],
        style: "Qijue",
        image: "/images/gallery/early_departure.png"
    },
    {
        id: 11,
        title: "黄鹤楼送孟浩然之广陵 (Seeing Off)",
        author: "Li Bai (李白)",
        content: [
            "故人西辞黄鹤楼，",
            "烟花三月下扬州。",
            "孤帆远影碧空尽，",
            "唯见长江天际流。"
        ],
        style: "Qijue",
        image: "/images/gallery/seeing_off.png"
    },
    {
        id: 12,
        title: "绝句 (Quatrain)",
        author: "Du Fu (杜甫)",
        content: [
            "两个黄鹂鸣翠柳，",
            "一行白鹭上青天。",
            "窗含西岭千秋雪，",
            "门泊东吴万里船。"
        ],
        style: "Qijue",
        image: "/images/gallery/quatrain_spring.png"
    },
    {
        id: 13,
        title: "出塞 (Frontier Song)",
        author: "Wang Changling (王昌龄)",
        content: [
            "秦时明月汉时关，",
            "万里长征人未还。",
            "但使龙城飞将在，",
            "不教胡马度阴山。"
        ],
        style: "Qijue",
        image: "/images/gallery/frontier_song.png"
    },
    {
        id: 14,
        title: "凉州词 (Liangzhou Song)",
        author: "Wang Han (王翰)",
        content: [
            "葡萄美酒夜光杯，",
            "欲饮琵琶马上催。",
            "醉卧沙场君莫笑，",
            "古来征战几人回？"
        ],
        style: "Qijue",
        image: "/images/gallery/liangzhou_song.png"
    },
    {
        id: 15,
        title: "枫桥夜泊 (Maple Bridge)",
        author: "Zhang Ji (张继)",
        content: [
            "月落乌啼霜满天，",
            "江枫渔火对愁眠。",
            "姑苏城外寒山寺，",
            "夜半钟声到客船。"
        ],
        style: "Qijue",
        image: "/images/gallery/maple_bridge.png"
    },
    {
        id: 16,
        title: "清明 (Qingming)",
        author: "Du Mu (杜牧)",
        content: [
            "清明时节雨纷纷，",
            "路上行人欲断魂。",
            "借问酒家何处有？",
            "牧童遥指杏花村。"
        ],
        style: "Qijue",
        image: "/images/gallery/qingming.png"
    },
    {
        id: 17,
        title: "秋夕 (Autumn Evening)",
        author: "Du Mu (杜牧)",
        content: [
            "银烛秋光冷画屏，",
            "轻罗小扇扑流萤。",
            "天阶夜色凉如水，",
            "坐看牵牛织女星。"
        ],
        style: "Qijue",
        image: "/images/gallery/autumn_evening.png"
    },
    {
        id: 18,
        title: "夜雨寄北 (Night Rain)",
        author: "Li Shangyin (李商隐)",
        content: [
            "君问归期未有期，",
            "巴山夜雨涨秋池。",
            "何当共剪西窗烛，",
            "却话巴山夜雨时。"
        ],
        style: "Qijue",
        image: "/images/gallery/night_rain.png"
    },
    {
        id: 19,
        title: "回乡偶书 (Returning Home)",
        author: "He Zhizhang (贺知章)",
        content: [
            "少小离家老大回，",
            "乡音无改鬓毛衰。",
            "儿童相见不相识，",
            "笑问客从何处来。"
        ],
        style: "Qijue",
        image: "/images/gallery/returning_home.png"
    },
    {
        id: 20,
        title: "赋得古原草送别 (Grass)",
        author: "Bai Juyi (白居易)",
        content: [
            "离离原上草，一岁一枯荣。",
            "野火烧不尽，春风吹又生。",
            "远芳侵古道，晴翠接荒城。",
            "又送王孙去，萋萋满别情。"
        ],
        style: "Wulv",
        image: "/images/gallery/grass.png"
    }
];

// Combine static and dynamic
// Only manage dynamic poems here


const usePoems = () => {
    const { user, isSignedIn } = useUser();
    const { showToast } = useToast();
    const [poems, setPoems] = useState<Poem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'masterpieces';

    useEffect(() => {
        async function loadPoems() {
            setIsLoading(true);
            try {
                let url = '/api/poems/list';
                if (view === 'community') {
                    url += '?view=community';
                }

                if (isSignedIn || view === 'community') {
                    const res = await fetch(url);
                    const data = await res.json();
                    if (data.success) {
                        const mapped = data.poems.map((p: any) => ({
                            ...p,
                            image: p.imageUrl || p.image,
                            isPublic: p.isPublic
                        }));
                        setPoems(mapped);
                    }
                } else if (view === 'my_works') {
                    // LocalStorage fallback for my_works only
                    const saved = JSON.parse(localStorage.getItem('savedPoems') || '[]');
                    setPoems(saved);
                }
            } catch (err) {
                console.error("Failed to load poems", err);
            }
            setIsLoading(false);
        }

        loadPoems();
    }, [isSignedIn, view]);

    const togglePublic = async (id: number, currentStatus: boolean, poem: Poem) => {
        // SCENARIO 1: Signed In User (Toggle Visibility)
        if (isSignedIn) {
            try {
                const res = await fetch('/api/poems/share', {
                    method: 'PUT',
                    body: JSON.stringify({ id, isPublic: !currentStatus })
                });
                const data = await res.json();
                if (data.success) {
                    setPoems(current => current.map(p =>
                        p.id === id ? { ...p, isPublic: !currentStatus } : p
                    ));
                    return !currentStatus;
                }
            } catch (e) {
                console.error("Share failed", e);
            }
            return currentStatus;
        }

        // SCENARIO 2: Anonymous User (Upload or Delete)
        else {
            // Case A: Unshare -> Delete from Server
            if (currentStatus) {
                // Determine server ID
                const serverId = (poem as any).serverId;

                if (!serverId) {
                    return currentStatus;
                }

                try {
                    await fetch('/api/poems/delete', {
                        method: 'DELETE',
                        body: JSON.stringify({ id: serverId })
                    });

                    // Update LocalStorage: remove serverId and set isPublic false
                    const saved = JSON.parse(localStorage.getItem('savedPoems') || '[]');
                    const updated = saved.map((p: any) =>
                        p.id === id ? { ...p, isPublic: false, serverId: undefined } : p
                    );
                    localStorage.setItem('savedPoems', JSON.stringify(updated));

                    // Update State
                    setPoems(current => current.map(p =>
                        p.id === id ? { ...p, isPublic: false, serverId: undefined } : p
                    ));

                    showToast('Poem Unshared (Deleted from Cloud)', 'info');
                    return false;

                } catch (e) {
                    console.error("Anonymous unshare failed", e);
                }
            }

            // Case B: Share -> Upload to Server
            else {
                try {
                    showToast('Publishing to Community...', 'info');
                    const res = await fetch('/api/poems/save', {
                        method: 'POST',
                        body: JSON.stringify({
                            title: poem.title,
                            author: poem.author,
                            content: poem.content,
                            style: poem.style,
                            image: poem.image,
                            isPublic: true
                        })
                    });
                    const data = await res.json();

                    if (data.success) {
                        const serverId = data.poem.id;
                        // Update LocalStorage: add serverId and set isPublic true
                        const saved = JSON.parse(localStorage.getItem('savedPoems') || '[]');
                        const updated = saved.map((p: any) =>
                            p.id === id ? { ...p, isPublic: true, serverId: serverId } : p
                        );
                        localStorage.setItem('savedPoems', JSON.stringify(updated));

                        // Update State
                        setPoems(current => current.map(p =>
                            p.id === id ? { ...p, isPublic: true, serverId: serverId } : p
                        ));
                        showToast('Poem Shared to Community!', 'success');
                        return true;
                    }
                } catch (e) {
                    console.error("Anonymous share failed", e);
                    showToast('Share failed', 'error');
                }
            }
            return currentStatus;
        }
    };

    const deletePoem = async (id: number) => {
        if (isSignedIn) {
            try {
                await fetch('/api/poems/delete', {
                    method: 'DELETE',
                    body: JSON.stringify({ id })
                });
                setPoems(current => current.filter(p => p.id !== id));
            } catch (e) {
                console.error("Delete failed", e);
            }
        } else {
            const saved = JSON.parse(localStorage.getItem('savedPoems') || '[]');
            const updated = saved.filter((p: Poem) => p.id !== id);
            localStorage.setItem('savedPoems', JSON.stringify(updated));
            setPoems(updated);
        }
    };

    return { poems, deletePoem, togglePublic, isLoading };
};

// Extracted Card Component for cleaner render
const PoemCard = ({ poem, index, onDelete, onTogglePublic }: { poem: Poem; index: number; onDelete?: () => void, onTogglePublic?: () => void }) => {
    return (
        <FadeIn delay={index * 0.1}>
            <motion.div
                className={styles.card}
                whileHover={{ y: -5 }}
            >
                <div className={styles.imageWrapper}>
                    <Image
                        src={poem.image}
                        alt={poem.title}
                        fill
                        className={styles.poemImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <span className={styles.tag}>{poem.style}</span>

                {onDelete && (
                    <div className={styles.cardActions}>
                        {onTogglePublic && (
                            <button
                                className={styles.iconBtn}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onTogglePublic();
                                }}
                                title={poem.isPublic ? "Public (Click to hide)" : "Private (Click to share)"}
                            >
                                {poem.isPublic ? <Globe size={18} color="var(--jade-green)" /> : <Lock size={18} />}
                            </button>
                        )}
                        <button
                            className={styles.deleteBtn}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete();
                            }}
                            title="Remove"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}

                <div className={styles.cardContent}>
                    <h3 className={styles.poemTitle}>{poem.title.split('(')[0]}</h3>
                    <p className={styles.poemAuthor}>{poem.author.split('(')[0]}</p>
                    <div className={styles.poemBody}>
                        {poem.content.flatMap(line =>
                            line.replace(/([，。！？])/g, '$1\n').split('\n')
                        )
                            .map(line => line.trim())
                            .filter(line => line.length > 0)
                            .map((line, i) => (
                                <p key={i} style={{ marginBottom: '4px' }}>{line}</p>
                            ))}
                    </div>
                </div>
            </motion.div>
        </FadeIn>
    );
};

function GalleryContent() {
    const { t } = useLanguage();
    const { poems, deletePoem, togglePublic, isLoading } = usePoems();
    const { showToast } = useToast();
    const { isSignedIn } = useUser();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'masterpieces'; // default to masterpieces

    const checkDelete = (id: number) => {
        setDeletingId(id);
    };

    const confirmDelete = () => {
        if (deletingId) {
            deletePoem(deletingId);
            showToast('Poem removed', 'info');
            setDeletingId(null);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className={styles.main}>
                <div className="container">
                    <FadeIn>
                        <header className={styles.pageHeader}>
                            <h1 className={styles.title}>
                                {view === 'masterpieces' && t('gallery.masterpieces')}
                                {view === 'my_works' && t('gallery.my_works')}
                                {view === 'community' && t('gallery.community')}
                            </h1>
                            <p className={styles.subtitle}>
                                {view === 'masterpieces' && t('gallery.masterpieces.subtitle')}
                                {view === 'my_works' && t('gallery.my_works.subtitle')}
                                {view === 'community' && t('gallery.community.subtitle')}
                            </p>
                        </header>
                    </FadeIn>

                    {/* Section 1: Tang Masterpieces */}
                    {view === 'masterpieces' && (
                        <div className={styles.galleryGrid}>
                            {MASTERPIECES.map((poem, index) => (
                                <PoemCard key={poem.id} poem={poem} index={index} />
                            ))}
                        </div>
                    )}

                    {/* Section 2: User Works */}
                    {view === 'my_works' && (
                        <>
                            {poems.length > 0 ? (
                                <div className={styles.galleryGrid}>
                                    {poems.map((poem, index) => (
                                        <PoemCard
                                            key={poem.id}
                                            poem={poem}
                                            index={index}
                                            onDelete={() => checkDelete(poem.id)}
                                            onTogglePublic={() => togglePublic(poem.id, !!poem.isPublic, poem)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                                    <p style={{ color: 'var(--charcoal-gray)', opacity: 0.6 }}>No poems generated yet. Go to Compose to create your first masterpiece!</p>
                                    <Link href="/compose" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                        {t('hero.start')}
                                    </Link>
                                </div>
                            )}
                        </>
                    )}

                    {/* Section 3: Community */}
                    {view === 'community' && (
                        <div className={styles.galleryGrid}>
                            {poems.map((poem, index) => (
                                <PoemCard key={poem.id} poem={poem} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <ConfirmModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title={t('compose.msg.delete_title') || "Delete Poem"}
                message={t('compose.msg.delete_confirm') || "Are you sure you want to remove this poem from your collection? This action cannot be undone."}
            />
        </div>
    );
}

export default function GalleryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GalleryContent />
        </Suspense>
    );
}
