const SELECTOR_CHEF_NAME = '.article-hero-split-text>h1,.article-hero-stacked-container>h1';
const SELECTOR_CATEGORY_TYPE = '.article-hero-split-text>span,.article-hero-stacked-container>span';
const SELECTOR_ARTICLE_SLOGAN = '.article-hero-split-text>p,.article-hero-stacked-container>p';
const SELECTOR_HERO_IMAGE = '.article-hero-img';
const SELECTOR_ARTICLE_CONTENT = '.pacecore-block-article-content-col,.single-image-wrapper>figure,.wp-block-image,.quote-container,.wp-block-embed__wrapper,.video-container';
const SELECTOR_WRAPPER_IMAGE = '.single-image-wrapper>figure,.wp-block-image';
const SELECTOR_BLOCK_IMAGE = '.wp-block-image';
const SELECTOR_QUOTE = '.quote-container';
const SELECTOR_VIDEO = '.wp-block-pacecore-pacecore-video,.video-container,.wp-block-embed__wrapper';
const SELECTOR_WPID = '.site-main';
const SELECTOR_RELATED_POST = '.posts-related';

export const selectors = {
    wpid: SELECTOR_WPID,
    name: SELECTOR_CHEF_NAME,
    category: SELECTOR_CATEGORY_TYPE,
    slogan: SELECTOR_ARTICLE_SLOGAN,
    hero_image: SELECTOR_HERO_IMAGE,
    article_content: SELECTOR_ARTICLE_CONTENT,
    related_post: SELECTOR_RELATED_POST
    //wrapper_image: SELECTOR_WRAPPER_IMAGE,
    //block_image: SELECTOR_BLOCK_IMAGE,
    //quote: SELECTOR_QUOTE,
    //video: SELECTOR_VIDEO
}