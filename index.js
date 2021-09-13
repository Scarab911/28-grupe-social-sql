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

    function formatDate(date) {
        const d = new Date(date);
        const dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + ' ' +
            [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
        return dformat;
    }

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
    console.log(`Ona's feed:`);

    for (let { firstname, text, date } of rows) {
        console.log(`--${capitalize(firstname)} wrote a post "${text}"(${formatDate(date)})`);
    }

    // ** 3 ** _Visu irasu(posts) sarasas su komentarais ir like'ais_


    //**4** _Isspausdinti, kas kokius draugus stebi (visi vartotojai)_

    sql = 'SELECT `user_id`,\
    `friend_id`,\
     `follow_date` as date,\
      (\
        SELECT `users`.`firstname`\
         FROM `users`\
          WHERE `users`.`id` = `friends`.`friend_id`\
          ) as friendName,\
          (\
            SELECT `users`.`firstname`\
             FROM `users`\
              WHERE `users`.`id` = `friends`.`user_id`\
              ) as me\
               FROM `friends`';

    [rows] = await connection.execute(sql);

    console.log('');
    console.log(`User's relationships:`);
    count = 0;
    for (let { me, friendName, date } of rows) {
        console.log(`${++count}. ${capitalize(me)} is following ${capitalize(friendName)} (since ${formatDate(date)});`);
    }

    //**5** _Koks yra like'u naudojamumas. Isrikiuoti nuo labiausiai naudojamo_

    sql = 'SELECT `like_options`.`id`, `like_options`.`text`,\
                    `posts_likes`.`like_option_id`, \
                    COUNT(`posts_likes`.`like_option_id`) as panaudota\
            FROM `like_options`\
            LEFT JOIN `posts_likes`\
                ON `posts_likes`.`like_option_id` = `like_options`.`id`\
            GROUP BY `like_options`.`id`\
            ORDER BY `panaudota` DESC';

    [rows] = await connection.execute(sql);
    console.log('');
    console.log(`Like options statistics:`);
    count = 0;
    for (let { text, panaudota } of rows) {

        console.log(`${++count}. ${text} - ${panaudota} time;`);
    }

    //**6** _Isspausdinti visus komentarus, kuriuose yra nurodytas paieskos tekstas. Jei nieko nerasta, tai parodyti atitinkama pranesima. Visa tai turi buti funkcijos pavydale, kuri gauna vieninteli parametra - paieskos fraze_

    async function searchPost(str) {

        sql = 'SELECT * FROM `comments` WHERE `text` LIKE "%' + str + '%"';

        [rows] = await connection.execute(sql);

        if (rows.length === 0) { //tikrinam ar array tuscias
            console.error(`ERROR:Tokio komentaro nera`);
        } else {
            console.log(`Comments with search term "${str}":`);
            count = 0;
            for (let { text, date } of rows) {
                console.log(`${++count}. "${text}" (${formatDate(date)});`);
            }
        }
    };
    console.log('');
    await searchPost('nice');
    await searchPost('lol');

    //**7** _Isspausdinti naujausia vartotojo post'a. Visa tai turi buti funkcijos pavydale, kuri gauna vieninteli parametra - vartotojo id. Jei vartotojas neturi parases nei vieno post'o, grazinti atitinkama pranesima_


}

app.init();