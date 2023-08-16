import { downloadAsset, getDuration, readDataFromJSON } from "../utils.js";
import crawler from "../crawler.js";
import path from "path";



console.info("Sysco Foodie recipe assets downloading job started");

const articleData = readDataFromJSON("../data/article/images.json");
//const articleData = readDataFromJSON("../data/article-edge/images.json");
const assetDownloadPromises = [];
for (const article of articleData) {
  assetDownloadPromises.push(
    new Promise(async (resolve) => {
      const recipeWPID = article.wpid;
      const slug = article.slug;
      const fileUrl = article.image;
      const name = article.name;
      const extension = path.basename(fileUrl).match(/[0-9a-z]+$/i);
      //const filePath = `data/assets/article-edge-images/${recipeWPID}_${slug}_${name}.${extension}`;
      const filePath = `data/assets/article-images/${recipeWPID}_${slug}_${name}.${extension}`;
      resolve(downloadAsset(crawler, fileUrl, filePath));
    })
  );
}

await Promise.allSettled(assetDownloadPromises);