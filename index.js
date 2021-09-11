const mysql = require('mysql2/promise');

const app = {};

app.init = async () => {
    //jungiames prie duombazes
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'social',
    });

    let sql = '';
    let rows = [];

    function capitalize(str) {
        return str[0].toUpperCase() + str.slice(1)
    };

    //LOGIC BELOW

    //**1** _Registruotu vartotoju sarasas, isrikiuotas nuo naujausio link seniausio. Reikia nurodyti varda, post'u kieki, komentaru kieki ir like'u kieki_


    // //1 gaunam kiek turi kiekvienas postu:

    // sql = 'SELECT `users`.`id`, `users`.`firstname` as name, COUNT(`posts`.`user_id`) AS posts\
    //         FROM `users`\
    //         LEFT JOIN `posts`\
    //             ON `posts`.`user_id`=`users`.`id`  \
    //         GROUP BY `users`.`id`\
    //         ORDER BY `id` DESC';

    // //2 Gaunam kiek kiekvienas turi komentaru:

    // sql2 = 'SELECT`users`.`id`, `users`.`firstname`, COUNT(`comments`.`user_id`) AS komentarai\
    //         FROM`users` \
    //     LEFT JOIN `comments`\
    //         ON`comments`.`user_id` = `users`.`id`\
    //     GROUP BY `users`.`id`\
    //     ORDER BY `id` DESC';

    // //3 gaunam kiek kiekvienas turi like'u:

    // sql3 = 'SELECT `users`.`id`, `users`.`firstname`, COUNT(`posts_likes`.`user_id`) AS laikai\
    //         FROM`users` \
    //     LEFT JOIN `posts_likes`\
    //          ON`posts_likes`.`user_id` = `users`.`id`\
    //     GROUP BY `users`.`id`\
    //     ORDER BY `id` DESC';

    // //pirmos uzklausos info keliam i masyva:

    // [rows] = await connection.execute(sql);

    // let userInfo = [];
    // for (let { id, name, posts } of rows) {
    //     userInfo.push({ id, name, posts })
    // }

    // //antros uzklausos info keliauja i masyva:

    // [rows] = await connection.execute(sql2);

    // for (let user of userInfo) {

    //     for (let { id, komentarai } of rows) {
    //         if (user.id === id) {
    //             user.comments = komentarai;
    //         }
    //     }
    // }

    // //trecios uzklausos info po ciklo dedam i masyva:

    // [rows] = await connection.execute(sql3);

    // for (let user of userInfo) {

    //     for (let { id, laikai } of rows) {
    //         if (user.id === id) {
    //             user.likes = laikai;
    //         }
    //     }
    // }
    // viena uzklausa su COUNT DISTINCT:

    sql = 'SELECT `users`.`id`, `firstname` as name, \
    COUNT(DISTINCT `posts`.`id`) as posts, COUNT(DISTINCT `comments`.`id`) as komentarai, COUNT(DISTINCT `posts_likes`.`id`) as laikai\
    FROM `users`\
    LEFT JOIN `posts`\
    ON `posts`.`user_id` = `users`.`id`\
    LEFT JOIN `comments`\
    ON `comments`.`user_id` = `users`.`id`\
    LEFT JOIN `posts_likes`\
    ON `posts_likes`.`user_id` = `users`.`id`\
    GROUP BY `users`.`id`\
    ORDER BY `register_date` DESC';

    [rows] = await connection.execute(sql);

    let count = 0;

    //galutinis spausdinimas viso usersInfo saraso:

    for (let { name, posts, komentarai, laikai } of rows) {
        console.log(`${++count}. ${capitalize(name)}: posts (${posts}), comments(${komentarai}), likes(${laikai});`);
    }


    //**2** _Isspausdinti, koki turini turetu matyti Ona (antrasis vartotojas). Irasus pateikti nuo naujausio_ kaip pvz:
    //Ona's feed:
    //Vardenis wrote a post "Post text"(2021 - 09 - 09 20: 18: 45)

    sql = 'SELECT `users`.`firstname`, `posts`.`text`, `posts`.`date` \
        FROM `posts` \
        LEFT JOIN `users` \
            ON `users`.`id` = `posts`.`user_id` \
        LEFT JOIN `friends` \
            ON `friends`.`friend_id` = `posts`.`user_id` \
        WHERE `friends`.`user_id` = 2\
        ORDER BY `posts`.`date` DESC';

    [rows] = await connection.execute(sql);

    console.log('');
    for (let { firstname, text, date } of rows) {
        console.log(`--${capitalize(firstname)} wrote a post "${text}"(${date})`);
    }

    // ** 3 ** _Visu irasu(posts) sarasas su komentarais ir like'ais_


    //**4** _Isspausdinti, kas kokius draugus stebi (visi vartotojai)_


}

app.init();