const categoryService = require("../services/category-service");
const ROLES_LIST = require("../config/roles-list");

function createCategory(req, res) {
  const { title, description } = req.body;

  if (!title || !description) return res.sendStatus(400);

  if (req.user.userRole !== ROLES_LIST.Admin) return res.sendStatus(403);

  categoryService.findCategoryByTitle(title).then((category) => {
    if (category) {
      return res.status(409).json({ message: "Category already exist" });
    }

    categoryService.createCategory(title, description).then((ok) => {
      if (!ok) return res.sendStatus(500);
      return res.sendStatus(200);
    });
  });
}

function updateCategory(req, res) {
  const categoryID = parseInt(req.params.category_id, 10);
  const { title, description } = req.body;

  if (!title || !description || isNaN(categoryID)) return res.sendStatus(400);

  if (req.user.userRole !== ROLES_LIST.Admin) return res.sendStatus(403);

  categoryService.updateCategory(categoryID, title, description).then((ok) => {
    if (!ok) return res.sendStatus(500);
    return res.sendStatus(200);
  });
}

function deleteCategory(req, res) {
  const categoryID = parseInt(req.params.category_id, 10);
  if (isNaN(categoryID)) return res.sendStatus(400);

  if (req.user.userRole !== ROLES_LIST.Admin) return res.sendStatus(403);

  categoryService.deleteCategory(categoryID).then((ok) => {
    if (!ok) return res.sendStatus(500);
    return res.sendStatus(200);
  });
}

function getCategory(req, res) {
  const categoryID = parseInt(req.params.category_id, 10);
  if (isNaN(categoryID)) return res.sendStatus(400);

  categoryService.getCategoryById(categoryID).then((category) => {
    if (!category) return res.sendStatus(500);
    return res.status(200).json(category);
  });
}

function getPostsByCategory(req, res) {
  return res.json(res.items_json);
  // const categoryID = parseInt(req.params.category_id, 10);
  // if (isNaN(categoryID)) return res.sendStatus(400);

  // categoryService.getPostsByCategoryId(categoryID).then((categories) => {
  //   if (!categories) return res.sendStatus(404);
  //   return res.status(200).json(categories);
  // });
}

function getAllCategories(req, res) {
  return res.json(res.items_json);
  // console.log(res.items_json);
  // categoryService.getAllCategories().then((categories) => {
  //   if (!categories) return res.sendStatus(500);
  //   return res.status(200).json(categories);
  // });
}

function searchCategories(req, res) {
  console.log("SEARCH CATEGORY");
  const pattern = req.query.pattern;

  if (!pattern) return res.sendStatus(400);

  categoryService.searchByTitle(pattern).then((result) => {
    if (!result) return res.sendStatus(404);

    return res.status(200).json({ data: result });
  });
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getPostsByCategory,
  getAllCategories,
  searchCategories,
};
