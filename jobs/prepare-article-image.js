import { readDataFromJSON } from "../utils.js";
import path from "path";

const articleData = readDataFromJSON("../data/article1.json");

const retirveImageData = (articleData)=>{
    
    let images = [];
    const wpid = articleData.wpid;
    const slug = retriveSlug(articleData.link);
    for (const article of articleData.article_content) {

        for (const image_data of article.images) {
            const image = getImage(wpid, slug, image_data.image);
            images.push(image);
        }
        for (const carousel_data of article.carousels) {
            for (const carousel of carousel_data.carousels) {
                const image = getImage(wpid, slug, carousel.image);
                images.push(image);
            }
        }
        const image_cta = getImage(wpid, slug, article.CTA.image);
        images.push(image_cta);
        const image_action = getImage(wpid, slug, article.action.image);
        images.push(image_action);
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
const retriveSlug1 = (imageUrl)=>{
    return path.basename(imageUrl);
}
console.log(retirveImageData(articleData));