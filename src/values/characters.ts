import { RegisteredCharacters } from "@drincs/pixi-vn";
import Character from "../models/Character";

export const storyteller = new Character("storyteller", {
    name: "Сказитель",
    color: "#8B4513", // Коричневый
});

export const jakyp = new Character("jakyp", {
    name: "Жакып бай",
    color: "#556B2F", // Темно-оливковый
});

export const chiyirdi = new Character("chiyirdi", {
    name: "Чыйырды",
    color: "#8A2BE2", // Фиолетовый
});

export const manas_baby = new Character("manas_baby", {
    name: "Манас",
    color: "#B22222", // Темно-красный
});

export const spy = new Character("spy", {
    name: "Эсенкандын тыңчысы",
    color: "#2F4F4F", // Темно-серый
});

RegisteredCharacters.add([storyteller, jakyp, chiyirdi, manas_baby, spy]);
