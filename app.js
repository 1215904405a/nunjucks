//参考官网 https://mozilla.github.io/nunjucks/api.html
const nunjucks = require('nunjucks');
const Koa = require('koa');
// init koa
const app = module.exports = new Koa();

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment( //new Environment([loaders], [opts])
            new nunjucks.FileSystemLoader( //new FileSystemLoader([searchPaths], [opts])  This is only available to node. It will load templates from the filesystem
                path, //using the searchPaths array as paths to look for templates  定位模版路径
                {
                    noCache: noCache, //值为true the system will avoid using a cache and templates will be recompiled every single time    生产为false
                    watch: watch, //开发环境automatically update templates  生产值为false
                }), {
                autoescape: autoescape, //You can use this boolean property to see if autoescaping is turned on globally or not
                throwOnUndefined: throwOnUndefined // throw errors when outputting a null/undefined value
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]); //加过滤器
        }
    }
    return env;
}

var env = createEnv('views', {
    watch: true,
    filters: { //过滤
        hex: function(n) {
            console.log(n);
            return '0x' + n.toString(16);
        }
    }
});

var s = env.render('hello.html', {
    name: '<Nunjucks>',
    fruits: ['Apple', 'Pear', 'Banana'],
    count: 12000
});

console.log(s);

console.log(env.render('extend.html', {
    header: 'Hello',
    body: 'bla bla bla...'
}));

app.use(async(ctx, next) => { //用来测试  暂时不用路由
    // ctx.render = render(ctx, env);
    ctx.body = s;
    // await next();
});

app.listen(3003, function() {
    console.info(`成功:服务已经启动, http://localhost:${3003}`);
});
