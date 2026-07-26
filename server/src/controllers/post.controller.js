import { createPostSchema } from "../validators/post.validator.js";
import { createPost as createPostService, 
  getAllPosts, 
  getPostById, 
  updatePost as updatePostService, 
  deletePost as deletePostService, 
  toggleLike, } from "../services/post.service.js";
import { updatePostSchema } from "../validators/post.validator.js";


export async function createPost(req, res, next) {
  try {
    const body = createPostSchema.parse(req.body);

    const post = await createPostService(req.user.id, body);

    res.status(201).json({
      success: true,
      message: "Post berhasil dibuat.",
      post,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPosts(req, res, next) {
  try {
    const posts = await getAllPosts(req.user?.id);

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await getPostById(req.params.id);

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const body = updatePostSchema.parse(req.body);

    const post = await updatePostService(
      req.params.id,
      req.user.id,
      body
    );

    res.status(200).json({
      success: true,
      message: "Post berhasil diperbarui.",
      post,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    await deletePostService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Post berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}


export async function likePost(req, res, next) {
  try {
    const result = await toggleLike(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: result.liked
        ? "Post berhasil disukai."
        : "Like berhasil dihapus.",
      liked: result.liked,
    });
  } catch (error) {
    next(error);
  }
}