import { extractArticlePageData,writeDataToJSON } from '../utils.js';
import crawler from "../crawler.js";
import { BASE_URL } from "../constant.js";
import fs from "fs";

const  articlePageDataPromise  = await extractArticlePageData(BASE_URL,crawler);
//console.log(JSON.stringify(articlePageDataPromise))
writeDataToJSON("data/article.json", articlePageDataPromise);

// fs.writeFile('movieData.json',JSON.stringify(articlePageDataPromise),(error)=>{
//    if(error) throw error;
//    console.log('file successfylly saved',JSON.stringify(name));
// })