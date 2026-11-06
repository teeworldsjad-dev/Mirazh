window.EVENTS = window.EVENTS || [];

window.EVENTS.push(
  // 1
  {
    id: "event_gulya_liver",
    trigger: "work",
    once: true,
    weight: 18,
    for: "all",
    title: "Обед от Гули: печень",
    emoji: "🍲",
    text: "Гуля принесла печень с перловкой. Это стояло на солнце так долго, что уже считается биологическим оружием.",
    choices: [
      {
        label: "🍽 Съесть",
        effects: { food: 25, mood: -20, energy: -25, missedTrucks: 3 },
        resultTitle: "Съел помои",
        resultText: "Ты съел. Желудок подал жалобу. Начальство не приняло.",
        resultEmoji: "🚽"
      },
      {
        label: "🗑 Выбросить",
        effects: { mood: 5, food: -5 },
        resultTitle: "Правильный выбор",
        resultText: "Ты выбросил это. Вместо еды — бутер из подорожника на батарее.",
        resultEmoji: "🥪"
      },
      {
        label: "🧑‍🔧 Скормить собаке",
        effects: { mood: 10, valeraFatigue: 10, loyalty: -3 },
        resultTitle: "Собака ест. Собака грустит",
        resultText: "Собака зашла в вагон и насрала под кровать.",
        resultEmoji: "🧑‍🔧"
      }
    ]
  },

  // 2
  {
    id: "event_gulya_pasta",
    trigger: "work",
    once: true,
    weight: 18,
    for: "all",
    title: "Обед от Гули: макароны",
    emoji: "🍝",
    text: "Макароны слиплись в кирпич. Если постучать, можно вызвать дождь из крошек.",
    choices: [
      {
        label: "🍽 Съесть",
        effects: { food: 20, mood: -15, energy: -15, missedTrucks: 2 },
        resultTitle: "Кирпич съеден",
        resultText: "Ты съел. Внутри теперь стройматериал.",
        resultEmoji: "🧱"
      },
      {
        label: "🗑 Выбросить",
        effects: { mood: 5, food: -5 },
        resultTitle: "Мусор принял",
        resultText: "Ты выбросил кирпич. Помойка выглядела довольной.",
        resultEmoji: "🗑"
      },
      {
        label: "🚪 Подпереть дверь",
        effects: { mood: 10, loyalty: -3 },
        resultTitle: "Хозяйственный подход",
        resultText: "Теперь дверь не хлопает. Гуля обиделась.",
        resultEmoji: "🚪"
      }
    ]
  },

  // 3
  {
    id: "event_gulya_compote",
    trigger: "work",
    once: true,
    weight: 18,
    for: "all",
    title: "Обед от Гули: компот",
    emoji: "🥤",
    text: "Компот из сухофруктов, ржавчины и вчерашнего настроения.",
    choices: [
      {
        label: "🥤 Выпить",
        effects: { food: 15, mood: -15, energy: -10 },
        resultTitle: "Компот выпит",
        resultText: "Ты выпил. Во рту теперь маленький филиал болота.",
        resultEmoji: "🤢"
      },
      {
        label: "🚰 Вылить",
        effects: { mood: 5 },
        resultTitle: "Вылил",
        resultText: "Ты вылил компот. Раковина задумалась о жизни.",
        resultEmoji: "🚰"
      },
      {
        label: "🚚 Отдать водителю",
        effects: { mood: 5, loyalty: -5 },
        resultTitle: "Водитель обманут",
        resultText: "Водитель сделал глоток и посмотрел на тебя с предательством.",
        resultEmoji: "🚚"
      }
    ]
  },

  // 4
  {
    id: "event_gulya_salad",
    trigger: "work",
    once: true,
    weight: 18,
    for: "all",
    title: "Обед от Гули: салат",
    emoji: "🥗",
    text: "Салат из капусты, лука и отчаяния. Заправка — солнце.",
    choices: [
      {
        label: "🍽 Съесть",
        effects: { food: 15, mood: -18, energy: -15 },
        resultTitle: "Салат съеден",
        resultText: "Ты съел. Теперь ты тоже немного капуста.",
        resultEmoji: "🥬"
      },
      {
        label: "🗑 Выбросить",
        effects: { mood: 5, food: -5 },
        resultTitle: "Выбросил",
        resultText: "Ты выбросил салат. Где-то вздохнула помойка.",
        resultEmoji: "🗑"
      },
      {
        label: "🐦 Покормить голубя",
        effects: { mood: 10, loyalty: -2 },
        resultTitle: "Голубь пострадал",
        resultText: "Голубь клюнул, посмотрел на тебя и улетел пешком.",
        resultEmoji: "🐦"
      }
    ]
  },

  // 5
  {
    id: "event_gulya_plov",
    trigger: "work",
    once: true,
    weight: 18,
    for: "all",
    title: "Обед от Гули: плов",
    emoji: "🍚",
    text: "Плов, где мясо видело рис издалека. Рис видел морковку во сне.",
    choices: [
      {
        label: "🍽 Съесть",
        effects: { food: 25, mood: -25, energy: -30, missedTrucks: 4 },
        resultTitle: "Плов съеден",
        resultText: "Ты съел это. Следующий час ты будешь помнить всегда.",
        resultEmoji: "🚽"
      },
      {
        label: "⚰️ Закопать",
        effects: { mood: 5 },
        resultTitle: "Захоронено",
        resultText: "Ты закопал плов за вагоном. Земля не простила.",
        resultEmoji: "⚰️"
      },
      {
        label: "🧑‍🔧 Пнуть ногой",
        effects: { mood: 8, valeraFatigue: 12, loyalty: -3 },
        resultTitle: "Еда разлетелась по участку",
        resultText: "Жабинский смотрит и говорит, ну зачем, я бы съел.",
        resultEmoji: "🧑‍🔧"
      }
    ]
  },

  // 6
  {
    id: "event_drunk_cold_toilet",
    trigger: "work",
    weight: 30,
    minDrunk: 50,
    for: "all",
    title: "Холод и пиво",
    emoji: "🥶",
    text: "Ты много выпил. На улице холодно. В туалет хочется сильнее, чем жить.",
    choices: [
      {
        label: "🚽 Пойти в туалет",
        effects: { energy: -10, mood: -5, missedTrucks: 1 },
        resultTitle: "Туалет",
        resultText: "Сходил. Минус одна машина, зато плюс тепло.",
        resultEmoji: "🚽"
      },
      {
        label: "🍶 Нассать в пятилитровку аккуратно",
        effects: { mood: 10, drunk: -5, loyalty: -3 },
        resultTitle: "Пятилитровка",
        resultText: "Ты почти попал. Пятилитровка приняла удар на себя.",
        resultEmoji: "🍶"
      },
      {
        label: "🎯 Нассать в пятилитровку как получится",
        effects: { mood: 15, drunk: -5, loyalty: -10, energy: -5 },
        resultTitle: "Промах",
        resultText: "Ты промахнулся. Теперь пол тоже участник смены.",
        resultEmoji: "💦"
      }
    ]
  },

  // 7
  {
    id: "event_slava_intro",
    trigger: "work",
    weight: 22,
    for: "all",
    title: "Дядя Слава, дизелист",
    emoji: "🧑‍🔧",
    text: "Заходит дядя Слава. Он чисто попуск. Начинает с: «Хе-хе-хе, у вас тут соляркой пахнет, как дома».",
    choices: [
      {
        label: "🍺 Выпить с ним",
        effects: { mood: 10, drunk: 20, energy: -5 },
        resultTitle: "Выпили",
        resultText: "Дядя Слава пьёт как животное, но безобидно. Теперь вы почти друзья.",
        resultEmoji: "🍺"
      },
      {
        label: "🚫 Отказаться",
        effects: { loyalty: 2, mood: -5 },
        resultTitle: "Отказ",
        resultText: "Дядя Слава говорит: «Хе-хе-хе, ну и зря».",
        resultEmoji: "🚫"
      },
      {
        label: "👂 Слушать",
        effects: { mood: 5 },
        resultTitle: "Истории",
        resultText: "Дядя Слава рассказывает про дизель. Ты ничего не понял, но кивнул.",
        resultEmoji: "👂"
      }
    ]
  },

  // 8
  {
    id: "event_slava_drink_offer",
    trigger: "work",
    weight: 22,
    minDrunk: 20,
    for: "all",
    title: "Дядя Слава предлагает",
    emoji: "🥃",
    text: "Дядя Слава достаёт мутную бутылку: «Хе-хе-хе, это техническая, но душевная».",
    choices: [
      {
        label: "🥃 Выпить",
        effects: { mood: 8, drunk: 18, energy: -5 },
        resultTitle: "Техническая принята",
        resultText: "Ты выпил. Внутри завёлся трактор.",
        resultEmoji: "🥃"
      },
      {
        label: "🧪 Разбавить",
        effects: { mood: 3, drunk: 8 },
        resultTitle: "Разбавил",
        resultText: "Ты разбавил. Дядя Слава говорит: «Хе-хе-хе, слабенько, но честно».",
        resultEmoji: "🧪"
      },
      {
        label: "🚫 Отказаться",
        effects: { loyalty: 3, mood: -5 },
        resultTitle: "Отказ",
        resultText: "Дядя Слава не обиделся. Он просто выпил за двоих.",
        resultEmoji: "🚫"
      }
    ]
  },

  // 9
  {
    id: "event_slava_floor_wash",
    trigger: "work",
    weight: 20,
    for: "all",
    title: "Дядя Слава моет пол",
    emoji: "🧼",
    text: "Дядя Слава пришёл мыть пол. «Хе-хе-хе, сейчас будет чисто». Пол стал чище, но пахнет соляркой.",
    effects: {
      loyalty: 8,
      mood: -5
    }
  },

  // 10
  {
    id: "event_slava_hehe",
    trigger: "work",
    weight: 20,
    for: "all",
    title: "Хе-хе-хе",
    emoji: "😄",
    text: "Дядя Слава зашёл, сказал «Хе-хе-хе», забыл зачем пришёл и ушёл.",
    effects: {
      mood: 5
    }
  },

  // 11
  {
    id: "event_slava_diesel_advice",
    trigger: "work",
    weight: 20,
    for: "all",
    title: "Совет дизелиста",
    emoji: "🛠",
    text: "Дядя Слава говорит: «Хе-хе-хе, если 1С висит, надо постучать по монитору».",
    choices: [
      {
        label: "🛠 Последовать совету",
        effects: { money: -100, energy: 10, mood: 5 },
        resultTitle: "Постучал",
        resultText: "Ты постучал. 1С не починилась, но дядя Слава уважает.",
        resultEmoji: "🛠"
      },
      {
        label: "🧑‍🔧 Позвать Валеру",
        effects: { valeraFatigue: 5, loyalty: 2 },
        resultTitle: "Валера пришёл",
        resultText: "Валера пришёл, посмотрел на дядю Славу и молча всё поправил.",
        resultEmoji: "🧑‍🔧"
      },
      {
        label: "🚫 Игнорировать",
        effects: { mood: -3 },
        resultTitle: "Игнор",
        resultText: "Дядя Слава говорит: «Хе-хе-хе, молодежь пошла».",
        resultEmoji: "🚫"
      }
    ]
  },

  // 12
  {
    id: "event_slava_sleeps",
    trigger: "work",
    weight: 20,
    for: "all",
    title: "Дядя Слава уснул",
    emoji: "😴",
    text: "Дядя Слава уснул у батареи. Храпит как дизель на холостых.",
    choices: [
      {
        label: "🧥 Накрыть",
        effects: { mood: 5 },
        resultTitle: "Накрыл",
        resultText: "Ты накрыл дядю Славу курткой. Он пробормотал: «Хе-хе-хе, спасибо».",
        resultEmoji: "🧥"
      },
      {
        label: "📢 Разбудить",
        effects: { loyalty: 2, mood: -5 },
        resultTitle: "Разбудил",
        resultText: "Дядя Слава проснулся и сказал: «Хе-хе-хе, я не спал, я проверял».",
        resultEmoji: "📢"
      },
      {
        label: "🤫 Пусть спит",
        effects: { mood: 5, loyalty: -2 },
        resultTitle: "Пусть спит",
        resultText: "Дядя Слава спит. Работа стоит. Атмосфера растёт.",
        resultEmoji: "🤫"
      }
    ]
  },

  // 13
  {
    id: "event_slava_mop_bucket",
    trigger: "work",
    weight: 20,
    for: "all",
    title: "Ведро дяди Славы",
    emoji: "🪣",
    text: "Дядя Слава моет пол, но вода в ведре чернее солярки.",
    choices: [
      {
        label: "🛑 Остановить",
        effects: { loyalty: 5, mood: -5 },
        resultTitle: "Остановил",
        resultText: "Ты остановил дядю Славу. Пол остался грязным, зато целым.",
        resultEmoji: "🛑"
      },
      {
        label: "🤷 Пусть моет",
        effects: { mood: 5, loyalty: -8 },
        resultTitle: "Пусть моет",
        resultText: "Дядя Слава размазал грязь ровным слоем. «Хе-хе-хе, красота».",
        resultEmoji: "🤷"
      }
    ]
  },

  // 14
  {
    id: "event_drunk_talk_scales",
    trigger: "work",
    weight: 20,
    minDrunk: 30,
    for: "all",
    title: "Разговор с весами",
    emoji: "⚖️",
    text: "Ты объясняешь весам, что они неправы. Весы молчат, но ты чувствуешь, что побеждаешь.",
    effects: {
      mood: 5,
      loyalty: -3
    }
  },

  // 15
  {
    id: "event_drunk_truck_name",
    trigger: "work",
    weight: 20,
    minDrunk: 40,
    for: "all",
    title: "Имя для Howo",
    emoji: "🚛",
    text: "Ты назвал Howo «Солнышком». Водитель не возражает. Ему тоже нравится.",
    effects: {
      mood: 5
    }
  },

  // 16
  {
    id: "event_drunk_1c_chat",
    trigger: "work",
    weight: 20,
    minDrunk: 40,
    for: "all",
    title: "Переписка с 1С",
    emoji: "💻",
    text: "Ты написал 1С: «Ты меня уважаешь?» 1С ответила: «Недостаточно прав».",
    effects: {
      mood: 5,
      loyalty: -5
    }
  },

  // 17
  {
    id: "event_drunk_dance_cone",
    trigger: "work",
    weight: 20,
    minDrunk: 50,
    for: "all",
    title: "Танец с конусом",
    emoji: "🕺",
    text: "Ты станцевал с дорожным конусом. Конус двигался лучше тебя.",
    effects: {
      mood: 10,
      energy: -10,
      loyalty: -5
    }
  },

  // 18
  {
    id: "event_drunk_confess_kamaz",
    trigger: "work",
    weight: 20,
    minDrunk: 60,
    for: "all",
    title: "Признание КАМАЗу",
    emoji: "🚚",
    text: "Ты признался КАМАЗу в любви. КАМАЗ мигнул поворотником. Это взаимность.",
    effects: {
      mood: 10,
      loyalty: -8
    }
  },

  // 19
  {
    id: "event_drunk_weigh_moon",
    trigger: "work",
    weight: 18,
    minDrunk: 70,
    for: "all",
    title: "Взвесить луну",
    emoji: "🌙",
    text: "Ты пытался загнать луну на весы. Луна не влезла. Ты записал: «примерно 38 тонн».",
    effects: {
      mood: 10,
      loyalty: -10
    }
  },

  // 20
  {
    id: "event_drunk_voice_boss",
    trigger: "work",
    weight: 22,
    minDrunk: 70,
    for: "all",
    title: "Голосовое начальству",
    emoji: "🎙",
    text: "Ты записал начальству голосовое. В нём слышны весы, твоё дыхание и слово «нормально».",
    choices: [
      {
        label: "🗑 Удалить",
        effects: { mood: -5 },
        resultTitle: "Удалил",
        resultText: "Ты удалил голосовое. Стало легче, но осадок остался.",
        resultEmoji: "🗑"
      },
      {
        label: "📤 Отправить",
        effects: { loyalty: -15, mood: 5 },
        resultTitle: "Отправил",
        resultText: "Начальство прослушало. Потом перезвонило. Ты не взял.",
        resultEmoji: "📤"
      },
      {
        label: "👂 Переслушать",
        effects: { mood: -10 },
        resultTitle: "Переслушал",
        resultText: "Это было хуже, чем казалось. Теперь ты это знаешь.",
        resultEmoji: "👂"
      }
    ]
  },

  // 21
  {
    id: "event_drunk_philosophy",
    trigger: "work",
    weight: 20,
    minDrunk: 50,
    for: "all",
    title: "Философия",
    emoji: "🤔",
    text: "Ты рассуждаешь, почему песок сыпется, а жизнь нет. Водитель кивает.",
    effects: {
      mood: 5
    }
  },

  // 22
  {
    id: "event_drunk_sing_chanson",
    trigger: "work",
    weight: 20,
    minDrunk: 40,
    for: "all",
    title: "Шансон",
    emoji: "🎶",
    text: "Ты запел шансон. КАМАЗ загудел в поддержку. Начальство не оценило.",
    effects: {
      mood: 8,
      loyalty: -5
    }
  },

  // 23
  {
    id: "event_drunk_lost_button",
    trigger: "work",
    weight: 20,
    minDrunk: 60,
    for: "all",
    title: "Потерял кнопку",
    emoji: "🔘",
    text: "Ты потерял кнопку «Выполнить». Она была на экране. Ты искал пять минут.",
    effects: {
      mood: -5,
      loyalty: -5
    }
  },

  // 24
  {
    id: "event_drunk_two_howo",
    trigger: "work",
    weight: 20,
    minDrunk: 65,
    for: "all",
    title: "Два Howo",
    emoji: "🚛🚛",
    text: "Тебе кажется, что приехало два Howo. Один настоящий, второй — твой.",
    effects: {
      mood: -5
    }
  },

  // 25
  {
    id: "event_drunk_guard_friend",
    trigger: "work",
    weight: 20,
    minDrunk: 50,
    for: "all",
    title: "Охранник уважает",
    emoji: "🤝",
    text: "Охранник сказал, что ты нормальный мужик. Теперь ты обязан принести ему чай.",
    effects: {
      mood: 8
    }
  },

  // 26
  {
    id: "event_drunk_weather_cold",
    trigger: "work",
    weight: 20,
    minDrunk: 40,
    for: "all",
    title: "Холодно",
    emoji: "❄️",
    text: "Ты вышел подышать и понял, что зима не согласована с графиком.",
    effects: {
      mood: -5,
      energy: -5
    }
  },

  // 27
  {
    id: "event_drunk_field_toilet",
    trigger: "work",
    weight: 20,
    minDrunk: 60,
    for: "all",
    title: "Полевая нужда",
    emoji: "🌾",
    text: "Ты пошёл в поле по нужде, но забыл, зачем. Вернулся с чувством вины.",
    effects: {
      mood: -8,
      missedTrucks: 1
    }
  },

  // 28
  {
    id: "event_random_kamaz_horn",
    trigger: "work",
    weight: 18,
    for: "all",
    title: "КАМАЗ гудит",
    emoji: "📢",
    text: "КАМАЗ гудит так, будто у него тоже есть претензии к 1С.",
    effects: {
      mood: -5
    }
  },

  // 29
  {
    id: "event_random_howo_dust",
    trigger: "work",
    weight: 18,
    for: "all",
    title: "Пыль от Howo",
    emoji: "🌫",
    text: "Howo проехал и оставил облако пыли. Теперь у тебя есть свой микроклимат.",
    effects: {
      mood: -5
    }
  },

  // 30
  {
    id: "event_random_scania_park",
    trigger: "work",
    weight: 18,
    for: "all",
    title: "Scania встала ровно",
    emoji: "🚚",
    text: "Scania встала на весы идеально. Ты даже почувствовал уважение к технике.",
    effects: {
      mood: 3
    }
  },

  // 31
  {
    id: "event_random_driver_gift_tea",
    trigger: "work",
    weight: 18,
    for: "all",
    title: "Чай от водителя",
    emoji: "🍵",
    text: "Водитель протянул термос: «Держи, командир, горячий». Внутри чай и надежда.",
    effects: {
      mood: 10,
      energy: 5
    }
  },

  // 32
  {
    id: "event_random_driver_complaint",
    trigger: "work",
    weight: 18,
    for: "all",
    title: "Жалоба",
    emoji: "😡",
    text: "Водитель начал жаловаться на очередь. Очередь состоит из него.",
    effects: {
      mood: -5,
      loyalty: -5
    }
  },

  // 33
  {
    id: "event_random_1c_update",
    trigger: "work",
    weight: 18,
    for: "all",
    title: "Обновление 1С",
    emoji: "💻",
    text: "1С решила обновиться. Именно сейчас. Именно в разгар смены.",
    effects: {
      mood: -10
    }
  },

  // 34
  {
    id: "event_random_scale_zero",
    trigger: "work",
    weight: 18,
    for: "all",
    title: "Весы обнулились",
    emoji: "0️⃣",
    text: "Весы показали ноль. Машина на месте. Смысл жизни тоже.",
    effects: {
      mood: -8
    }
  },

  // 35
  {
    id: "event_random_guard_story",
    trigger: "work",
    weight: 18,
    for: "all",
    title: "История охранника",
    emoji: "🛡",
    text: "Охранник рассказывает, как в 2007-м тут уехал самосвал без документов. Ты слышишь это пятый раз.",
    effects: {
      mood: -5
    }
  },

  // 36
  {
    id: "event_random_valera_note",
    trigger: "work",
    weight: 18,
    for: "valera",
    title: "Записка Валеры",
    emoji: "📝",
    text: "Валера оставил записку: «Проверь весы». Подпись: «Валера». Всё серьёзно.",
    effects: {
      loyalty: 5,
      mood: -5
    }
  },

  // 37
  {
    id: "event_random_sasha_dream",
    trigger: "work",
    weight: 18,
    for: "sasha",
    title: "Сон наяву",
    emoji: "💭",
    text: "Саша на секунду закрыл глаза и увидел, как Валера работает за него. Красивый сон.",
    effects: {
      mood: 10,
      valeraFatigue: 5
    }
  },

  // 38
  {
    id: "event_random_mirage_sign",
    trigger: "work",
    weight: 18,
    for: "all",
    title: "Табличка «Мираж»",
    emoji: "🪧",
    text: "Табличка «Мираж» покосилась. Теперь объект выглядит ещё более загадочно.",
    effects: {
      mood: 3
    }
  },

  // 39
  {
    id: "event_random_meteor",
    trigger: "work",
    weight: 15,
    for: "all",
    title: "Что-то пролетело",
    emoji: "☄️",
    text: "Над карьером что-то пролетело. Возможно, метеорит. Возможно, чья-то надежда.",
    effects: {
      mood: 5
    }
  },

  // 40
  {
    id: "event_random_energy_low_coffee",
    trigger: "work",
    weight: 25,
    maxEnergy: 25,
    for: "all",
    title: "Нужна бодрость",
    emoji: "☕",
    text: "Глаза закрываются. Нужен кофе, сон или хотя бы чудо.",
    choices: [
      {
        label: "☕ Купить кофе",
        effects: { money: -100, energy: 15, mood: 3 },
        resultTitle: "Кофе",
        resultText: "Кофе из ведра помогает. Ведро не обсуждаем.",
        resultEmoji: "☕"
      },
      {
        label: "😴 Вздремнуть",
        effects: { energy: 10, mood: 5, missedTrucks: 1 },
        resultTitle: "Вздремнул",
        resultText: "Ты вздремнул. Одна машина обиделась.",
        resultEmoji: "😴"
      },
      {
        label: "😬 Терпеть",
        effects: { mood: -8, energy: 3 },
        resultTitle: "Терпишь",
        resultText: "Ты терпишь. Организм ставит это на заметку.",
        resultEmoji: "😬"
      }
    ]
  },

  // 41
  {
    id: "event_random_food_smell",
    trigger: "work",
    weight: 25,
    maxFood: 25,
    for: "all",
    title: "Голодный запах",
    emoji: "🍜",
    text: "Где-то пахнет едой. Желудок считает, что это сигнал.",
    choices: [
      {
        label: "🍜 Купить дошик",
        effects: { money: -80, food: 20, mood: -3 },
        resultTitle: "Дошик",
        resultText: "Дошик съеден. Грустно, но тепло.",
        resultEmoji: "🍜"
      },
      {
        label: "🥪 Попрошайничать у охранника",
        effects: { food: 15, mood: 5, loyalty: -3 },
        resultTitle: "Бутер",
        resultText: "Охранник дал бутер. Теперь ты ему должен.",
        resultEmoji: "🥪"
      },
      {
        label: "😬 Терпеть",
        effects: { mood: -10, energy: -10 },
        resultTitle: "Голод",
        resultText: "Ты терпишь. Голод смотрит в ответ.",
        resultEmoji: "😬"
      }
    ]
  },

  // 42
  {
    id: "event_random_theft_rumor",
    trigger: "work",
    weight: 30,
    minTheftTons: 60,
    for: "all",
    title: "Слухи о песке",
    emoji: "🤫",
    text: "Кто-то говорит, что песок уезжает чаще, чем приезжает. Слишком много кто-то знает.",
    choices: [
      {
        label: "🤷 Отрицать",
        effects: { loyalty: -5, mood: -5 },
        resultTitle: "Отрицание",
        resultText: "Ты отрицал. Тебе не поверили, но спорить устали.",
        resultEmoji: "🤷"
      },
      {
        label: "😅 Отшутиться",
        effects: { mood: 5, loyalty: -10 },
        resultTitle: "Шутка",
        resultText: "Ты пошутил про мираж. Начальство не смеётся.",
        resultEmoji: "😅"
      },
      {
        label: "💸 Вернуть часть",
        effects: { money: -1000, theftTons: -8, loyalty: 8 },
        resultTitle: "Откупился",
        resultText: "Ты вернул часть. Тонны стали честнее, кошелёк грустнее.",
        resultEmoji: "💸"
      }
    ]
  },

  // 43
  {
    id: "event_random_low_loyalty_photo",
    trigger: "work",
    weight: 30,
    maxLoyalty: 25,
    for: "all",
    title: "Начальство хочет фото",
    emoji: "📸",
    text: "Начальство пишет: «Скинь фото машины». Тон такой, будто оно уже всё знает.",
    choices: [
      {
        label: "📷 Сфоткать честно",
        effects: { loyalty: 5, mood: -5 },
        resultTitle: "Честное фото",
        resultText: "Ты сфоткал честно. Начальство недовольно, но придраться не к чему.",
        resultEmoji: "📷"
      },
      {
        label: "🖼 Отправить старое",
        effects: { loyalty: -10, mood: -5 },
        resultTitle: "Старое фото",
        resultText: "Начальство заметило, что номер не тот. Теперь будет помнить.",
        resultEmoji: "🖼"
      },
      {
        label: "💻 Написать: «1С висит»",
        effects: { loyalty: 2, mood: -5 },
        resultTitle: "Классика",
        resultText: "Начальство сделало вид, что поверило. Ты тоже.",
        resultEmoji: "💻"
      }
    ]
  },

  // 44
  {
    id: "event_random_high_loyalty_praise",
    trigger: "work",
    weight: 25,
    minLoyalty: 75,
    for: "all",
    title: "Начальство довольно",
    emoji: "📈",
    text: "Начальство пишет: «Молодец». Редкий момент. Надо запомнить.",
    effects: {
      mood: 10,
      loyalty: 5
    }
  },

  // 45
  {
    id: "event_random_end_shift_hope",
    trigger: "work",
    weight: 30,
    minProgress: 50,
    for: "all",
    title: "Скоро конец смены",
    emoji: "🌘",
    text: "До конца смены осталось немного. Кажется, даже 1С начала работать чуть быстрее.",
    effects: {
      mood: 10
    }
  }
);