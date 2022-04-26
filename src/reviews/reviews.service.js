const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// HELPER FUNCTIONS
// helper function to group critic category properties for nesting
const addCategory = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

// helper function to find review by 'review_id'
function findReview(review_id) {
  return knex("reviews AS r")
    .join("critics AS c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ review_id })
    .first()
    .then(addCategory);
}

// /REVIEWS/:REVIEWID
// update review
function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

// delete review based on 'review_id'
function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  findReview,
  update,
  destroy,
};
