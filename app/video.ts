import { Video } from './db';
import { Sequelize, Op } from 'sequelize';

export async function findVideoById(id: number) {
  try {
    const video = await Video.findByPk(id, {
      raw: true,
    });

    return video;
  } catch (err) {
    console.error('Error finding video:', err);
    throw err;
  }
}

export async function findVideosByCategory(
  category: string,
  keyword: string = '',
  orderType: string,
  pageNumber: number,
  pageSize: number
) {
  try {
    const offset = (pageNumber - 1) * pageSize;
    let whereQuery: any = { category };
    if (keyword) {
      whereQuery = {
        ...whereQuery,
        title: { [Op.like]: `%${keyword}%` },
      };
    }

    const videos = await Video.findAll({
      raw: true,
      where: whereQuery,
      attributes: ['id', 'title', 'category', 'publish_date'],
      offset,
      limit: pageSize,
      order: [['publish_date', orderType]],
    });
    return videos;
  } catch (err) {
    console.error('Error finding videos:', err);
    throw err;
  }
}
