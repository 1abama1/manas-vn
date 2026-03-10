import { Box, FormLabel, Slider, Stack } from "@mui/joy";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AudioManager from "../../utils/AudioManager";

export default function SoundSettings() {
    const { t } = useTranslation(["ui"]);

    // Local state to force rerender on slider change if needed, 
    // though AudioManager handles the logic.
    const [master, setMaster] = useState(AudioManager.getMasterVolume() * 100);
    const [music, setMusic] = useState(AudioManager.getMusicVolume() * 100);
    const [sfx, setSfx] = useState(AudioManager.getSfxVolume() * 100);

    const handleMasterChange = (_: Event | any, newValue: number | number[]) => {
        const val = newValue as number;
        setMaster(val);
        AudioManager.setMasterVolume(val / 100);
    };

    const handleMusicChange = (_: Event | any, newValue: number | number[]) => {
        const val = newValue as number;
        setMusic(val);
        AudioManager.setMusicVolume(val / 100);
    };

    const handleSfxChange = (_: Event | any, newValue: number | number[]) => {
        const val = newValue as number;
        setSfx(val);
        AudioManager.setSfxVolume(val / 100);
    };

    return (
        <Stack gap={2}>
            <Box>
                <FormLabel sx={{ typography: "title-sm", mb: 1, color: "white" }}>
                    {t("master_volume")} ({Math.round(master)}%)
                </FormLabel>
                <Slider
                    value={master}
                    onChange={handleMasterChange}
                    min={0}
                    max={100}
                    step={1}
                    size="sm"
                    valueLabelDisplay="auto"
                    sx={{ color: "primary.300", mx: 3, maxWidth: 350 }}
                />
            </Box>

            <Box>
                <FormLabel sx={{ typography: "title-sm", mb: 1, color: "white" }}>
                    {t("music_volume")} ({Math.round(music)}%)
                </FormLabel>
                <Slider
                    value={music}
                    onChange={handleMusicChange}
                    min={0}
                    max={100}
                    step={1}
                    size="sm"
                    valueLabelDisplay="auto"
                    sx={{ color: "primary.300", mx: 3, maxWidth: 350 }}
                />
            </Box>

            <Box>
                <FormLabel sx={{ typography: "title-sm", mb: 1, color: "white" }}>
                    {t("sfx_volume")} ({Math.round(sfx)}%)
                </FormLabel>
                <Slider
                    value={sfx}
                    onChange={handleSfxChange}
                    min={0}
                    max={100}
                    step={1}
                    size="sm"
                    valueLabelDisplay="auto"
                    sx={{ color: "primary.300", mx: 3, maxWidth: 350 }}
                />
            </Box>
        </Stack>
    );
}
