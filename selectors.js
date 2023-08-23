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
    sub_category: SELECTOR_CATEGORY_TYPE,
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
const SELECTOR_EDGE_WPID = '*';
const SELECTOR_PAGE_HEADER = '.page-header';
const SELECTOR_CONTENT = '#pacecore_fmt_0';
const SELECTOR_SECTION_HEADER = '#pacecore_fmt_1';
const SELECTOR_SECTION_HEADER_LIST = '#pacecore_fmt_2';
const SELECTOR_SECTION_HEADER_1 = '#pacecore_fmt_3';
const SELECTOR_SECTION_HEADER_1_CARD = '#pacecore_fmt_4';
const SELECTOR_SECTION_FEATURE_PRODUCT = '#cta-featured-products-5';

export const edgeSelectors = {
    wpid: SELECTOR_EDGE_WPID,
    page_header: SELECTOR_PAGE_HEADER,
    content: SELECTOR_CONTENT,
    section_header: SELECTOR_SECTION_HEADER,
    //section_header_list: SELECTOR_SECTION_HEADER_LIST,
    section_header_1: SELECTOR_SECTION_HEADER_1,
    //section_header_1_card: SELECTOR_SECTION_HEADER_1_CARD,
    feature_product: SELECTOR_SECTION_FEATURE_PRODUCT,
}

//cutting edge home page
const SELECTOR_HEADER_IMAGE = '.page-header-img';
const SELECTOR_HEADER_TEXT = '#pacecore_fmt_0';
const SELECTOR_BILL_BOARD = '.content-billboard';
const SELECTOR_CAROUSEL = '#pacecore_fmt_2';
const SELECTOR_BODY = '#pacecore_fmt_4';
const SELECTOR_PRODUCTS = '#pacecore_fmt_5';
const SELECTOR_RECIPIES = '#pacecore_fmt_7';
const SELECTOR_LINK = '#pacecore_fmt_9';

export const edgeHome = {
    wpid: SELECTOR_EDGE_WPID,
    header_image:SELECTOR_HEADER_IMAGE,
    header_text:SELECTOR_HEADER_TEXT,
    bill_board: SELECTOR_BILL_BOARD,
    edge_solutions: SELECTOR_CAROUSEL,
    content_body:SELECTOR_BODY,
    products:SELECTOR_PRODUCTS,
    related_recipies: SELECTOR_RECIPIES,
    link_page:SELECTOR_LINK
}

