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
                    console.log('link : ',articleLink)
                    console.log(`An error occurred while fetching article page data`,error);
                    console.log('-----------------------------------------------------')
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
        if(key == 'wpid'){
            $('article',selector).each((index, element) => {
                const $element = $(element);
                const id = $element.attr('id').substring(5);
                parsedValue = id;
            });
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

        if(key == "related_post"){
            parsedValue = extractRelatedPost($,selector);
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
const extractRelatedPost = ($,selector)=>{
    const related_post = [];
    for (let node of $(selector).toArray()){
        $('a',node).each((index, element) => {
            const $element = $(element);
            const post = {
                href: $element.attr('href') || null,
                image: $element.find('source').attr('srcset') || null,
                title: $element.find('h3').text() || null,
                category: $element.find('span').text() || null
            }
            related_post.push(post);
         })
    }
}
const extractArticleContents = ($, selector) => {
    let article_content = [];
    for (let node of $(selector).toArray()) {
        const isQuotePresent =$('.tweetable-quote',node).text() || null;
        let header = $("h2", node)?.text().trim() || null;
        
        const isCtaPresent = $(node).find('.pacecore-cta-heading').text() || null;
        const isPostAction = $(node).find('.post-call-to-action-container-body-text').text() || null; 
        
        if(isQuotePresent == null && isCtaPresent == null && isPostAction == null)
        if(header === null && article_content.length == 0){
            let article_content_items = createObject(header);
            for (let data of $("p,ul,ol", node).toArray()){
                if(data.name === 'p'){
                    let paragraph = $(data).text().trim()||null;
                    paragraph = addStrongTag($,paragraph,data);
                    if(paragraph !== null)
                    article_content_items.content.push(paragraph);
                    const links = retriveLinks($,data);
                    if(links.length !==0){
                        article_content_items.links.concat(links)
                    }
                }

                if(data.name === 'ul'){
                    const liList =retriveUlList($,data, article_content_items.content.length+1);
                    article_content_items.ul.push(liList);
                }
                if(data.name === 'ol'){
                    const liList =retriveUlList($,data, article_content_items.content.length+1);
                    article_content_items.ol.push(liList);
                }
            }

            const carouselData = $('.gallery-carousel-item',node).find('figure');
            if(carouselData.length !== 0){
                const carousel = retivecarouselItem($,carouselData,0)
                article_content_items.carousels.push(carousel);
            }

            const imageUrls=$('img',node);
            if(carouselData.length === 0 && imageUrls.length!==0){
                const imageData = retriveImage($,node,0)
                article_content_items.images.push(imageData);
            }
           
            article_content.push(article_content_items);
        }else{
            for (let data of $("h2,p,ul,ol", node).toArray()){
                if(data.name === "h2"){
                    header = $(data).text().trim() || null;
                    let article_content_items = createObject(header);
                    article_content.push(article_content_items);
                }else if(data.name == 'p'){
                    try{
                        let paragraph = $(data).text().trim() || null; //first paragraph came with out header
                        paragraph = addStrongTag($,paragraph,data);
                        if(paragraph !== null)
                            article_content.at(-1).content.push(paragraph);
                    }catch(ex){
                        let paragraph = $(data).text().trim() || null;
                        paragraph = addStrongTag($,paragraph,data);
                        let article_content_items = createObject(null);
                        if(paragraph !== null)
                            article_content_items.content.push(paragraph);
                        article_content.push(article_content_items);
                    }
                    const links = retriveLinks($,data);
                    if(links.length !==0){
                        article_content.at(-1).links.push(...links.map(obj => obj))
                    }            
                }
                if(data.name === 'ul'){
                    const liList =retriveUlList($,data,article_content.at(-1).content.length+1);
                    article_content.at(-1).ul.push(liList);
                }
                if(data.name === 'ol'){
                    const liList =retriveUlList($,data, article_content.at(-1).content.length+1);
                    article_content.at(-1).ol.push(liList);
                }
            }

            const carouselData = $('.gallery-carousel-item',node).find('figure');
            if(carouselData.length !== 0){
                const carousel = retivecarouselItem($,carouselData,article_content.at(-1).content.length+1)
                article_content.at(-1).carousels.push(carousel);
            }

            const imageUrls=$('img',node);
            if(carouselData.length === 0 && imageUrls.length!==0){
                const imageData = retriveImage($,node,article_content.at(-1).content.length+1)
                article_content.at(-1).images.push(imageData);
            }
        }

        
        if(isQuotePresent!==null){
            const quote_data = retirveQuotes($,node,article_content.at(-1).content.length + 1);
            article_content.at(-1).quotes.push(quote_data);
        }

        const video = extractVideo($,node);
        if(!isEmptyObject(video)){
            video['position']=article_content.at(-1).content.length+1;
            article_content.at(-1).videos.push(video)
        }

        if(isCtaPresent !==null ){
           const cta = retiveCallToAcctions($,node);
           article_content.at(-1).CTA=cta;
        }

        if(isPostAction !== null){
            const action = retivePostCallToAcctions($,node);
            article_content.at(-1).action=action;
        }
    } 
    article_content = article_content.filter((data)=>{
        const heading = data.heading;
        const content = data.content;
        const ul = data.ul;
        const ol = data.ol;
        const images = data.images;
        const carousels = data.carousels;
        const quotes = data.quotes;
        const videos = data.videos;
        const links = data.links;
        const CTA = data.CTA;
        const action = data.action;
        if (heading === null && content.length === 0 && ul.length === 0 && ol.length === 0 && 
            images.length === 0 && carousels.length === 0 && quotes.length === 0 && 
            videos.length === 0 && isEmptyObject(CTA) && isEmptyObject(action)) {
                return false;
        }
        return true;
    })
      
    return article_content;
}

const retivecarouselItem = ($,carouselData,pos)=>{
    const carouselIteam = [];
    carouselData.each((index,element)=>{
        const image = $('img',element)[0].attribs.src || null;
        const image_alt = $('img',element)[0].attribs.alt || null;
        const image_class = $('img',element)[0].attribs.class || null;
        const caption = $('.image-caption-inner',element).text() || null;
        const imageData = {
            image: image,
            caption: caption,
            image_alt: image_alt,
            image_class: image_class,
        }
        carouselIteam.push(imageData)
    })
    const carousels = {
        carousels : carouselIteam,
        position : pos
    }
    return carousels;
}
const retiveCallToAcctions = ($,node)=>{
    const CTA = {};

    CTA['link'] = $(node).find('a').attr('href');
    CTA['heading'] = $(node).find('.pacecore-cta-heading').text() || null;
    CTA['container'] = $(node).find('.cta-link-container').text() || null;
    CTA['body'] = $(node).find('.pacecore-cta-body-text').text() || null;
    if($(node).find('img').length !== 0){
        CTA['image'] = $(node).find('img')[0].attribs.src || null;
        CTA['alt'] = $(node).find('img')[0].attribs.alt || null;
    }else{
        CTA['image'] = null;
        CTA['alt'] =null
    }

    return CTA;
}
const retivePostCallToAcctions = ($,node)=>{
    const action = {};

    action['link'] = $(node).find('a').attr('href');
    action['category'] = $(node).find('.post-call-to-action-category').text() || null;
    action['heading'] = $(node).find('.post-call-to-action-heading').text() || null;
    action['body'] = $(node).find('.post-call-to-action-body-text').text() || null;
    action['image'] = $(node).find('img')[0].attribs.src || null;
    action['alt'] = $(node).find('img')[0].attribs.alt || null;
    return action;
}

const retriveLinks = ($,data)=>{
    const links = [];
    $('a', data).each((index, element) => {
        const title= $(element).text().trim() || null;
        if(title !== null){
            const link = {
                link: $(element).attr('href'),
                title: $(element).text().trim()
            }
            links.push(link);
        }
    })
    return links;
}
const addStrongTag = ($,paragraph,data)=>{
    const strong = {};
    for (let element of $("strong", data).toArray()) {
        const strongTag = $(element).text().trim() || null;
        if (strongTag !== null)
            strong[strongTag] = '<strong>' + strongTag + '</strong>'
    }
    Object.keys(strong).forEach((key) => {
        paragraph = paragraph.replace(key, strong[key]);
    })
    return paragraph;
}
const retirveQuotes = ($,node,position)=>{
    const quote_data = {};
    for (let quote_node of $(node).toArray()) {
        const tweetable_quote = $('.tweetable-quote', quote_node).text() || null;
        const author = $('.tweetable-quote-author', quote_node).text() || null;
        const title = $('.tweetable-quote-author-title', quote_node).text() || null;
        quote_data["tweetable_quote"] = tweetable_quote;
        quote_data["author"] = author;
        quote_data["title"] = title;
        quote_data["position"] = position;
    }
    return quote_data;
}
const createObject = (header)=>{
    let article_content_items = {
        heading: header,
        content: [],
        ul:[],
        ol:[],
        images:[],
        carousels:[],
        quotes:[],
        videos:[],
        links:[],
        CTA:{},
        action:{}
    };
    return article_content_items;
}
const retriveImage = ($,node,pos)=>{
    const image = $('img',node)[0].attribs.src || null;
    const image_alt = $('img',node)[0].attribs.alt || null;
    const image_class = $('img',node)[0].attribs.class || null;
    const caption = $('.image-caption-inner',node).text() || null;
    let href = null;
    $('a',node).each((index, element) => {
        href = $(element).attr('href') || null
    })
    const imageData = {
        image: image,
        caption: caption,
        image_alt:image_alt,
        image_class:image_class,
        href: href,
        position: pos
    }
    return imageData;
} 
const retriveUlList = ($,data,pos)=>{
    const li = [];

    $('li', data).each((index, el) => {
        let strongTag = $('strong', el).text().trim()||null;
        let liData = $(el).text().trim();
        if(strongTag !== null){
            liData = liData.replace(strongTag,'<strong>' + strongTag + '</strong> ')
        }
        li.push(liData);
    });
    const liList = {
        li: li,
        position: pos
    }
    return liList;
}
export const isEmptyObject=(obj)=>{
    return JSON.stringify(obj) === '{}'
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
    $('iframe',selector).each((index, element) => {
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
        range: "A1:A206",
        defval: null,
    })
    return articleList;
}

export const readDataFromJSON = (inputFilePath) => {
    return JSON.parse(fs.readFileSync(inputFilePath, "utf-8"));
};

export const downloadAsset = async (crawler, assetUrl, filePath) => {
    return new Promise((resolve) => {
        crawler.queue({
            uri: assetUrl,
            filePath,
            callback: (error, response, done) => {
                if (error) {
                    console.error(error);
                } else {
                    fs.mkdir(path.dirname(filePath), { recursive: true }, (error) => {
                        if (error) {
                            console.error(
                                `Failed to create non existing directories in the output file path ${filePath}`
                            );
                        } else {
                            fs.createWriteStream(response.options.filePath).write(
                                response.body
                            );
                        }
                    });
                }
                resolve();
                done();
            },
        });
    });
};

export const getDuration = (start, end) => {
    const diff = end - start;
    return {
        seconds: Math.floor((diff / 1_000) % 60),
        minutes: Math.floor((diff / 60_000) % 60),
        hours: Math.floor((diff / 3_600_000) % 24),
    };
};