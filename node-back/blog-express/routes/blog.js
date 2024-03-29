var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')
const { SuccessModel, ErrorModel } = require('../model/resModel')

/* GET users listing. */
router.get('/list', function(req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  if (req.query.isadmin) {
    console.log('is admin')
    if (!req.session.username) {
      console.error('is admin but noe login');
      res.json(
        new ErrorModel('未登录')
      )
      return
    }
    author = req.session.username
  }

  const result = getList(author, keyword)
  return result.then(listData => {
    res.json(
      new SuccessModel(listData)
    ) 
  })

});

router.get('/detail', function(req, res, next) {
  const result = getDetail(req.query.id)
  return result.then(data => {
      res.json(
        new SuccessModel(data)
      ) 
  })
});

router.post('/new', loginCheck, (req, res, next) => {
  console.log(req.session);
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data => {
    res.json(
      new SuccessModel(data)
    )
  })
})

router.post('/update', loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body)
  return result.then(val => {
      if (val) {
          res.json(
            new SuccessModel()
          )
      } else {
          res.json(
            new ErrorModel('更新博客失败')
          )
      }
  })
})

router.post('/del', loginCheck, (req, res, next) => {
  const author = req.session.username
  const result = delBlog(req.query.id, author)
  return result.then(val => {
      if (val) {
          res.json(
            new SuccessModel()
          )
      } else {
        res.json(
          new ErrorModel('删除博客失败')
        )
      }
  })
})


module.exports = router;
