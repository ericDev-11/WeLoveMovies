const service = require("./reviews.service");

// MIDDLEWARE FUNCTIONS
// check if a review is in the db
async function reviewExists(req, res, next) {
  const review = await service.findReview(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  } else {
    next({ status: 404, message: "Review cannot be found." });
  }
}

// CRUD FUNCTIONS
// update review
async function update(req, res) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await service.update(updatedReview);
  const data = await service.findReview(updatedReview.review_id);
  res.json({ data });
}

// delete review
async function destroy(req, res) {
  const { review } = res.locals;
  await service.destroy(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  update: [reviewExists, update],
  delete: [reviewExists, destroy],
};
