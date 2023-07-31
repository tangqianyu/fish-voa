import { Sequelize, DataTypes } from 'sequelize';
import * as path from 'path';

const dbPath = path.join(__dirname, 'data.db');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
});

export const Post = sequelize.define(
  'posts',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.TEXT,
    },
    audio_link: {
      type: DataTypes.TEXT,
    },
    lrc_link: {
      type: DataTypes.TEXT,
    },
    publish_date: {
      type: DataTypes.DATEONLY,
    },
    content: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false, // 禁用 createdAt 和 updatedAt
  }
);


export const Video = sequelize.define(
  'videos',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.TEXT,
    },
    poster_link: {
      type: DataTypes.TEXT,
    },
    video_link: {
      type: DataTypes.TEXT,
    },
    publish_date: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    timestamps: false, // 禁用 createdAt 和 updatedAt
  }
);
