const db = require("../models");

function pagination(model, customSelect = null) {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      if (page < 1) return res.sendStatus(400);

      const offset = (page - 1) * limit;

      let selectOptions = res.selectOptions;
      if (selectOptions) {
        selectOptions.offset = offset;
        selectOptions.limit = limit;
      }

      let records;
      let totalCount;

      // NOTE: The custom select functionality is deprecated.
      // It exists solely to support the deprecated /api/categories/:category_id/posts endpoint.
      // Please use sorting and filtering options to achieve the functionality of the mentioned endpoint.
      if (customSelect != null) {
        records = await new Promise((resolve, reject) => {
          customSelect(req.params)
            .then((result) => resolve(result))
            .catch((error) => reject(error));
        });

        totalCount = records.length;
      } else {
        const { rows, count: total } = await model.findAndCountAll(
          selectOptions
        );
        records = rows;
        totalCount = total;
      }

      const totalPages = Math.ceil(totalCount / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;
      res.items_json = {
        records,
        pagination: {
          total: totalCount,
          totalPages,
          currentPage: page,
          nextPage,
          prevPage,
        },
      };
      next();
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  };
}

module.exports = pagination;
