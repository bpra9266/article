import { extractCuttingEdgeSolutionPageData,writeDataToJSON } from '../extract-cutting-edge-solution.js';
import crawler from "../crawler.js";
import { BASE_URL } from "../cutting-edge-constant.js";
import fs from "fs";

//const extractedArticleList = await readDataFromXL();
//const articleList = [];
// for(const article of extractedArticleList){
//     const  articlePageDataPromise  = await extractArticlePageData(article['Article URL'],crawler);
//     articleList.push(articlePageDataPromise);
// }
const  articlePageDataPromise  = await extractCuttingEdgeSolutionPageData(BASE_URL,"a",crawler);
//console.log(JSON.stringify(articlePageDataPromise))
writeDataToJSON("data/curring-edge.json", articlePageDataPromise);

// fs.writeFile('movieData.json',JSON.stringify(articlePageDataPromise),(error)=>{
//    if(error) throw error;
//    console.log('file successfylly saved',JSON.stringify(name));
// })