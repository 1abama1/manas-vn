import { moveIn, moveOut, narration, newChoiceOption, newLabel, showImage, storage } from "@drincs/pixi-vn";
import { Assets } from "pixi.js";
import { storyteller, jakyp, chiyirdi, spy } from "../values/characters";

export const act1 = newLabel(
    "act1",
    [
        // Сцена 1: Скорбь Жакыпа
        async () => {
            // Фон: Темная юрта изнутри
            await showImage("bg", "bg_yurta", { width: 1920, height: 1080 });

            // На экране появляется спрайт Сказителя.
            await moveIn(
                "storyteller",
                {
                    value: ["storyteller_base"], // Основной спрайт сказителя
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up", ease: "circInOut", type: "spring" }
            );

            narration.dialogue = {
                character: storyteller,
                text: `Байлыгы ашып-ташып турса да, артымда калар балам жок деп, Жакып байдын кабыргасы сөгүлүп, көзүнөн жашы төгүлүп турган кези. Түп атасы Түгөл кан, башкы атасы баары кан, Каракандан Жакып кан. Малды күттүм, балам жок деп, жараткандан тилеп зарлап жаткан убагы.`
            };
        },
        async () => {
            // Экран затемняется
            await showImage("bg", "bg_black", { width: 1920, height: 1080 });
            await moveOut("storyteller", { direction: "down" });

            // Появляется спрайт Жакыпа
            await moveIn(
                "jakyp",
                {
                    value: ["jakyp_sad"], // Эмоция: отчаяние
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: jakyp,
                text: `Малды күттүм, балам жок,\nЖараткандан көп тилейм –\nМенин бала күтөр чамам жок.\nТоодогу жылкым тогуз сан\nТозокко жыйган каран мал,\nМуну тосуп алуучу\nТозоктуу дүйнө балам жок!\nАргымак бактым мээси жок,\nМуну баптап минер ээси жок!`
            };
        },
        async () => {
            // Звук сердцебиения. Фон меняется на абстрактное звездное небо с парящим гигантским белым соколом.
            await showImage("bg", "bg_falcon_dream", { width: 1920, height: 1080 });
            await moveOut("jakyp", { direction: "down" });

            await moveIn(
                "storyteller",
                {
                    value: ["storyteller_base"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: storyteller,
                text: `Ошол түнү Жакып бай уктап жатып түш көрүп, түшүндө бир укмуштуу иш көрүп, жүрөгү туйлап ойгонду. Түшүндө Ала-Тоонун башынан алп кара куш кармаптыр, ал куштун көлөкөсү бүткүл ааламды жааптыр.`
            };
        },
        async () => {
            // Возвращается фон юрты
            await showImage("bg", "bg_yurta", { width: 1920, height: 1080 });
            await moveOut("storyteller", { direction: "down" });

            // Спрайт Жакыпа меняет эмоцию
            await moveIn(
                "jakyp",
                {
                    value: ["jakyp_hope"], // Эмоция: потрясение, надежда
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: jakyp,
                text: `Оо, жараткан! Түндө бир жатып түш көрдүм, мен түшүмдө мыкты иш көрдүм! Мен бир бала барчын бүркүт кармадым. Бул эмнеси болду экен? Байбичем Чыйырдынын боюна бүтүп, мага бир арслан уул келе турган окшойт! Ата-бабалардын арбагына сыйынып, мал союп түлөө өткөрөйүн!`
            };
        },
        async () => {
            narration.dialogue = `Куда направиться Жакыпу на рассвете для молитвы?`;
            narration.choices = [
                newChoiceOption("[Баруу: Ата-бабалардын бейитине] (Пойти к камням предков)", act1_branch_a, {}, { type: "jump" }),
                newChoiceOption("[Баруу: Сансыз жылкыларына] (Пойти к табунам)", act1_branch_b, {}, { type: "jump" })
            ];
        }
    ],
    {
        onLoadingLabel: () => {
            // Предварительная загрузка картинок
            Assets.backgroundLoadBundle(["act1"]);
        },
    }
);

export const act1_branch_a = newLabel(
    "act1_branch_a",
    [
        async () => {
            await showImage("bg", "bg_balbal", { width: 1920, height: 1080 }); // Очертания древних балбалов
            await moveOut("jakyp", { direction: "down" });

            await moveIn(
                "storyteller",
                {
                    value: ["storyteller_base"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: storyteller,
                text: `Абаң Жакып ата-бабаларынын бейитине барып, Огой кан менен Балаканды эстеп, жаратканга жалбарды.`
            };
        },
        async () => {
            await moveOut("storyteller", { direction: "down" });
            await moveIn(
                "jakyp",
                {
                    value: ["jakyp_hope"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: jakyp,
                text: `Оо, арбактар, колдой көр! Түп атабыз Түгөл кан, Огой кан менен Балакан! Ошолордун канынан бүткөн, душманга алдырбас, аркама жөлөк болор бир уул бере көр!`
            };
        },
        async () => {
            storage.set("codex_tugol_kan", true);
            narration.dialogue = `(Вы помолились предкам)\n**Системное уведомление:** Вы получили запись в кодекс 'Родословная Түгөл кана'!`;
        },
        async (props) => {
            return await narration.jump(act1_scene2, props);
        }
    ]
);

export const act1_branch_b = newLabel(
    "act1_branch_b",
    [
        async () => {
            await showImage("bg", "bg_horses", { width: 1920, height: 1080 }); // Бескрайняя ночная степь, силуэты лошадей
            await moveOut("jakyp", { direction: "down" });

            await moveIn(
                "storyteller",
                {
                    value: ["storyteller_base"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: storyteller,
                text: `Кайран Жакып өзүнүн сансыз жылкыларына келип, адырда жаткан алты сан малын карап толгонду.`
            };
        },
        async () => {
            await moveOut("storyteller", { direction: "down" });
            await moveIn(
                "jakyp",
                {
                    value: ["jakyp_hope"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: jakyp,
                text: `Адырда жылкым алты сан, булардын баары ээсиз калабы? Жок, жараткан буюрса, ушул малга ээ болор, элимди коргой турган кабылан уул келет!`
            };
        },
        async () => {
            storage.set("codex_jakyp_wealth", true);
            narration.dialogue = `(Вы обошли свои бесчисленные табуны)\n**Системное уведомление:** Вы получили запись в кодекс 'Богатства Жакыпа'!`;
        },
        async (props) => {
            return await narration.jump(act1_scene2, props);
        }
    ]
);

export const act1_scene2 = newLabel(
    "act1_scene2",
    [
        async () => {
            await showImage("bg", "bg_yurta_outside", { width: 1920, height: 1080 }); // Снаружи юрты
            await moveOut("jakyp", { direction: "down" });

            // Внезапная вспышка ослепительного света (замена на белый фон на секунду)
            await showImage("bg", "bg_white", { width: 1920, height: 1080 });
            await new Promise((resolve) => setTimeout(resolve, 500));
            await showImage("bg", "bg_yurta_outside", { width: 1920, height: 1080 });

            await moveIn(
                "storyteller",
                {
                    value: ["storyteller_base"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: storyteller,
                text: `Тогуз ай, тогуз күн өтүп, байбиче Чыйырды толготуп, жер-ааламды дүңгүрөтүп, арслан Манас туулду.\nБаркырап бала түшкөндө\nТүшкөн жерден чаң чыкты,\nЫйлаганда балага\nЖүрөк туйлап жан чыкты!`
            };
        },
        async () => {
            await moveOut("storyteller", { direction: "down" });
            await moveIn(
                "chiyirdi",
                {
                    value: ["chiyirdi_shock"], // Изнеможение и ужас
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: chiyirdi,
                text: `Айланайын кулунум! Оң колуна кара кан, сол колуна сары алтын уучтай түштү. Бул жөн бала эмес, ааламды бузар шер экен!`
            };
        },
        async () => {
            await moveOut("chiyirdi", { direction: "down" });
            await moveIn(
                "storyteller",
                {
                    value: ["storyteller_base"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: storyteller,
                text: `Баланын атын Манас коюшту. Кара чаар кабылан капталында чамынып, көсөө куйрук көк арслан оң жагында комдонуп турду. Ошол кезде Каканчындын Бээжинден Эсенкан жиберген тыңчылар Манастын туулганын сезип, тымызын келип калган эле.`
            };
        },
        async () => {
            // Потемнение и появление лазутчика
            await showImage("bg", "bg_spy_attack", { width: 1920, height: 1080 });
            await moveOut("storyteller", { direction: "down" });

            await moveIn(
                "spy",
                {
                    value: ["spy_attack"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up", ease: "circInOut", type: "spring", duration: 0.5 }
            );

            narration.dialogue = {
                character: spy,
                text: `Бул буруттан Манас чыгат деп бичигибизде жазылды эле. Эрешен тартып эр болгуча, бешигинде мууздап кетейин!`
            };
        },
        async () => {
            // Смена на младенца
            await moveOut("spy", { direction: "down", duration: 0.1 });
            await moveIn(
                "manas_baby",
                {
                    value: ["manas_neon_eyes"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up", duration: 0.2 }
            );

            await moveIn(
                "storyteller",
                {
                    value: ["storyteller_base"],
                    options: { xAlign: 0.2, yAlign: 1 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: storyteller,
                text: `Бирок, ымыркай Манас бешиктен ыргып чыгып, тыңчынын найзасын кармай алды. Жалаңдаган душмандын жүрөгү түшүп, жан талпагын таштады. Арслан Манас ушинтип ааламга келди! Аалам силкинди!`
            };
        },
        async () => {
            await showImage("bg", "bg_black", { width: 1920, height: 1080 });
            await moveOut("manas_baby", { direction: "down" });
            await moveOut("storyteller", { direction: "down" });

            narration.dialogue = `(Конец Акта I)`;
        }
    ]
);
