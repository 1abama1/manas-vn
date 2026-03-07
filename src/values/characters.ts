import { RegisteredCharacters } from "@drincs/pixi-vn";
import Character from "../models/Character";

export const storyteller = new Character("storyteller", {
    name: "character_storyteller",
    color: "#8B4513", // Коричневый
});

export const jakyp = new Character("jakyp", {
    name: "character_jakyp",
    color: "#556B2F", // Темно-оливковый
});

export const chiyirdi = new Character("chiyirdi", {
    name: "character_chiyirdi",
    color: "#8A2BE2", // Фиолетовый
});

export const manas_baby = new Character("manas_baby", {
    name: "character_manas_baby",
    color: "#B22222", // Темно-красный
});

export const spy = new Character("spy", {
    name: "character_spy",
    color: "#2F4F4F", // Темно-серый
});

export const manas = new Character("manas", {
    name: "character_manas",
    color: "#8B0000", // Темно-красный (взрослый)
});

export const bakai = new Character("bakai", {
    name: "character_bakai",
    color: "#4682B4", // Стальной синий
});

export const almambet = new Character("almambet", {
    name: "character_almambet",
    color: "#DAA520", // Золотистый
});

export const kanykei = new Character("kanykei", {
    name: "character_kanykei",
    color: "#9932CC", // Темная орхидея (фиолетовый)
});

RegisteredCharacters.add([storyteller, jakyp, chiyirdi, manas_baby, spy, manas, bakai, almambet, kanykei]);
