if (process.env.CSS_COMMIT) {
    hexo.on('generateBefore', function () {
        hexo.theme.config.css = `https://cdn.jsdelivr.net/gh/tongzhugroup/tongzhugroup.github.io@${process.env.CSS_COMMIT}`;
    });

    if (!process.env.DO_NOT_REMOVE_CSS) {
        hexo.extend.filter.register('after_generate', () => {
            hexo.route.remove('css/main.css');
        });
    }
}