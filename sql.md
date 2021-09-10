```js
//bandom isgaut viska vienam objekte:

// sql = 'SELECT `users`.`id`, `users`.`firstname` as name, COUNT(`posts`.`user_id`) AS posts, COUNT(`comments`.`user_id`) AS komentarai, COUNT(`posts_likes`.`user_id`) AS laikai\
//         FROM `users`\
//         LEFT JOIN `posts`\
//             ON `posts`.`user_id`=`users`.`id`  \
//         LEFT JOIN `comments`\
//             ON`comments`.`user_id` = `users`.`id`\
//         LEFT JOIN `posts_likes`\
//             ON`posts_likes`.`user_id` = `users`.`id`\
//         GROUP BY `users`.`id`\
//         ORDER BY `id` DESC';

//bandom dar karta tik su triguba uzklausa:

// sql = 'SELECT `users`.`id`, `users`.`firstname` as name, COUNT(`posts`.`user_id`) AS posts\
//         FROM `users`\
//         LEFT JOIN `posts`\
//             ON `posts`.`user_id`=`users`.`id`  \
//         GROUP BY `users`.`id`\
//         ORDER BY `id` DESC';
// 'SELECT`users`.`id`, `users`.`firstname`, COUNT(`comments`.`user_id`) AS komentarai\
//         FROM`users` \
//     LEFT JOIN `comments`\
//         ON`comments`.`user_id` = `users`.`id`\
//     GROUP BY `users`.`id`\
//     ORDER BY `id` DESC';
// 'SELECT `users`.`id`, `users`.`firstname`, COUNT(`posts_likes`.`user_id`) AS laikai\
//         FROM`users` \
//     LEFT JOIN `posts_likes`\
//          ON`posts_likes`.`user_id` = `users`.`id`\
//     GROUP BY `users`.`id`\
//     ORDER BY `id` DESC';

//bandom isgauti viska su vienu COUNT:

// sql = 'SELECT `users`.`id`, `users`.`firstname` as name, COUNT(`posts`.`user_id`, `comments`.`user_id`, `posts_likes`.`user_id`)\
//         FROM `users`\
//         LEFT JOIN `posts`\
//             ON `posts`.`user_id`=`users`.`id`  \
//         LEFT JOIN `comments`\
//             ON`comments`.`user_id` = `users`.`id`\
//         LEFT JOIN `posts_likes`\
//             ON`posts_likes`.`user_id` = `users`.`id`\
//         GROUP BY `users`.`id`\
//         ORDER BY `id` DESC';

//bandom su SELECT COUNT:
// sql = 'SELECT `users`.`id`, `users`.`firstname` as name,\
//             (SELECT COUNT(*) FROM `posts` AND `posts`.`user_id`=`users`.`id`) as posts,\
//             (SELECT COUNT(*) FROM `comments` AND `comments`.`user_id` = `users`.`id`) as comments,\
//             (SELECT COUNT(*) FROM `posts_likes` AND `posts_likes`.`user_id` = `users`.`id`) as likes\
//         FROM `users`\
//         ORDER BY `id` DESC';
```
