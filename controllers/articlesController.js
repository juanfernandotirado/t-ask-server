const request = require('request');
const cheerio = require('cheerio');

//Article crawler, crawling articles from Medium
const articlesSearch = (req, res, next) => {

  //Get user query text
  const queryText = req.body.query;
  console.log(queryText);
  //Start crawling based on the query text
  fetchArticleWithQuery(queryText).then(value => {

      //Successfully crawl the articles, send back to front-end
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

    //Using npm package request to get the medium article research result
    //Request package from https://www.npmjs.com/package/request
    request('https://medium.com/tag/' + query, (error, response, html) => {
      if (error) return reject(error);
      if (response.statusCode === 200) {

        //Using npm package cheerio to parse the HTML file and get the information needed and compile them to a json object
        //Cheerio package from https://cheerio.js.org/
        const $ = cheerio.load(html);

        //Get single article and parse the content
        $('.postArticle').each((i, el) => {

          //Get article title
          const title = $(el)
            .find('.graf--title')
            .text();

          //Get article description
          const description = $(el).find('.graf--trailing').text();

          //Get article link
          const link = $(el).find('.postArticle-content').parent().attr('href');

          //Get article author
          const author = $(el).find('.postMetaInline').find('[data-action=show-user-card]').text();

          //Get article date
          const date = $(el).find('time').text();

          //Get article reading time
          const readingTime = $(el).find('.readingTime').attr('title');

          //Get article thumbnail
          const imgURL = $(el).find('.graf-image').attr('src');

          //Compile information to an object
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

        //Send the object back to front-end
        resolve(data);
      } else {
        reject(response);
      }

    });
  });

