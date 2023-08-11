import * as cheerio from "cheerio";
import { edgeSelectors } from './selectors.js';
import fs from "fs";
import path from "path";
export const extractCuttingEdgeSolutionPageData = async(
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
                        Object.keys(edgeSelectors).reduce((articlePageDetails, key) => {
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
const extractArticlePageDetails = ($,articleLink)=>{
    const articlePageData = {};

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