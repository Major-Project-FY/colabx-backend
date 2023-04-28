// module imports
import { Sequelize, Op, literal } from 'sequelize';

// importing models
import { Post } from '../models/projectPosts.js';
import { User } from '../models/user.js';

// importing helper functions
import { currentDate } from '../utils/basic/basic.utils.js';

export const postProject = (req, res, next) => {
  try {
    const { title, links, description } = req.body;
    const { userID } = res.locals.user;
    const newPost = new Post({
      user_id: userID,
      post_title: title,
      project_urls: links,
      post_description: description,
      created_on: currentDate(),
    });
    let postID;
    newPost
      .save()
      .then((createdPost) => {
        // console.log(createdPost.dataValues.id);
        postID = createdPost.dataValues.id;
        res.status(200).json({
          status: 'successful',
          postID: postID,
        });
      })
      .catch((err) => {
        err.code = 'POSTS-NOTSAVED';
        throw err;
      });
  } catch (error) {
    if (error.code == 'POSTS-NOTSAVED') {
      res.staus(400).json({
        status: 'unsuccessful',
      });
    } else {
      res.status(500).json({
        status: 'unsuccessful',
      });
    }
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { postID } = req.params;
    const post = await Post.findOne({
      attributes: [
        ['id', 'projectID'],
        ['user_id', 'userID'],
        ['post_title', 'postTitle'],
        ['project_urls', 'projectURLs'],
        ['post_description', 'postDescription'],
        ['media_urls', 'mediaURLs'],
      ],
      where: {
        id: { [Op.eq]: postID },
      },
    });
    // console.log(post.dataValues);
    if (post) {
      res.status(200).json(post.dataValues);
    } else {
      res.status(404).json({
        status: 'unsuccessful',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'successful',
    });
  }
};

export const getPostsForFeed = async (req, res, next) => {
  const randomRows = await Post.findAll({
    attributes: [
      ['id', 'projectID'],
      ['post_title', 'postTitle'],
      ['project_urls', 'projectURLs'],
      ['post_description', 'postDescription'],
      ['media_urls', 'mediaURLs'],
    ],
    include: {
      model: User,
      as: 'users',
      attributes: [
        ['id', 'userID'],
        [literal(`"users"."first_name" || ' ' || "users"."last_name"`), 'name'],
      ],
      required: true,
    },
    order: Sequelize.literal('random()'),
    limit: 10,
  });
  if (randomRows) {
    res.status(200).json(randomRows);
  } else {
    res.status(400).json({
      status: 'unsuccessful',
    });
  }
  // try {

  // } catch (error) {
  //   res.status(500).json({
  //     status: 'unsuccessful',
  //   });
  // }
};
