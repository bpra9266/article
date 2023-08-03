import { selectors } from './selectors.js';
import fs from "fs";
import * as cheerio from "cheerio";
import { resolve } from 'path';
import { error } from 'console';
import './node_modules/core-js/features/array/at.js'
import path from "path";
import XLSX from "xlsx";

export const extractArticlePageData = async(
    articleLink,
    crawler
)=>{
    return new Promise(async (resolve,reject)=>{
        crawler.queue({
            uri:articleLink,
            callback: (error,response,done)=>{
                if(error || response.statusCode !== 200){
                    console.log(`An error occurred while fetching article page data`);
                    resolve(
                        Object.keys(selectors).reduce((articlePageDetails, key) => {
                            articlePageDetails[key] = null;
                            return articlePageDetails;
                        }, {})
                    )
                    done();
                    return;
                }
                resolve(extractArticlePageDetails(cheerio.load(response.body),articleLink));
                done();
            }
        })
    })
}

const extractArticlePageDetails = ($,articleLink) =>{
    const articlePageData = {};

    for(let [key,selector] of Object.entries(selectors)){
        let parsedValue = $(selector)?.text().trim() ?? null;
       
        if (parsedValue === "") {
            parsedValue = null;
        }
        
        if(key == 'hero_image'){
            if($(selector).find('img').length!==0){
                parsedValue = $(selector).find('img')[0].attribs.src || null;
            }else{
                parsedValue = null;
            }
        }
        if (key === "article_content") {
         parsedValue = extractArticleContents($, selector);
        }

        if (key === "wrapper_image" || key === "block_image") {
            parsedValue = extractWrapperImages($, selector,key);
        }

        if(key === 'quote'){
            parsedValue = extractQuote($,selector);
        }
        if(key === 'video'){
            parsedValue = extractVideo($,selector);
        }

        if(key == "block_image" && parsedValue.length>=1){
            articlePageData["wrapper_image"] = parsedValue;
        }else{
            if(key == "block_image" && parsedValue.length==0)
                continue;
            articlePageData[key] = parsedValue;
        }
    }
    articlePageData['link']=articleLink;
    return articlePageData;
}

const extractArticleContents = ($, selector) => {
    const article_content = [];
    for (let node of $(selector).toArray()) {
        let header = $("h2", node)?.text().trim() || null;
        if(header === null && article_content.length == 0){
            //const desc= $("p", node)?.text().trim() || null;
            let article_content_items = {
                heading: header,
                content: [],
            };
            for (let data of $("p", node).toArray()){
                article_content_items.content.push($(data).text().trim());
            }
            article_content.push(article_content_items);
        }else{
            for (let data of $("h2,p", node).toArray()){
                if(data.name === "h2"){
                    header = $(data).text().trim() || null;
                    let article_content_items = {
                        heading: header,
                        content: [],
                    };
                    article_content.push(article_content_items);
                }else{
                    try{
                        const paragraph = $(data).text().trim() || null;
                        article_content.at(-1).content.push(paragraph);
                    }catch(ex){
                        const paragraph = $(data).text().trim() || null;
                        let article_content_items = {
                            heading: null,
                            content: [],
                        };
                        article_content_items.content.push(paragraph);
                        article_content.push(article_content_items);
                        //console.log(articleLink)
                    }
                }
            }
        }
    }
    return article_content;
}

const extractWrapperImages = ($, selector,key) =>{
    let images=[];
    for (let node of $(selector).toArray()) {
        const imageUrls=$('img',node)[0].attribs.src || null;
        const caption = $('.image-caption-inner',node).text() || null;
        const data = {
            image: imageUrls,
            caption: caption
        }
        images.push(data)
    }
    return images;
}

const extractQuote = ($,selector) =>{
    const quote = {};
    for (let node of $(selector).toArray()) {
        const tweetable_quote = $('.tweetable-quote',node).text() || null;
        const author = $('.tweetable-quote-author',node).text() || null;
        const title = $('.tweetable-quote-author-title',node).text() || null;
        quote["tweetable_quote"]=tweetable_quote;
        quote["author"]=author;
        quote["title"]=title;
    }
    return quote;
}

const extractVideo = ($,selector)=>{
    const videoLink = {};
    $('iframe').each((index, element) => {
        const $element = $(element);
        videoLink['src']= $element.attr('src');
        videoLink['title'] = $element.attr('title');
        videoLink['width'] = $element.attr('width');
        videoLink['height'] = $element.attr('height');
    });
    return videoLink;
}

export const writeDataToJSON = (outputFilePath, data) => {
    fs.mkdir(path.dirname(outputFilePath), { recursive: true }, (error) => {
      if (error) {
        logger.error(
          "Failed to create non existing directories in the given output file path"
        );
        saveFile("data.json", data);
      } else {
        saveFile(outputFilePath, data);
      }
    });
};

const saveFile = (outputFilePath, data) => {
    fs.writeFile(outputFilePath, JSON.stringify(data), "utf-8", (error) => {
      if (error) {
        console.error(`Saving data into ${outputFilePath} failed`);
      } else {
        console.info(`Data has been successfully saved to ${outputFilePath}`);
      }
    });
};

export const readDataFromXL = async()=> {
    const workbook = XLSX.readFile("article.xlsx");
    const worksheet = workbook.Sheets["Sheet1"];
    const articleList = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
        range: "A1:A83",
        defval: null,
    })
    return articleList;
}