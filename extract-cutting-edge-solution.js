import * as cheerio from "cheerio";
import { edgeSelectors,edgeHome } from './selectors.js';
import fs from "fs";
import path from "path";
export const extractCuttingEdgeSolutionPageData = async(
    articleLink,
    category,
    crawler
)=>{
    return new Promise(async (resolve,reject)=>{
        crawler.queue({
            uri:articleLink,
            callback: (error,response,done)=>{
                if(error || response.statusCode !== 200){
                    console.log('link : ',articleLink)
                    console.log(`An error occurred while fetching cutting edge page data`,error);
                    console.log('-----------------------------------------------------')
                    resolve(
                        Object.keys(edgeSelectors).reduce((articlePageDetails, key) => {
                            articlePageDetails[key] = null;
                            return articlePageDetails;
                        }, {})
                    )
                    done();
                    return;
                }
                resolve(extractArticlePageDetails(cheerio.load(response.body),articleLink,category));
                done();
            }
        })
    })
}
const extractArticlePageDetails = ($,articleLink,category)=>{
    const articlePageData = {};
    articlePageData["category"] = category;
    for(let [key,selector] of Object.entries(edgeSelectors)){
        let parsedValue = $(selector)?.text().trim() ?? null;
       
        if (parsedValue === "") {
            parsedValue = null;
        }
        if(key == 'wpid'){
            
            let classes = $('body', selector)[0].attribs.class;
            const index = classes.indexOf('page-id')
            classes = classes.substring(index)

            const data = classes.split(" ");
            parsedValue = data[0].substring(8);
            
        }
        if(key == 'page_header'){
            parsedValue = retrivePageHeader($,selector);
        }
        if(key == 'content'){
            parsedValue = retrivePageContent($,selector);
        }
        if (key === "section_header") {
         parsedValue = retiveSectionHeader($, selector);
        }

        if(key == "section_header_1"){
            parsedValue = retiveSectionHeader1($,selector);
        }

        if (key === "feature_product") {
            parsedValue = extractFeatureProduct($, selector);
        }
        articlePageData[key] = parsedValue;
    }
    articlePageData['link']=articleLink;
    return articlePageData;
}

const retrivePageHeader =($,selector)=>{
    const pageHeader = {};
    $('a',selector).each((index, element) => {
        pageHeader['href'] = $(element).attr('href') || null;
        pageHeader['back_message'] = $(element).text() || null;
    })
    pageHeader['image'] = $('.page-header-img',selector).find('img')[0].attribs.src || null;
    pageHeader['title'] = $('.page-title',selector).text() || null;
    pageHeader['pacecore'] = $('.pacecore-dek',selector).text() || null;
    
    return pageHeader;
}

const retrivePageContent = ($,selector)=>{
    const content = {};
    content['title'] = $('.content-alternating-title',selector).text() || null;
    content['message'] = $('p',selector).text() || null;

    const videoLink = {};
    $('iframe', selector).each((index, element) => {
        const $element = $(element);
        videoLink['src'] = $element.attr('src');
        videoLink['title'] = $element.attr('title');
    });
    content['video'] = videoLink;
    return content;
}

const retiveSectionHeader = ($,selector)=>{
    const sectionHeader = {};
    sectionHeader['title'] = $('.section-header-title',selector).text() || null;
    sectionHeader['subtitle'] = $('.section-header-subtitle',selector).text() || null;

    const section_header2 = '#pacecore_fmt_2';
    const li = [];
    $('li', section_header2).each((index, el) => {
        li.push($(el).text());
    });

    sectionHeader['li'] = li;

    return sectionHeader;
}

const retiveSectionHeader1 = ($,selector)=>{
    const sectionHeader = {};
    sectionHeader['title'] = $('.section-header-title',selector).text() || null;
    
    const section_header4 = '#pacecore_fmt_4';
    const card = [];
    $('a', section_header4).each((index, element) => {
        const $element = $(element);
        const videoLink = {};
        videoLink['src'] = $element.attr('href');
        videoLink['image'] = $element.find('img')[0].attribs.src;
        videoLink['text'] = $element.find('.content-cards-text').text().trim();
        card.push(videoLink)
    });
    sectionHeader['card'] = card;
    return sectionHeader;
}

const extractFeatureProduct = ($,selector)=>{
    const products = [];
    for(let node of $('.products-carousel-item',selector).toArray()){
        const product ={};
        product['image'] = $('img',node)[0].attribs.src || null;
        product['message'] = $('.products-carousel-text>p',node).text().trim() || null;
        products.push(product);
    }
    return products;
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


//Extract edge solution home page
export const extractCuttingEdgeSolutionHomePageData = async(
    articleLink,
    crawler
)=>{
    return new Promise(async (resolve,reject)=>{
        crawler.queue({
            uri:articleLink,
            callback: (error,response,done)=>{
                if(error || response.statusCode !== 200){
                    console.log('link : ',articleLink)
                    console.log(`An error occurred while fetching cutting edge page data`,error);
                    console.log('-----------------------------------------------------')
                    resolve(
                        Object.keys(edgeHome).reduce((articlePageDetails, key) => {
                            articlePageDetails[key] = null;
                            return articlePageDetails;
                        }, {})
                    )
                    done();
                    return;
                }
                resolve(extractEdgeHomePage(cheerio.load(response.body),articleLink));
                done();
            }
        })
    })
}

const extractEdgeHomePage = ($,articleLink)=>{
    const articlePageData = {};
    for(let [key,selector] of Object.entries(edgeHome)){
        let parsedValue = $(selector)?.text().trim() ?? null;
       
        if (parsedValue === "") {
            parsedValue = null;
        }
        if(key == 'wpid'){
            
            let classes = $('body', selector)[0].attribs.class;
            const index = classes.indexOf('page-id')
            classes = classes.substring(index)

            const data = classes.split(" ");
            parsedValue = data[0].substring(8);
            
        }
        if(key == 'header_image'){
            parsedValue = retriveHeaderImage($,selector);
        }

        if(key == 'header_text'){
            parsedValue = retriveHeaderText($,selector);
        }

        if(key == 'bill_board'){
            parsedValue = retriveBillBoard($,selector);
        }

        if(key == 'bill_board'){
            parsedValue = retriveBillBoard($,selector);
        }
        
        if(key == 'edge_solutions'){
            parsedValue = retriveEdgeSoulutions($,selector);
        }

        if(key == 'content_body'){
            parsedValue = retriveContentBody($,selector);
        }
        
        if(key == 'products'){
            parsedValue = retriveRelatedProducts($,selector);
        }
        
        if(key == 'related_recipies'){
            parsedValue = retriveRelatedRecipies($,selector);
        }

        if(key == 'link_page'){
            parsedValue = addLinksTag($,selector,$(selector).find("p").text().trim())
        }
        
        articlePageData[key] = parsedValue;
    }
    articlePageData['link']=articleLink;
    return articlePageData;
}

const retriveHeaderImage = ($, selector) => {
    const image = $(selector).find('img')[0].attribs.src || null;
    const image_large = $(selector).find('source')[0].attribs.srcset || null; //768-large
    return {
        small_image: image,
        large_image: image_large
    }
}

const retriveHeaderText = ($, selector) => {
    const header_title = $(selector).find("h2").text().trim() || null ;
    const header_subtitle = $(selector).find("p").text().trim() || null;
    return {
        title: header_title,
        sub_title: header_subtitle
    }
}
const retriveBillBoard = ($, selector) => {
    const videoLink ={}
    $('iframe', selector).each((index, element) => {
        const $element = $(element);
        videoLink['src'] = $element.attr('src') || null ;
        videoLink['title'] = $element.attr('title').trim() || null;
    });

    const cards = [];
    $('a', selector).each((index, element) => {
        const $element = $(element);
        const card = {};
        card['href'] = $element.attr('href') || null;
        card['image'] = $element.find('img')[0].attribs.src || null;
        card['text'] = $element.find('.content-billboard-list-title').text().trim() || null;
        if(card['href']!=null && card['image'] != null && card['text']!=null)
            cards.push(card)
    });
    return {
        video : videoLink,
        cards: cards
    }
}

const retriveEdgeSoulutions = ($, selector) => {
    const title = $(selector).find("h2").text().trim() || null;

    const cutting_edges = "#pacecore_fmt_3";

    const edges = []
    $('a', cutting_edges).each((index, element) => {
        const $element = $(element);
        const edge = {};
        edge['href'] = $element.attr('href');
        edge['image'] = $element.find('img')[0].attribs.src;
        edge['headings'] = $element.find('h3').text().trim();
        edge['text'] = $element.find('p').text().trim();
        edges.push(edge)
    });

    return {
        title: title,
        edge_solutions:edges
    }
}

const retriveContentBody = ($, selector) => {
    const data = {};
    data['title'] = $(selector).find(".content-alternating-title").text().trim() || null;
    data['data'] = $(selector).find("p").text().trim() || null;
    $('a', selector).each((index, element) => {
        const $element = $(element);
        data['link'] = '<a href='+$element.attr('href')+'>'+$element.text()+'</a>'
    });
    data["image"] = $(selector).find('img')[0].attribs.src || null;
    return data;
}

const retriveRelatedProducts = ($, selector) => {
    const title = $(selector).find("h2").text().trim() || null;
    const sub_title = $(selector).find("p").text().trim() || null;

    const peatureProduct = '#cta-featured-products-6';
    const products = [];
    for(let node of $('.products-carousel-item',peatureProduct).toArray()){
        const product = {
            image: $('img',node)[0].attribs.src,
            data: $('.products-carousel-text>p',node).text().trim()
        }
        products.push(product)
    }
    return {
        title: title,
        sub_title: sub_title,
        related_products: products
    }
}

const retriveRelatedRecipies = ($, selector) => {
    const title = $(selector).find("h2").text().trim() || nunll;
    const sub_title = $(selector).find("p").text().trim() || nunll;

    const content_card  = "#pacecore_fmt_8" ;

    const recipies = []
    $('a', content_card).each((index, element) => {
        const $element = $(element);
        const recipe = {};
        recipe['href'] = $element.attr('href') || null;
        recipe['image'] = $element.find('img')[0].attribs.src || null;
        recipe['headings'] = $element.find('h3').text().trim() || null;
        recipies.push(recipe)
    });

    return {
        title:title,
        sub_title:sub_title,
        related_resipies : recipies
    }
}

const addLinksTag = ($,data,paragraph)=>{
    const links = {};
    $('a', data).each((index, element) => {
        const title= $(element).text().trim() || null;
        if(title !== null){
            const link = $(element).attr('href');
            links[title] = '<a href='+link+'>'+title +'</a>';
        }
    })
    Object.keys(links).forEach((key) => {
        paragraph = paragraph.replace(key, links[key]);
    })
    return paragraph;
}
