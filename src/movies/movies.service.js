const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// HELPER FUNCTIONS
// helper function to group critic category properties for nesting
const addCategory = mapProperties({
  critic_id: "critic.crtic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

// /MOVIES
// list all movies
function list() {
  return knex("movies").select("*");
}

// list all movies where 'is_showing' is equal to 'true'
function listIsShowing() {
  return knex("movies AS m")
    .join("movies_theaters AS mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ is_showing: true })
    .groupBy("m.movie_id");
}

// /MOVIES/:MOVIEID
// find a movie based on 'movie_id'
function read(movie_id) {
  return knex("movies").select("*").where({ movie_id }).first();
}

// find theaters where a movie is playing based on 'movie_id'
function readTheatersBy(movie_id) {
  return knex("movies AS m")
    .join("movies_theaters AS mt", "m.movie_id", "mt.movie_id")
    .join("theaters AS t", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.*")
    .where({ "m.movie_id": movie_id });
}

// find reviews on a movie based on 'movie_id'
function readReviewsBy(movie_id) {
  return knex("movies AS m")
    .join("reviews AS r", "m.movie_id", "r.movie_id")
    .join("critics AS c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "m.movie_id": movie_id })
    .then((reviews) => reviews.map((review) => addCategory(review)));
}

module.exports = {
  list,
  listIsShowing,
  read,
  readTheatersBy,
  readReviewsBy,
};
