import { readDataFromJSON, writeDataToJSON } from "../utils.js";
//import logger from "../logger.js";

const articleData = readDataFromJSON("../data/article.json");

const category = new Set();
for (let article of articleData) {
  if(article.category !==null)
  category.add(article.category)
  if(article.sub_category !==null)
  category.add(article.sub_category)
}

writeDataToJSON("data/article-attributes.json", Array.from(category));

// const recipeAttributes = recipeData.reduce(
//   (result, recipe) => {
//     Object.entries(result).forEach(([key, value]) => {
//       recipe.metadata[key].forEach((valueObj) => {
//         if (!(valueObj.wpid in value)) {
//           value[valueObj.wpid] = valueObj.value;
//         }
//       });
//     });
//     return result;
//   },
//   {
//     main_categories: {},
//     sub_categories: {}
//   }
// );

// Object.entries(recipeAttributes).forEach(([attribute, valueObj]) => {
//   const data = Object.entries(valueObj).map(([wpid, value]) => {
//     if (wpid === "null") {
//       wpid = null;
//     }
//     return {
//       wpid,
//       value,
//     };
//   });
//   if (attribute === "cuisines") {
//     data.forEach((item) => (item.image_url = null));
//   }
//   recipeAttributes[attribute] = data;
// });

//writeDataToJSON("data/recipe-attributes.json", recipeAttributes);