/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Feedback = mongoose.model('Feedback');

exports.create = function(req, res) {
  var comment = req.body.comment;

  var feedback = new Feedback({
    user: req.user,
    comment: comment
  });

  feedback.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500);
      return res.jsonp({
        msg: 'error leaving feedback'
      });
    }
    res.send({success:true});
  });
};
