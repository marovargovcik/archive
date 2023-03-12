const router = require('express').Router();
const blogRepository = require('../repositories/blog');
const categoriesRepository = require('../repositories/categories');
const pagesRepository = require('../repositories/pages');
const productsRepository = require('../repositories/products');

router.get('/sitemap', async (req, res, next) => {
  const {
    utils: { baseUrl }
  } = res.locals;
  const sitemap = [
    {
      url: baseUrl
    },
    {
      url: `${baseUrl}/eshop`
    },
    {
      url: `${baseUrl}/blog`
    },
    {
      url: `${baseUrl}/caste-otazky`
    },
    {
      url: `${baseUrl}/objednavka`
    }
  ];

  const categories = await categoriesRepository.getCategories();
  categories.forEach(category =>
    sitemap.push({
      url: `${baseUrl}/eshop/${category.fields.slug}`,
      lastModified: category.sys.updatedAt
    })
  );

  const products = await productsRepository.getProductsForSitemap();
  products.forEach(product =>
    sitemap.push({
      url: `${baseUrl}/eshop/produkt/${product.fields.slug}`,
      lastModified: product.sys.updatedAt
    })
  );

  const blogPosts = await blogRepository.getBlogPostsForSitemap();
  blogPosts.forEach(blogPost =>
    sitemap.push({
      url: `${baseUrl}/blog/${blogPost.fields.slug}`,
      lastModified: blogPost.sys.updatedAt
    })
  );

  const pages = await pagesRepository.getPages();
  pages.forEach(page =>
    sitemap.push({
      url: `${baseUrl}/stranky/${page.fields.slug}`,
      lastModified: page.sys.updatedAt
    })
  );

  res.setHeader('Content-Type', 'text/xml');
  res.render('sitemap', {
    sitemap
  });
});
module.exports = router;
