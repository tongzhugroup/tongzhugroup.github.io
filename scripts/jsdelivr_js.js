const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.filter.register('after_generate', () => {	
    hexo.route.remove('js/schemes/muse.js');
    hexo.route.remove('js/next-boot.js');
    hexo.route.remove('js/utils.js');
  });

hexo.extend.injector.register('body_end', () => {
	return js("https://cdn.jsdelivr.net/gh/njzjz/gist@5eab1974597adee1a1f5de13cc8acd53c14d6ba1/modernizr-custom.js");
});

if(process.env.CSS_COMMIT){
  hexo.config.assets_prefix = "https://cdn.jsdelivr.net/gh/tongzhugroup/tongzhugroup.github.io@gh-pages/";
}
