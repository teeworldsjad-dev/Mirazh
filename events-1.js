window.EVENTS = window.EVENTS || [];

window.EVENTS.push(
  {
    id: "event_cola_gift",
    trigger: "work",
    weight: 20,
    for: "all",
    title: "Кола в подарок",
    emoji: "🥤",
    text: "Водитель подарил два литра колы. Настроение поднялось, как цены на песок.",
    effects: {
      mood: 15
    }
  },

  {
    id: "event_driver_fall",
    trigger: "work",
    weight: 12,
    for: "all",
    title: "Водитель упал",
    emoji: "😂",
    text: "Водитель поскользнулся на весах. Крича ударился. Смешно, но по ТБ нельзя.",
    effects: {
      mood: 25
    }
  },

  {
    id: "event_drunk_singing",
    trigger: "work",
    weight: 25,
    minDrunk: 50,
    for: "all",
    title: "Песня для водителя",
    emoji: "🎤",
    text: "Ты спел водителю про вахту. Водитель смеётся. Начальство пока не слышит.",
    effects: {
      mood: 10,
      loyalty: -5
    }
  },

  {
    id: "event_drunk_hug_scales",
    trigger: "work",
    weight: 25,
    minDrunk: 80,
    for: "all",
    title: "Обнял весы",
    emoji: "🤗",
    text: "Ты попытался обнять весы, потому что они «тоже люди».",
    effects: {
      mood: 5,
      loyalty: -10,
      energy: -10
    }
  },

  {
    id: "event_boss_call",
    trigger: "work",
    weight: 30,
    maxLoyalty: 25,
    for: "all",
    title: "Начальство звонит",
    emoji: "📞",
    text: "Телефон разрывается. Начальство хочет знать, почему всё так плохо.",
    choices: [
      {
        label: "📞 Ответить честно",
        effects: { loyalty: 5, mood: -5 },
        resultTitle: "Честный разговор",
        resultText: "Ты ответил честно. Начальство выслушало и сказало: «Ну-ну».",
        resultEmoji: "📞"
      },
      {
        label: "🚫 Не брать трубку",
        effects: { loyalty: -10, mood: -5 },
        resultTitle: "Игнор",
        resultText: "Ты не взял трубку. Начальство запомнило.",
        resultEmoji: "🚫"
      },
      {
        label: "💻 Сказать: «1С висит»",
        effects: { loyalty: 2, mood: -5 },
        resultTitle: "Классика",
        resultText: "Ты сказал, что 1С висит. Начальство сделало вид, что поверило.",
        resultEmoji: "💻"
      }
    ]
  },

  {
    id: "event_theft_audit",
    trigger: "work",
    weight: 35,
    minTheftTons: 40,
    for: "all",
    title: "Склад сверяет тонны",
    emoji: "🧾",
    text: "Склад говорит, что песка меньше, чем в 1С. Кто-то явно мутил слишком красиво.",
    choices: [
      {
        label: "🤷 Сделать вид, что не понимаешь",
        effects: { loyalty: -10, mood: -5 },
        resultTitle: "Умное лицо",
        resultText: "Ты сделал умное лицо. Склад не поверил, но отстал.",
        resultEmoji: "🤷"
      },
      {
        label: "🐸 Свалить на Жабинского",
        effects: { loyalty: 5, mood: -5 },
        resultTitle: "Жабинский виноват",
        resultText: "Жабинский теперь твой враг, но склад отстал.",
        resultEmoji: "🐸"
      },
      {
        label: "💸 Вернуть часть денег",
        effects: { money: -1500, loyalty: 10, theftTons: -10 },
        resultTitle: "Откупился",
        resultText: "Ты вернул часть денег. Тонны стали честнее.",
        resultEmoji: "💸"
      }
    ]
  },

  {
    id: "event_energy_low",
    trigger: "work",
    weight: 30,
    maxEnergy: 20,
    for: "all",
    title: "Глаза закрываются",
    emoji: "😵",
    text: "Ты засыпаешь стоя. Кнопка «Выполнить» плывёт.",
    choices: [
      {
        label: "⚡ Купить энергетик",
        effects: { money: -200, energy: 25, mood: 5 },
        resultTitle: "Энергетик",
        resultText: "Энергетик помогает. Сердце негодует.",
        resultEmoji: "⚡"
      },
      {
        label: "🧊 Умыться ледяной водой",
        effects: { energy: 10, mood: -5 },
        resultTitle: "Ледяная вода",
        resultText: "Вода ледяная. Ты тоже.",
        resultEmoji: "🧊"
      },
      {
        label: "🧍 Постоять на месте",
        effects: { energy: 5 },
        resultTitle: "Медитация",
        resultText: "Ты стоишь. Водители думают, что ты медитируешь.",
        resultEmoji: "🧍"
      }
    ]
  },

  {
    id: "event_food_low",
    trigger: "work",
    weight: 30,
    maxFood: 20,
    for: "all",
    title: "Голод",
    emoji: "🍽",
    text: "Желудок требует еду. Даже обед Гули кажется вариантом.",
    choices: [
      {
        label: "🍜 Купить дошик",
        effects: { money: -80, food: 20, mood: -3 },
        resultTitle: "Дошик",
        resultText: "Дошик. Грустно, но съедобно.",
        resultEmoji: "🍜"
      },
      {
        label: "😬 Терпеть",
        effects: { mood: -10, energy: -10 },
        resultTitle: "Сила воли",
        resultText: "Ты терпишь. Организм запоминает.",
        resultEmoji: "😬"
      },
      {
        label: "🥪 Выклянчить бутер у охранника",
        effects: { food: 15, mood: 5, loyalty: -3 },
        resultTitle: "Бутер",
        resultText: "Охранник дал бутер. Теперь ты ему должен.",
        resultEmoji: "🥪"
      }
    ]
  },

  {
    id: "event_sasha_bed",
    trigger: "work",
    weight: 20,
    for: "sasha",
    title: "Койка зовёт",
    emoji: "🛏",
    text: "Саша смотрит на койку. Койка смотрит на Сашу. Валера смотрит на обоих.",
    choices: [
      {
        label: "😴 Прилечь на 10 минут",
        effects: { energy: 25, mood: 10, valeraFatigue: 12, progress: 1, loyalty: 1 },
        resultTitle: "Мини-сон",
        resultText: "Саша прилёг. Валера взвесил одну машину. Начальство видит тишину и думает, что всё под контролем.",
        resultEmoji: "😴"
      },
      {
        label: "🧑‍💻 Работать",
        effects: { mood: -5, energy: -5, loyalty: 3 },
        resultTitle: "Неожиданно",
        resultText: "Саша работает. Валера удивлён. Начальство почти растрогано.",
        resultEmoji: "🧑‍💻"
      }
    ]
  },

  {
    id: "event_valera_fix_scales",
    trigger: "work",
    weight: 20,
    for: "valera",
    title: "Весы скрипят",
    emoji: "🛠",
    text: "Валера вышел поправить весы. Никто не просил, но надо.",
    effects: {
      loyalty: 10,
      mood: -10,
      energy: -5
    }
  }
);