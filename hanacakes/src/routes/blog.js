const router = require('express').Router();
const cache = require('../cache');
const blogRepository = require('../repositories/blog');
const settingsRepository = require('../repositories/settings');

router.get('/blog', async (req, res, next) => {
  let posts = cache.get('posts');
  if (!posts) {
    posts = await blogRepository.getBlogPosts();
    cache.set('posts', posts);
  }
  res.render('pages/blog', {
    posts,
    banner: 'Blog',
    seo: {
      title: 'Blog | Hana Cakes',
      description:
        'Overené recepty na výborné dobroty a všetky novinky zo zákulisia našej sladkej výroby.'
    }
  });
});

router.get('/blog/:post', async (req, res, next) => {
  const { post: slug } = req.params;
  const post = await blogRepository.getBlogPost(slug);
  const {
    fields: {
      name,
      seoDescription,
      image: {
        fields: {
          file: { url: blogPostImageUrl }
        }
      }
    }
  } = post;
  res.render('pages/blog-post', {
    post,
    banner: name,
    seo: {
      title: `${name} | Hana Cakes`,
      description: seoDescription,
      image: blogPostImageUrl
    }
  });
});

router.get('/test', (req, res) => {
  res.send(process.env.IG_TOKEN);
});

module.exports = router;
