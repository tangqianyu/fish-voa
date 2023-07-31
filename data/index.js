const axios = require('axios');
const cheerio = require('cheerio');
const faker = require('faker');
const readline = require('readline');

const { log } = require('console');
const { url } = require('inspector');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const throttledQueue = require('throttled-queue');
let throttle = throttledQueue(15, 1000);

const BASE_URL = 'https://www.51voa.com';

const categories = [
  { name: 'Technology_Report', page: 45 },
  { name: 'Health_Report', page: 33 },
  { name: 'Education_Report', page: 31 },
  { name: 'Economics_Report', page: 16 },
  { name: 'American_Mosaic', page: 32 },
  { name: 'ask_a_teacher', page: 6 },
  { name: 'Words_And_Their_Stories', page: 18 },
  { name: 'as_it_is', page: 139 },
  { name: 'Everyday_Grammar', page: 8 },
  { name: 'This_is_America', page: 22 },
  { name: 'Science_in_the_News', page: 17 },
  { name: 'In_the_News', page: 18 },
  { name: 'American_Stories', page: 10 },
  { name: 'Trending_Today', page: 11 },
  { name: 'The_Making_of_a_Nation', page: 12 },
  { name: 'National_Parks', page: 1 },
  { name: 'Americas_Presidents', page: 1 },
  { name: 'Agriculture_Report', page: 12 },
  { name: 'Explorations', page: 10 },
  { name: 'People_in_America', page: 10 },
];

const videoCategories = [
  { name: 'VOA60', page: 16 },
  { name: 'English_in_a_Minute_Videos', page: 10 },
  { name: 'English_at_the_Movies', page: 6 },
  { name: 'News_Words', page: 10 },
  { name: 'Everyday_Grammar_TV', page: 7 },
  { name: 'How_to_Pronounce', page: 3 },
];

let userAgent = null;

let db;

async function init() {
  // await bootstrap();
  // getFailVideo()

  getPageVideo(videoCategories[0].name, 1);

  // for (const category of categories) {
  //   for (let i = 1; i <= category.page; i++) {
  //     await getPagePosts(category.name, i);
  //   }
  // }

  // for (const videoCategory of videoCategories) {
  //   for (let i = 1; i <= videoCategory.page; i++) {
  //     await getPageVideo(videoCategory.name, i);
  //   }
  // }
}

init();

async function bootstrap() {
  userAgent = faker.internet.userAgent();

  db = new sqlite3.Database('data.db', err => {
    if (err) {
      console.error(err.message);
    }
    console.log('已连接到 SQLite 数据库。');
  });

  const sql = `CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT,
        audio_link TEXT,
        lrc_link TEXT,
        publish_date DATE,
        content Text
      );`;

  db.run(sql, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log('已成功创建table posts');
  });

  const createVideoSql = ` CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    poster_link TEXT,
    video_link TEXT,
    publish_date DATE
  );`;

  db.run(createVideoSql, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log('已成功创建table videos');
  });
}

async function getPagePosts(category, pageNumber) {
  let pageUrl = `${BASE_URL}/${category}_${pageNumber}.html`;
  try {
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);

    $('#righter .list > ul > li').each(async (index, element) => {
      const title = $($(element).find('a[href^="/VOA_Special_English"]:not([class])')[0])
        .text()
        .trim();

      const post_link = $($(element).find('a[href^="/VOA_Special_English"]:not([class])')[0]).attr(
        'href'
      );

      const publish_date = $(element).contents().last().text().trim();

      try {
        const { content, audio_link, lrc_link } = await getPostDetail(post_link, {
          title,
          category,
          publish_date,
        });

        const data = {
          title,
          category,
          audio_link,
          lrc_link,
          publish_date: convertToSQLiteDate(publish_date),
          content,
        };

        db.run(
          `INSERT INTO posts(title, category, audio_link, lrc_link, publish_date, content) VALUES(?, ?, ?, ?, ?, ?)`,
          [
            data.title,
            data.category,
            data.audio_link,
            data.lrc_link,
            data.publish_date,
            data.content,
          ],
          function (err) {
            if (err) {
              return console.log(err.message);
            }
            console.log(`新增数据成功，ID为 ${this.lastID}`);
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    // writeFailUrl(pageUrl);
    console.log('Error during crawling:', error);
  }
}

async function getPostDetail(link, info) {
  try {
    const response = await axios.get(`${BASE_URL}${link}`);
    const $ = cheerio.load(response.data);
    const content = $('#righter > .content').first().html() || '';
    const audio_link = $('#mp3').first().attr('href') || '';
    const lrc_link = $('#lrc').first().attr('href') || '';
    return { content, audio_link, lrc_link };
  } catch (error) {
    writeFailUrl(link, info, 'fail1.text');
    // console.log(error);
  }
}

function convertToSQLiteDate(dateStr) {
  // Split the input date string into day, month, and year components
  const [year, month, day] = dateStr.slice(1, -1).split('-');
  const fixYear = `20${year}`;
  const fixMonth = month < 10 ? `0${month}` : month;
  const fixDay = day < 10 ? `0${day}` : day;

  return `${fixYear}-${fixMonth}-${fixDay}`;
}

function writeFailUrl(url, info, fileName = 'url.text') {
  fs.appendFile(
    fileName,
    `${info.category}|${info.title}|${info.publish_date}|${url}\n`,
    'utf8',
    err => {
      if (err) {
        console.error('Error writing to log file:', err);
      } else {
        console.log('Log entry written to file successfully.', url);
      }
    }
  );
}

function getFailPost() {
  const fileStream = fs.createReadStream('fail.text');

  // 创建 readline 接口实例
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // 用于处理不同操作系统的换行符
  });

  // 按行读取文件
  rl.on('line', async line => {
    const [category, title, publish_date, post_link] = line.split('|');
    try {
      const { content, audio_link, lrc_link } = await getPostDetail(post_link, {
        title,
        category,
        publish_date,
      });

      const data = {
        title,
        category,
        audio_link,
        lrc_link,
        publish_date: convertToSQLiteDate(publish_date),
        content,
      };

      db.run(
        `INSERT INTO posts(title, category, audio_link, lrc_link, publish_date, content) VALUES(?, ?, ?, ?, ?, ?)`,
        [
          data.title,
          data.category,
          data.audio_link,
          data.lrc_link,
          data.publish_date,
          data.content,
        ],
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`新增数据成功，ID为 ${this.lastID}`);
        }
      );
    } catch (error) {
      console.log(error);
    }
  });

  // 当读取结束时触发
  rl.on('close', () => {
    console.log('File reading completed.');
  });
}

async function getPageVideo(category, pageNumber) {
  let pageUrl = `${BASE_URL}/${category}_${pageNumber}.html`;
  try {
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);

    //  for(const element of $('#righter .list > ul > li')){

    //   const title = $($(element).find('a[href^="/VOA_Videos"]:not([class])')[0]).text().trim();
    //   console.log('title==',title);
    //  }


    // $('#righter .list > ul > li').each(async (index, element) => {
    //   const title = $($(element).find('a[href^="/VOA_Videos"]:not([class])')[0]).text().trim();

    //   const post_link = $($(element).find('a[href^="/VOA_Videos"]:not([class])')[0]).attr('href');

    //   const publish_date = $(element).contents().last().text().trim();

    //   try {
    //     const { poster_link, video_link } = await getVideoDetail(post_link, {
    //       title,
    //       category,
    //       publish_date,
    //     });

    //     const data = {
    //       title,
    //       category,
    //       poster_link,
    //       video_link,
    //       publish_date: convertToSQLiteDate(publish_date),
    //     };

    //     db.run(
    //       `INSERT INTO videos(title, category, poster_link, video_link, publish_date) VALUES(?, ?, ?, ?, ?)`,
    //       [data.title, data.category, data.poster_link, data.video_link, data.publish_date],
    //       function (err) {
    //         if (err) {
    //           return console.log(err.message);
    //         }
    //         console.log(`新增数据成功，ID为 ${this.lastID}`);
    //       }
    //     );
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });
  } catch (error) {
    // writeFailUrl(pageUrl);
    console.log('Error during crawling:', error);
  }
}

async function getVideoDetail(link, info) {
  try {
    const response = await axios.get(`${BASE_URL}${link}`);
    const $ = cheerio.load(response.data);
    const poster_link = $('.video_content video').first().attr('poster') || '';
    const video_link = $('.video_content video source').first().attr('src') || '';
    return { poster_link, video_link };
  } catch (error) {
    writeFailUrl(link, info, 'failVideo1.text');
  }
}


function getFailVideo() {
  const fileStream = fs.createReadStream('failVideo.text');

  // 创建 readline 接口实例
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // 用于处理不同操作系统的换行符
  });

  // 按行读取文件
  rl.on('line', async line => {
    const [category, title, publish_date, post_link] = line.split('|');
    try {
      const { poster_link, video_link } = await getVideoDetail(post_link, {
        title,
        category,
        publish_date,
      });

      const data = {
        title,
        category,
        poster_link,
        video_link,
        publish_date: convertToSQLiteDate(publish_date),
      };

      db.run(
        `INSERT INTO videos(title, category, poster_link, video_link, publish_date) VALUES(?, ?, ?, ?, ?)`,
        [data.title, data.category, data.poster_link, data.video_link, data.publish_date],
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`新增数据成功，ID为 ${this.lastID}`);
        }
      );
    } catch (error) {
      console.log(error);
    }
  });

  // 当读取结束时触发
  rl.on('close', () => {
    console.log('File reading completed.');
  });
}
