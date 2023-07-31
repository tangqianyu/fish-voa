import cheerio from 'cheerio';
import axios from 'axios';
import { Post, Video } from './db';
import { compareDates } from './common';

type FetchType = 'post' | 'video';

const BASE_URL = 'https://www.51voa.com';

export async function fetchNewData(type: FetchType, category: string) {
  let pageNumber = 1;
  let total = 0;
  let pageUrl = `${BASE_URL}/${category}_${pageNumber}.html`;
  let lastestPost: any;
  if (type === 'post') {
    lastestPost = await getLatestPost(category);
  } else if (type === 'video') {
    lastestPost = await getLatestVideo(category);
  }
  try {
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);

    for (const element of $('#righter .list > ul > li')) {
      const publish_date = convertToSQLiteDate($(element).contents().last().text().trim());
      let title, post_link;
      if (type === 'post') {
        if (compareDates(publish_date, lastestPost.publish_date) === 1) {
          title = $($(element).find('a[href^="/VOA_Special_English"]:not([class])')[0])
            .text()
            .trim();
          post_link = $($(element).find('a[href^="/VOA_Special_English"]:not([class])')[0]).attr(
            'href'
          );
          try {
            const { content, audio_link, lrc_link } = await getPostDetail(post_link as string);
            try {
              const newPost = await Post.create({
                title,
                category,
                audio_link,
                lrc_link,
                publish_date,
                content,
              });
              total++;
            } catch (error) {
              console.error('Error adding new post:', error);
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else if (type == 'video') {
        if (compareDates(publish_date, lastestPost.publish_date) === 1) {
          title = title = $($(element).find('a[href^="/VOA_Videos"]:not([class])')[0])
            .text()
            .trim();
          post_link = $($(element).find('a[href^="/VOA_Videos"]:not([class])')[0]).attr('href');
          try {
            const { poster_link, video_link } = await getVideoDetail(post_link as string);
            try {
              const newPost = await Post.create({
                title,
                category,
                poster_link,
                video_link,
                publish_date,
              });
              total++;
            } catch (error) {
              console.error('Error adding new post:', error);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    return total;
  } catch (error) {
    console.log(error);
  }
}

async function getLatestPost(category: string) {
  try {
    const latestRecord = await Post.findOne({
      where: { category },
      order: [['publish_date', 'DESC']],
    });

    return latestRecord;
  } catch (error) {
    console.error('Error retrieving the latest record:', error);
  }
}

async function getLatestVideo(category: string) {
  try {
    const latestRecord = await Video.findOne({
      where: { category },
      order: [['publish_date', 'DESC']],
    });

    return latestRecord;
  } catch (error) {
    console.error('Error retrieving the latest record:', error);
  }
}

function convertToSQLiteDate(dateStr: string) {
  // Split the input date string into day, month, and year components
  const [year, month, day] = dateStr.slice(1, -1).split('-');
  const fixYear = `20${year}`;
  const fixMonth = (month as unknown as number) < 10 ? `0${month}` : month;
  const fixDay = (day as unknown as number) < 10 ? `0${day}` : day;

  return `${fixYear}-${fixMonth}-${fixDay}`;
}

async function getPostDetail(link: string): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}${link}`);
    const $ = cheerio.load(response.data);
    const content = $('#righter > .content').first().html() || '';
    const audio_link = $('#mp3').first().attr('href') || '';
    const lrc_link = $('#lrc').first().attr('href') || '';
    return { content, audio_link, lrc_link };
  } catch (error) {
    console.log(error);
  }
}

async function getVideoDetail(link: string): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}${link}`);
    const $ = cheerio.load(response.data);
    const poster_link = $('.video_content video').first().attr('poster') || '';
    const video_link = $('.video_content video source').first().attr('src') || '';
    return { poster_link, video_link };
  } catch (error) {
    console.log(error);
  }
}
