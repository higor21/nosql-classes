var Comment = require("../models/comment")
var Campground = require("../models/campground")
var User = require("../models/user")

var middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated())
        return next()
    req.flash("error", "You must be logged in to do that!")
    res.redirect("/login")
}

middlewareObj.checkPermissionToEditUser = function(req, res, next){

    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser) {
            if(!err && foundUser._id.equals(req.user._id)){
                return next()
            }else{
                req.flash("error", "You don't have permission to edit to do that")
                res.redirect('back')
            }
        })
    }
}

middlewareObj.checkPermissionToEditComment = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.idComment, function(err, foundComment) {
            if(!err && foundComment.author.id.equals(req.user._id))
                next()
            else{
                req.flash("error", "You don't have permission to do that!")
                res.redirect('back')
            }
        })
    }else{
        req.flash("error", "You aren't authenticated!")
        res.redirect('/login')
    }
}

middlewareObj.checkPermissionToRemoveComment = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.idComment, function(err, foundComment) {
            if(!err)
                Campground.findById(req.params.id, function(err, foundCamp) {
                    if(!err && (req.user.isAdmin || foundComment.author.id.equals(req.user._id) || foundCamp.author.id.equals(req.user._id)))
                        next()
                    else{
                        req.flash("error", "You don't have permission to do that!")
                        res.redirect('back')
                    }
                })
        })
    }else{
        req.flash("error", "You aren't authenticated!")
        res.redirect('/login')
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, camp) {
            if(!err && (camp.author.id.equals(req.user._id) || req.user.isAdmin))
                next()
            else{
                req.flash("error", "You don't have permission to do that!")
                res.redirect('back')
            }
        })
    }else{
        req.flash("error", "You aren't authenticated!")
        res.redirect('back')
    }
}

module.exports = middlewareObj