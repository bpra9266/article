import { extractArticlePageData,writeDataToJSON,readDataFromXL } from '../utils.js';
import { extractCuttingEdgeSolutionPageData ,extractCuttingEdgeSolutionHomePageData} from '../extract-cutting-edge-solution.js'
import crawler from "../crawler.js";
import { BASE_URL } from "../constant.js";
import fs from "fs";
const CUTTING_EDGE_HOME_PAGE = 'https://foodie.sysco.com/new-spring-2023-cutting-edge-solutions/';

const extractedArticleList = await readDataFromXL();
const articleList = [];
const cuttingEdgeList = [];
// for(const article of extractedArticleList){
//     if(article['Article URL'].includes("cutting-edge")){
//         const  articlePageDataPromise  = await extractCuttingEdgeSolutionPageData(article['Article URL'],article['Category'],crawler);
//         cuttingEdgeList.push(articlePageDataPromise);
//     }else{
//         const  articlePageDataPromise  = await extractArticlePageData(article['Article URL'],article['Category'],crawler);
//         articleList.push(articlePageDataPromise);
//     }
// }
//const  articlePageDataPromise  = await extractArticlePageData(BASE_URL,"a",crawler);
//console.log(JSON.stringify(articlePageDataPromise))
//writeDataToJSON("data/article1.json", articleList);
//writeDataToJSON("data/cutting-edge1.json", cuttingEdgeList);
const  articlePageDataPromise  = await extractCuttingEdgeSolutionHomePageData(CUTTING_EDGE_HOME_PAGE,'Tips',crawler);
writeDataToJSON("data/cutting-edge-home1.json", articlePageDataPromise);
// fs.writeFile('movieData.json',JSON.stringify(articlePageDataPromise),(error)=>{
//    if(error) throw error;
//    console.log('file successfylly saved',JSON.stringify(name));
// })