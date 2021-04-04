const Util = require('@next-theme/utils');
const { createHash } = require('crypto');
const utils = new Util(hexo, __dirname);


const imgid = (page) => {
  const hash = createHash('sha256');
  hash.update(page.path);
  return parseInt(hash.digest("hex"), 16) % 5 + 1;
};


hexo.extend.filter.register('theme_inject', function(injects) {
  injects.header.raw('headerimg', utils.getFileContent('../source/_data/header.njk'), {imgid: imgid});
});
