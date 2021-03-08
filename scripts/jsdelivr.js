const js = hexo.extend.helper.get('js').bind(hexo);
const crypto = require('crypto');
const { npm_url, gh_url } = require("jsdelivr_url");
const { version } = require("hexo-theme-next/package.json");

hexo.on('generateBefore', function () {
  hexo.theme.config.images = npm_url("hexo-theme-next", version, "source/images");
  if (process.env.CSS_COMMIT) {
    hexo.config.assets_prefix = gh_url("tongzhugroup", "tongzhugroup.github.io", process.env.CSS_COMMIT, "");
    hexo.theme.config.css = gh_url("tongzhugroup", "tongzhugroup.github.io", process.env.CSS_COMMIT, "css");
  }
});

hexo.extend.filter.register('after_generate', () => {
  hexo.route.remove('images/apple-touch-icon-next.png');
  hexo.route.remove('images/avatar.gif');
  hexo.route.remove('images/cc-by-nc-nd.svg');
  hexo.route.remove('images/cc-by-nc-sa.svg');
  hexo.route.remove('images/cc-by-nc.svg');
  hexo.route.remove('images/cc-by-nd.svg');
  hexo.route.remove('images/cc-by-sa.svg');
  hexo.route.remove('images/cc-by.svg');
  hexo.route.remove('images/cc-zero.svg');
  hexo.route.remove('images/favicon-16x16-next.png');
  hexo.route.remove('images/favicon-32x32-next.png');
  hexo.route.remove('images/logo-algolia-nebula-blue-full.svg');
  hexo.route.remove('images/logo.svg');
  hexo.route.remove('js/schemes/muse.js');
  hexo.route.remove('js/next-boot.js');
  hexo.route.remove('js/utils.js');
});

hexo.extend.injector.register('body_end',
  js(gh_url("njzjz", "gist", "5eab1974597adee1a1f5de13cc8acd53c14d6ba1", "modernizr-custom.js"))
);

hexo.extend.filter.register('after_generate', function (data) {
  const hexo = this;
  const reg = /<link(.*?) href="(.*?)\/main.css">/gi;
  return new Promise((resolve, reject) => {
    // read css and get md5
    const html = hexo.route.get("css/main.css");
    let cssContent = "";
    html.on('data', (chunk) => (cssContent += chunk));
    html.on('end', () => {
      const css_hash = crypto.createHash('md5').update(cssContent).digest('hex');
      const new_css_path = `css/${css_hash}.css`;
      hexo.route.remove('css/main.css');
      hexo.route.set(new_css_path, cssContent);
      resolve(css_hash);
    });
  }).then((css_hash) => {
    return Promise.all(hexo.route.list().filter(path => path.endsWith('.html')).map(path => {
      return new Promise((resolve, reject) => {
        const html = hexo.route.get(path);
        let htmlContent = "";
        html.on('data', (chunk) => (htmlContent += chunk));
        html.on('end', () => {
          hexo.route.set(path, htmlContent.replace(reg, function (str, p1, p2) {
            return str.replace("main.css", `${css_hash}.css`);
          }));
        });
        resolve();
      });
    }));
  });
});