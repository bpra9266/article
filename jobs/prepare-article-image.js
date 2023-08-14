import { readDataFromJSON ,writeDataToJSON,isEmptyObject} from "../utils.js";
import path from "path";

const articleData = readDataFromJSON("../data/article2.json");


const retriveData = ()=>{
    const images = [];
    //console.log(articleData[0])
    for(const article of articleData){
        const data = retirveImageData(article);
        images.push(...data.map(d=>d));
    }

    writeDataToJSON("../data/article/images.json", images);
}
const retirveImageData = (articleData)=>{
    
    let images = [];
    const wpid = articleData.wpid;
    const slug = retriveSlug(articleData.link);
    if(articleData.hero_image !== null){
        const image = getImage(wpid, slug, articleData.hero_image);
        images.push(image);
    }
    for (const article of articleData.article_content) {

        for (const image_data of article.images) {
            if(image_data.image !==null){
                const image = getImage(wpid, slug, image_data.image);
                images.push(image);
            }
        }
        for (const carousel_data of article.carousels) {
            for (const carousel of carousel_data.carousels) {
                if(carousel.image !==null && carousel.image !== undefined){
                    const image = getImage(wpid, slug, carousel.image);
                    images.push(image);
                }
            }
        }
        if(!isEmptyObject(article.CTA)){
            if(article.CTA.image !==null && article.CTA.image !== undefined){
                const image_cta = getImage(wpid, slug, article.CTA.image);
                images.push(image_cta);
            }
        }
        if(!isEmptyObject(article.CTA)){
            if(article.action.image !==null && article.action.image !== undefined){
                const image_action = getImage(wpid, slug, article.action.image);
                images.push(image_action);
            }
        }

    }
    return images;
}

const getImage = (wpid,slug,imageUrl)=>{
    const image = {
        wpid: wpid,
        slug : slug,
        image : imageUrl,
        name : retriveSlug(imageUrl)
    }
    return image;
}
const retriveSlug = (imageUrl)=>{
    return path.basename(path.basename(imageUrl), path.extname(imageUrl));
}
//console.log(retirveImageData(articleData));

retriveData();