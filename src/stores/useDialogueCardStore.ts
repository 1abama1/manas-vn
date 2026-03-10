import { create } from "zustand";

type DialogueCardStoreType = {
    /**
     * Height of the dialogue card
     */
    height: number;
    /**
     * Set the height of the dialogue card
     */
    setHeight: (value: number) => void;
    /**
     * Width of the image in the dialogue card
     */
    imageWidth: number;
    /**
     * Set the width of the image in the dialogue card
     */
    setImageWidth: (value: number) => void;
};

const useDialogueCardStore = create<DialogueCardStoreType>((set) => ({
    height: 25,
    setHeight: (_value: number) => {
        // Height is fixed at 25% — not editable by the user
    },
    imageWidth: localStorage.getItem("dialogue_card_image_width")
        ? parseInt(localStorage.getItem("dialogue_card_image_width")!)
        : 16,
    setImageWidth: (value: number) => {
        localStorage.setItem("dialogue_card_image_width", value.toString());
        set({ imageWidth: value });
    },
}));
export default useDialogueCardStore;
