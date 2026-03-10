import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MAIN_MENU_ROUTE } from "../constans";
import "./CreditsScreen.css";

export default function CreditsScreen() {
    const navigate = useNavigate();
    const { t } = useTranslation(["ui"]);
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    const startHolding = () => {
        setIsHolding(true);
        setHoldProgress(0);

        const startTime = Date.now();
        const duration = 2000; // 2 секунды

        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setHoldProgress(progress);

            if (progress >= 100) {
                if (progressInterval.current) clearInterval(progressInterval.current);
                navigate(MAIN_MENU_ROUTE);
            }
        }, 10);
    };

    const stopHolding = () => {
        setIsHolding(false);
        setHoldProgress(0);
        if (progressInterval.current) clearInterval(progressInterval.current);
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
            <div className="credits-list">
                <div className="credit-block">
                    <h2 className="credit-role">{t("credits_developer_teamlead")}</h2>
                    <p className="credit-name">{t("credits_name_developer_teamlead")}</p>
                </div>

                <div className="credit-block">
                    <h2 className="credit-role">{t("credits_artist")}</h2>
                    <p className="credit-name">{t("credits_name_artist")}</p>
                </div>

                <div className="credit-block">
                    <h2 className="credit-role">{t("credits_sound_director")}</h2>
                    <p className="credit-name">{t("credits_name_sound_director")}</p>
                </div>

                <div className="credit-block">
                    <h2 className="credit-role">{t("credits_sound_assistant")}</h2>
                    <p className="credit-name">{t("credits_name_sound_assistant")}</p>
                </div>
            </div>

            <div
                className="thank-you-wrapper"
                onAnimationEnd={() => navigate(MAIN_MENU_ROUTE)}
            >
                <div className="credit-block">
                    <h2 className="credit-role" style={{ color: "white", fontSize: "3rem" }}>
                        {t("credits_thanks_playing")}
                    </h2>
                </div>
            </div>

            <div className={`skip-progress-container ${isHolding ? 'active' : ''}`}>
                <div className="skip-progress-bar" style={{ width: `${holdProgress}%` }}></div>
            </div>

            <div className="credits-skip">
                {t("credits_hold_to_skip")}
            </div>
        </div>
    );
}
