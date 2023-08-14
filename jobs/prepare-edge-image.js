import { readDataFromJSON ,writeDataToJSON} from "../utils.js";
import path from "path";
//import path from "../data/cutting-edge-response.json";

const articleData = readDataFromJSON("../data/curring-edge.json");

const retriveData = ()=>{
    const images = [];
    //console.log(articleData[0])
    for(const article of articleData){
        const data = retirveImageData(article);
        images.push(...data.map(d=>d));
    }

    writeDataToJSON("../data/article-edge/images.json", images);
}
const retirveImageData = (articleData)=>{
    
    let images = [];
    const wpid = articleData.wpid;
    const slug = retriveSlug(articleData.link);

    const image_header = getImage(wpid, slug,articleData.page_header.image);
    images.push(image_header);

    for (const article of articleData.section_header_1.card) {
        const image = getImage(wpid, slug,article.image);
        images.push(image);
    }

    // for (const article of articleData.feature_product) {
    //     const image = getImage(wpid, slug,article.image);
    //     images.push(image);
    // }
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