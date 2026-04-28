import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MAIN_MENU_ROUTE } from "../constans";
import AudioManager from "../utils/AudioManager";
import "./CreditsScreen.css";

// ── Статичные данные звёзд — генерируются один раз ──────────
const STARS = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 2}px`,
    dur: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
}));

// ── SVG орнамент (кыргызский «туюнтма» стилизованный) ───────
function KyrgyzOrnament() {
    return (
        <svg viewBox="0 0 600 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Центральный ромб */}
            <polygon
                points="300,10 320,40 300,70 280,40"
                stroke="#c8923a" strokeWidth="1.5" fill="none"
            />
            <polygon
                points="300,22 312,40 300,58 288,40"
                stroke="#c8923a" strokeWidth="0.8" fill="rgba(200,146,58,0.1)"
            />
            {/* Горизонтальные линии от центра */}
            <line x1="320" y1="40" x2="580" y2="40" stroke="#c8923a" strokeWidth="0.8" opacity="0.6" />
            <line x1="280" y1="40" x2="20" y2="40" stroke="#c8923a" strokeWidth="0.8" opacity="0.6" />
            {/* Узор справа */}
            {[360, 410, 455, 495, 530, 558, 580].map((x, i) => (
                <circle key={`r${i}`} cx={x} cy={40} r={i % 2 === 0 ? 3 : 1.5}
                    stroke="#c8923a" strokeWidth="0.8" fill="none" opacity={0.8 - i * 0.1} />
            ))}
            {/* Узор слева */}
            {[240, 190, 145, 105, 70, 42, 20].map((x, i) => (
                <circle key={`l${i}`} cx={x} cy={40} r={i % 2 === 0 ? 3 : 1.5}
                    stroke="#c8923a" strokeWidth="0.8" fill="none" opacity={0.8 - i * 0.1} />
            ))}
            {/* Угловые завитки */}
            <path d="M 20 40 Q 10 20 20 10" stroke="#c8923a" strokeWidth="0.8" fill="none" opacity="0.4" />
            <path d="M 20 40 Q 10 60 20 70" stroke="#c8923a" strokeWidth="0.8" fill="none" opacity="0.4" />
            <path d="M 580 40 Q 590 20 580 10" stroke="#c8923a" strokeWidth="0.8" fill="none" opacity="0.4" />
            <path d="M 580 40 Q 590 60 580 70" stroke="#c8923a" strokeWidth="0.8" fill="none" opacity="0.4" />
        </svg>
    );
}

// ── Компонент ────────────────────────────────────────────────
export default function CreditsScreen() {
    const navigate = useNavigate();
    const { t } = useTranslation(["ui"]);
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Очистка при анмаунте
    useEffect(() => {
        return () => {
            AudioManager.stopMusic(1500);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // ── Удержание для пропуска ───────────────────────────────
    const startHolding = () => {
        setIsHolding(true);
        setHoldProgress(0);
        const startTime = Date.now();
        const duration = 2000;

        intervalRef.current = setInterval(() => {
            const progress = Math.min(((Date.now() - startTime) / duration) * 100, 100);
            setHoldProgress(progress);
            if (progress >= 100) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                navigate(MAIN_MENU_ROUTE);
            }
        }, 16); // ~60fps
    };

    const stopHolding = () => {
        setIsHolding(false);
        setHoldProgress(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    return (
        <div
            className="credits-container"
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
        >
            {/* ── Фоновые звёзды ── */}
            <div className="credits-stars" aria-hidden="true">
                {STARS.map((s) => (
                    <div
                        key={s.id}
                        className="credits-star"
                        style={{
                            top: s.top,
                            left: s.left,
                            width: s.size,
                            height: s.size,
                            ['--dur' as string]: s.dur,
                            ['--delay' as string]: s.delay,
                        }}
                    />
                ))}
            </div>

            {/* ── Декоративные рамки ── */}
            <div className="credits-frame-line left" aria-hidden="true" />
            <div className="credits-frame-line right" aria-hidden="true" />

            {/* ── Орнамент сверху ── */}
            <div className="credits-ornament-top" aria-hidden="true">
                <KyrgyzOrnament />
            </div>

            {/* ── Орнамент снизу ── */}
            <div className="credits-ornament-bottom" aria-hidden="true">
                <KyrgyzOrnament />
            </div>

            {/* ── Список имён ── */}
            <div className="credits-list">
                <CreditBlock
                    role={t("credits_developer_teamlead")}
                    name={t("credits_name_developer_teamlead")}
                />
                <CreditBlock
                    role={t("credits_artist")}
                    name={t("credits_name_artist")}
                />
                <CreditBlock
                    role={t("credits_sound_director")}
                    name={t("credits_name_sound_director")}
                />
                <CreditBlock
                    role={t("credits_sound_assistant")}
                    name={t("credits_name_sound_assistant")}
                />
            </div>

            {/* ── «Спасибо» в конце ── */}
            <div
                className="thank-you-wrapper"
                onAnimationEnd={() => navigate(MAIN_MENU_ROUTE)}
            >
                <div className="thank-you-divider" />
                <p className="thank-you-title">{t("credits_thanks_playing")}</p>
                <p className="thank-you-subtitle">Манас · Manas · Манас</p>
                <div className="thank-you-divider" />
            </div>

            {/* ── Прогресс-бар пропуска ── */}
            <div className={`skip-progress-container ${isHolding ? "active" : ""}`}>
                <div className="skip-progress-label">{t("credits_hold_to_skip")}</div>
                <div className="skip-progress-track">
                    <div className="skip-progress-bar" style={{ width: `${holdProgress}%` }} />
                </div>
            </div>

            {/* ── Подсказка (исчезает при удержании) ── */}
            {!isHolding && (
                <div className="credits-skip">{t("credits_hold_to_skip")}</div>
            )}
        </div>
    );
}

// ── Переиспользуемый блок имени ──────────────────────────────
function CreditBlock({ role, name }: { role: string; name: string }) {
    return (
        <div className="credit-block">
            <p className="credit-role">{role}</p>
            <p className="credit-name">{name}</p>
        </div>
    );
}