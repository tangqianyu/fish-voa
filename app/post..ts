import { Post } from './db';
import { Sequelize, Op } from 'sequelize';

export async function findPostById(id: number) {
  try {
    const post = await Post.findByPk(id, {
      raw: true,
    });

    return post;
  } catch (err) {
    console.error('Error finding posts:', err);
    throw err;
  }
}

export async function findPostsByCategory(
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

    const posts = await Post.findAll({
      raw: true,
      where: whereQuery,
      offset,
      limit: pageSize,
      order: [['publish_date', orderType]],
    });
    return posts;
  } catch (err) {
    console.error('Error finding posts:', err);
    throw err;
  }
}
