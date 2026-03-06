import { Box, Button, FormHelperText, FormLabel, ToggleButtonGroup } from "@mui/joy";
import { useTranslation } from "react-i18next";

export default function LanguageSettings() {
    const { t, i18n } = useTranslation(["ui"]);

    return (
        <Box>
            <Box mb={1}>
                <FormLabel sx={{ typography: "title-sm" }}>{t("language")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>{t("language_description")}</FormHelperText>
            </Box>
            <ToggleButtonGroup
                value={i18n.language}
                onChange={(_, newValue) => {
                    if (newValue) {
                        i18n.changeLanguage(newValue);
                        localStorage.setItem("app_language", newValue);
                    }
                }}
            >
                <Button value="ky">Кыргызча</Button>
                <Button value="ru">Русский</Button>
                <Button value="en">English</Button>
            </ToggleButtonGroup>
        </Box>
    );
}
