const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
  res.json({
    posts: {
      title: "it's ,y first post",
      description: 'random data you shouldnot know'
    }
  });
});

module.exports = router;