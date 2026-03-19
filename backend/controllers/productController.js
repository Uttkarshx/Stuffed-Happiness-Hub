const Product = require('../models/Product');
const mongoose = require('mongoose');

const toProductResponse = (productDoc) => {
  const product = productDoc.toObject ? productDoc.toObject() : productDoc;
  const reviewsData = Array.isArray(product.reviewsData) ? product.reviewsData : [];
  const reviews = reviewsData.length;
  const rating = reviews
    ? Number(
        (
          reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews
        ).toFixed(1)
      )
    : Number(product.rating ?? 4.5);

  return {
    ...product,
    reviews,
    rating,
  };
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Products fetched',
      data: products.map(toProductResponse),
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = await Product.findById(req.params.id).populate('reviewsData.user', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product fetched',
      data: toProductResponse(product),
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, bestFor, images, stock, isTrending, isBestSeller, rating } = req.body;

    if (!name || price === undefined || !description || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'name, price, description, category and stock are required',
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      bestFor: Array.isArray(bestFor) ? bestFor : [],
      images: Array.isArray(images) ? images : [],
      isTrending: Boolean(isTrending),
      isBestSeller: Boolean(isBestSeller),
      rating: Number(rating ?? 4.5),
      stock,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const addProductReview = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const { rating, comment } = req.body;

    if (!rating || !comment || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: 'rating (1-5) and comment are required',
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const existingReview = product.reviewsData.find(
      (review) => String(review.user) === String(req.user._id)
    );

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = String(comment).trim();
    } else {
      product.reviewsData.push({
        user: req.user._id,
        rating: Number(rating),
        comment: String(comment).trim(),
      });
    }

    await product.save();
    const populated = await Product.findById(product._id).populate('reviewsData.user', 'name');

    return res.status(200).json({
      success: true,
      message: 'Review submitted',
      data: toProductResponse(populated),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
};
