const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

// HELPER FUNCTIONS
// helper function to group movie category properties for nesting
const addCategory = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

// /THEATERS
// list theaters with movies nested in each theater
function list() {
  return knex("theaters AS t")
    .join("movies_theaters AS mt", "t.theater_id", "mt.theater_id")
    .join("movies AS m", "mt.movie_id", "m.movie_id")
    .select("t.*", "mt.*", "m.*")
    .then(addCategory);
}

module.exports = {
  list,
};
