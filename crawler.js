import Crawler from "crawler";

const crawler = new Crawler({
  maxConnections: 64,
  encoding: null,
  jQuery: false,
});

export default crawler;