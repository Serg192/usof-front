const db = require("../models");

function hasAllItems(mainArray, itemsToCheck) {
  return itemsToCheck.every((item) => mainArray.includes(item));
}

//It should not be like that, it is a Kludge
//Should be removed in the future
function filter(model) {
  return async (req, res, next) => {
    if (model === db.Posts) {
      const categoryFilter = req.query.category;
      if (categoryFilter) {
        const categories = Array.from(categoryFilter.split(",")).map((n) =>
          parseInt(n, 10)
        );
        let filtered = res.items_json.records.filter((rec) => {
          let ids = [];
          ids = rec.post_categories.map((category) => category.id);
          return hasAllItems(ids, categories);
        });

        const totalCount = filtered.length;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const totalPages = Math.ceil(totalCount / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
        res.items_json = {
          records: filtered,
          pagination: {
            total: totalCount,
            totalPages,
            currentPage: page,
            nextPage,
            prevPage,
          },
        };
      }
    }
    next();
  };
}

module.exports = filter;
