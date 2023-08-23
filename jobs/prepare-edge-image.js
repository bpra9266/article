import { readDataFromJSON ,writeDataToJSON} from "../utils.js";
import path from "path";
//import path from "../data/cutting-edge-response.json";
const START = 'https://image.sysco.com/image-server/product/image/';
const END = '/web';
const articleData = readDataFromJSON("../data/cutting-edge.json");
const cuttingedgeHome = readDataFromJSON("../data/curring-edge-home.json");
const retriveData = ()=>{
    let images = [];
    //console.log(articleData[0])
    for(const article of articleData){
        const data = retirveImageData(article);
        images.push(...data.map(d=>d));
    }
    //images = retirveImageData(articleData);
    writeDataToJSON("../data/article-edge/feature_product_images.json", images);
}
const retirveImageData = (articleData)=>{
    
    let images = [];
    // const wpid = articleData.wpid;
    // const slug = retriveSlug(articleData.link);

    // const image_header = getImage(wpid, slug,articleData.page_header.image);
    // images.push(image_header);

    // for (const article of articleData.section_header_1.card) {
    //     const image = getImage(wpid, slug,article.image);
    //     images.push(image);
    // }

    //for feature_product
    for (const article of articleData.feature_product) {
        const slug = "feature_product_image"
        const image = getImage1(slug,article.image);
        const name = article.image.substring(START.length,article.image.indexOf(END));
        image["name"] = name;
        images.push(image);
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

const getImage1 = (slug,imageUrl)=>{
    const image = {
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

//retriveData(); //for article

const retirveCuttingEdgeHomePageImages = ()=>{
    let images = [];
    const wpid = cuttingedgeHome.wpid;
    const slug = retriveSlug(cuttingedgeHome.link);

    images.push(getImage(wpid, slug,cuttingedgeHome.header_image.small_image));
    images.push(getImage(wpid, slug,cuttingedgeHome.header_image.large_image));

    for(let card of cuttingedgeHome.bill_board.cards){
        images.push(getImage(wpid, slug,card.image));
    }

    for(let card of cuttingedgeHome.edge_solutions.edge_solutions){
        images.push(getImage(wpid, slug,card.image));
    }
    images.push(getImage(wpid, slug,cuttingedgeHome.content_body.image));

    for(let card of cuttingedgeHome.related_recipies.related_resipies){
        images.push(getImage(wpid, slug,card.image));
    }
    writeDataToJSON("../data/article-edge/edge_home_images.json", images);
}
retirveCuttingEdgeHomePageImages(); //for home page
