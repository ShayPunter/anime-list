<?php

/*
|--------------------------------------------------------------------------
| Mood definitions for the Discover page
|--------------------------------------------------------------------------
|
| Each mood maps to a set of AniList genres used to score an anime's fit.
| An anime's mood score = (number of matching genres in `genres_any`) +
| (a bonus if ANY of `genres_boost` match), filtered by `min_score`.
|
| Mood slugs are kebab-case and are the public URL identifier.
|
*/

return [
    'cozy-and-slow' => [
        'label' => 'Cozy & slow',
        'description' => 'Wind down with something gentle and warm.',
        'emoji' => '🍵',
        'gradient' => 'from-amber-500/30 to-rose-500/20',
        'genres_any' => ['Slice of Life', 'Romance'],
        'genres_boost' => ['Comedy'],
        'genres_exclude' => ['Horror', 'Thriller', 'Ecchi'],
        'min_score' => 70,
    ],
    'edge-of-seat' => [
        'label' => 'Edge of seat',
        'description' => 'High-stakes tension you can\'t look away from.',
        'emoji' => '🔥',
        'gradient' => 'from-red-500/30 to-orange-500/20',
        'genres_any' => ['Action', 'Thriller'],
        'genres_boost' => ['Psychological', 'Mystery'],
        'genres_exclude' => [],
        'min_score' => 75,
    ],
    'make-me-think' => [
        'label' => 'Make me think',
        'description' => 'Stories that stick with you long after the credits.',
        'emoji' => '🧠',
        'gradient' => 'from-indigo-500/30 to-purple-500/20',
        'genres_any' => ['Psychological', 'Mystery', 'Sci-Fi'],
        'genres_boost' => ['Drama'],
        'genres_exclude' => ['Ecchi'],
        'min_score' => 75,
    ],
    'pure-fun' => [
        'label' => 'Pure fun',
        'description' => 'Lighthearted rides — laughs and adventure.',
        'emoji' => '🎉',
        'gradient' => 'from-yellow-400/30 to-lime-400/20',
        'genres_any' => ['Comedy', 'Adventure'],
        'genres_boost' => ['Action', 'Fantasy'],
        'genres_exclude' => ['Horror', 'Psychological'],
        'min_score' => 70,
    ],
    'break-my-heart' => [
        'label' => 'Break my heart',
        'description' => 'For when you want to feel everything.',
        'emoji' => '💔',
        'gradient' => 'from-rose-500/30 to-slate-500/20',
        'genres_any' => ['Drama', 'Romance'],
        'genres_boost' => ['Psychological', 'Supernatural'],
        'genres_exclude' => ['Comedy', 'Ecchi'],
        'min_score' => 75,
    ],
    'heartwarming' => [
        'label' => 'Heartwarming',
        'description' => 'Feel-good stories with a soft landing.',
        'emoji' => '🌸',
        'gradient' => 'from-pink-400/30 to-amber-300/20',
        'genres_any' => ['Slice of Life', 'Romance', 'Comedy'],
        'genres_boost' => ['Drama'],
        'genres_exclude' => ['Horror', 'Thriller', 'Ecchi'],
        'min_score' => 72,
    ],
    'wonder-and-magic' => [
        'label' => 'Wonder & magic',
        'description' => 'Worlds built from imagination.',
        'emoji' => '✨',
        'gradient' => 'from-cyan-400/30 to-fuchsia-400/20',
        'genres_any' => ['Fantasy', 'Adventure'],
        'genres_boost' => ['Supernatural', 'Sci-Fi'],
        'genres_exclude' => ['Ecchi'],
        'min_score' => 72,
    ],
    'unsettling' => [
        'label' => 'Unsettling',
        'description' => 'Creeping dread and things that shouldn\'t be.',
        'emoji' => '🌒',
        'gradient' => 'from-slate-600/40 to-purple-900/30',
        'genres_any' => ['Horror', 'Psychological'],
        'genres_boost' => ['Thriller', 'Supernatural'],
        'genres_exclude' => [],
        'min_score' => 70,
    ],
];
