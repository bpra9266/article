import { extractArticlePageData,writeDataToJSON,readDataFromXL } from '../utils.js';
import crawler from "../crawler.js";
import { BASE_URL } from "../constant.js";
import fs from "fs";

const extractedArticleList = await readDataFromXL();
const articleList = [];
for(const article of extractedArticleList){
    const  articlePageDataPromise  = await extractArticlePageData(article['Article URL'],crawler);
    articleList.push(articlePageDataPromise);
}
//const  articlePageDataPromise  = await extractArticlePageData(BASE_URL,crawler);
//console.log(JSON.stringify(articlePageDataPromise))
writeDataToJSON("data/article.json", articleList);

// fs.writeFile('movieData.json',JSON.stringify(articlePageDataPromise),(error)=>{
//    if(error) throw error;
//    console.log('file successfylly saved',JSON.stringify(name));
// })