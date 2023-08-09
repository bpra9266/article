const SELECTOR_CHEF_NAME = '.article-hero-split-text>h1,.article-hero-stacked-container>h1';
const SELECTOR_CATEGORY_TYPE = '.article-hero-split-text>span,.article-hero-stacked-container>span';
const SELECTOR_ARTICLE_SLOGAN = '.article-hero-split-text>p,.article-hero-stacked-container>p';
const SELECTOR_HERO_IMAGE = '.article-hero-img';
const SELECTOR_ARTICLE_CONTENT = '.pacecore-block-article-content-col,.single-image-wrapper>figure,.wp-block-image,.quote-container,.wp-block-embed__wrapper,.video-container,.call-to-action-container,.gallery-carousel';
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

//CUTTING EDGE SOLUTION SELECTOR
const SELECTOR_PAGE_HEADER = '.page-header';
const SELECTOR_CONTENT = '#pacecore_fmt_0';
const SELECTOR_SECTION_HEADER = '#pacecore_fmt_1';
const SELECTOR_SECTION_HEADER_LIST = '#pacecore_fmt_2';
const SELECTOR_SECTION_HEADER_1 = '#pacecore_fmt_3';
const SELECTOR_SECTION_HEADER_1_CARD = '#pacecore_fmt_4';
const SELECTOR_SECTION_FEATURE_PRODUCT = '#cta-featured-products-5';

export const edgeSelectors = {
    page_header: SELECTOR_PAGE_HEADER,
    content: SELECTOR_CONTENT,
    section_header: SELECTOR_SECTION_HEADER,
    //section_header_list: SELECTOR_SECTION_HEADER_LIST,
    section_header_1: SELECTOR_SECTION_HEADER_1,
    //section_header_1_card: SELECTOR_SECTION_HEADER_1_CARD,
    feature_product: SELECTOR_SECTION_FEATURE_PRODUCT,
}