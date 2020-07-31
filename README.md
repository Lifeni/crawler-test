# 爬虫测试网站

用于 Python 爬虫的测试网站，需要 Node 环境和 MongoDB。

展示网站的仓库：[Lifeni/crawler-dashboard: Python 爬虫与数据展示](https://github.com/Lifeni/crawler-dashboard) 。

## 内容

测试网站分为三个部分，包含了不同的网站结构，方便进行爬虫测试。

### 必应壁纸

包含 90 张壁纸及其信息，每张图片还有随机生成的点赞和下载数据（每次启动程序时生成），可以进行模拟统计。图片经过压缩，分辨率比较低，压缩后，所有图片一共不到 5MB 大小。

网站为传统的分页式结构，每页包含 10 张图片，切换页面通过查询来实现，也就是 `example.com/pictures?page=2`，没有查询条件时默认第一页，查询不存在时返回 404 状态。

### 宋词

包含了 21000 首词，1400 位词作者的数据，部分数据有缺字和内容缺失的情况。

页面结构分为三层：

1. `example.com/poems` 作者索引页面，包含了所有作者的链接

2. `example.com/poems/作者名字` 某位作者的页面，包含作者的个人信息（有些作者没有）和作品，作品的名字会存在重复，所以在作品的名字后面还会显示作品的第一句话，方便辨识。作品的名字即是链接，链接后面会加上一个四位数的 id，供程序查询词的信息，详见下面一条。

3. `example.com/poems/作者名字/词牌名@ffff` 词作品页面，链接中的 `@ffff` 用来表示相同词牌名的不同词，四位 16 进制数取自 MongoDB 自动生成的 `_id` 字段后四位。这个页面包含词名、作者名、词的内容。

### 一言

包含 4000 多个句子，一言本身分为 12 中类型，这里在储存的时候已经自动把类型和句子本身合到一张表里了。句子数据包括句子本身、来源、来源的作者（这两个不一定有）、句子编号。

网页结构是通过查询 `id` 字段来实现的，每次进入网页都会随机选择一个句子数据，但是也可以通过遍历的方式，从 1 开始遍历所有句子，没有的序号会返回状态 404,。

## 技术

- Express.js + EJS + Bootstrap.js 生成页面

- Faker.js 生成随机点赞和下载信息

- MongoDB（Mongoose）储存宋词和一言数据

## 数据源

- 必应壁纸的信息来自：[xndcn/bing-wallpaper-archive](https://github.com/xndcn/bing-wallpaper-archive)

- 宋词数据来自：[chinese-poetry/chinese-poetry: The most comprehensive database of Chinese poetry 🧶最全中华古诗词数据库, 唐宋两朝近一万四千古诗人, 接近5.5万首唐诗加26万宋诗. 两宋时期1564位词人，21050首词。](https://github.com/chinese-poetry/chinese-poetry)

- 一言数据来自：[hitokoto-osc/sentences-bundle: 一言开源社区官方提供的语句库，系 hitokoto.cn 数据库打包集合。语句接口默认使用此库。](https://github.com/hitokoto-osc/sentences-bundle)

## 版权

- 首页“宋词”图片：Photo by [Yifeng Lu](https://unsplash.com/@maxlogi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

- 首页“一言”图片：Photo by [Hello I'm Nik 🎞](https://unsplash.com/@helloimnik?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

- 其余图片均来自必应壁纸

## 安装和运行

### 数据库配置

运行项目之前需要安装 MongoDB，推荐使用 Docker 进行安装：

```bash
docker run -itd --name crawler-mongo -p 27017:27017 mongo
```

数据库没有进行认证选项，如果需要密码验证，请自行更改代码。默认使用的数据库的名字是 `data`，端口 `27017`，地址为 `127.0.0.1`。

### 部署过程

1. 克隆或者下载项目到本地。

2. 进入项目文件夹，在安装 Node 和 npm 的情况下执行：
   
   ```bash
   $ npm install
   # 或者考虑使用 cnpm：
   # cnpm install 
   ```

3. 把数据源的数据存入数据库，方便读取：
   
   ```bash
    $ node db.js
   ```
   
   读入数据需要一定时间，控制台会输出提示。程序**不会**自动结束，所以需要按 `Ctrl` + `C` 结束运行。

4. 运行主程序：
   
   ```bash
   $ npm start
   # 如果使用 forever 之类的守护程序
   # node ./bin/www
   ```

5. 访问打开 http://localhost:3000 ，或者使用服务器反向代理 3000 端口即可。