const request = require('request');
const cheerio = require('cheerio');

const articlesSearch = (req, res, next) => {

  const queryText = req.body.query;
  console.log(queryText);
  fetchArticleWithQuery(queryText).then(value => {
      res.status(200).send(value);
  })
  .catch(err => {

    if (err) {
        const e = new Error(err)
        e.status = 500

        next(e)
    } else {
        next(err)
    }

})

}

exports.articlesSearch = articlesSearch;


const fetchArticleWithQuery = (query) =>

  new Promise((resolve, reject) => {
    const data = [];
    request('https://medium.com/tag/' + query, (error, response, html) => {
      if (error) return reject(error);
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        $('.postArticle').each((i, el) => {
          const title = $(el)
            .find('.graf--title')
            .text();

          const description = $(el).find('.graf--trailing').text();

          const link = $(el).find('.postArticle-content').parent().attr('href');

          const author = $(el).find('.postMetaInline').find('[data-action=show-user-card]').text();

          const date = $(el).find('time').text();

          const readingTime = $(el).find('.readingTime').attr('title');

          const imgURL = $(el).find('.graf-image').attr('src');

          data.push({
            title,
            description,
            link,
            author,
            date,
            readingTime,
            imgURL
          })

        });

        // console.log(data);
        resolve(data);
      } else {
        reject(response);
      }

    });
  });

