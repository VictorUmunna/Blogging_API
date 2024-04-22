// Require the blog model
const BlogModel = require('../models/blogModel');

// External functions required
const { checkUser } = require('../middleware/jwt');
const { readingTime } = require('../middleware/utils')

const getAllBlogs = async (req, res) => {
    // Get pagination details from the query
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.skip)

    // Get all published blogs from database
    const blogs = await BlogModel.find()
        .where({ state: "published"})
        .skip(offset)
        .limit(limit)

    // Error message, if there are no published blogs
    if(!blogs.length){
        return res.json({
            status: "failed",
            message: "There are no published blogs, check Drafts!"
        })
    }
    // Apply pagination
    const blogCount = blogs.length
    const currentPage = Math.ceil(blogCount % offset)
    const totalPages = Math.ceil(blogCount / limit)

    // Return published blogs
    res.status(200).json({
        status: "success",
        message: "All published blogs",
        total: blogCount,
        page: currentPage,
        pages: totalPages,
        data: blogs
    })

}


const getMyArticles = async (req, res) => {
    // Get pagination details
    const limit = parseInt(req.query.limit)
    const offset = (req.query.limit)

    // Check for the current user
    const user = await checkUser(req, res)

    // Get data from database
    const userArticles = Article.find({ author: user.firstName})
        .skip(offset)
        .limit(limit)

    // Throw error message if there are no blogs
    if(!userArticles.length){
        return res.json({
            status: "failed",
            message: "This user does not have any published articles"
        })
    }

    // Apply pagination
    const articleCount = userArticles.length
    const totalPages = Math.ceil(articleCount / limit)
    const currentPage = Math.ceil(articleCount % offset)

    // Return article data
    res.status(200).json({
        status: "success",
        message: `All articles, published by ${user.firstName}`,
        total: articleCount,
        page: currentPage,
        pages: totalPages,
        data: userArticles
    })
}


const getArticle = async (req, res) => {
    // Get article from database with Id
    const article = await Article.findById(req.params.id)
        .where({ state: "published" })

    // Throw error message if article is not found
    if(!article){
        return res.status(404).send("The Article you requested was not found")
    }

    // Increase read count
    article.read_count++
    article.save()

    // Return data
    res.status(200).json({
        status: "success",
        message: `Single article post: "${article.title}"`,
        data: {
            article
        }
    })
}


const createArticle = async (req, res) => {

    try{
        // Get details from the request body
        const { title, description, state, tags, body } = req.body;

        // Check if article with that title exists
        const exists = await Article.findOne({ title })
        if(exists){
            return res.json({
                status: "failed",
                message: "Article with that title already exists"
            })
        }

        // Check for the current user
        const user = await checkUser(req, res)

        if(!user){
            return res.json({
                status: "failed",
                message: "You need to be logged in to create a articlepost"
            })
        }

        // Name of user is set to author of article
        const article = new Article({
            title,
            description,
            author: user.firstName,
            state,
            reading_time: readingTime(body),
            tags: tags,
            body,
        })

        // Save article to list of user articles
        user.articles.push(article.title)
        await user.save()
        await article.save()

        // Return article data
        return res.json({
            status: "success",
            message: `${user.firstName} ${user.lastName} created "${article.title}"`,
            data: article
        });
    }
    catch(err){
        res.status(500).send(err.message)
    }
}


const deleteArticle = async (req, res) => {

    // Get article from database
    const article = await Article.findOne({ __id: req.params.id })
    const user = await checkUser(req, res)

    // Check if current user is the author of the article
    if(user.firstName !== article.author){
        return res.status(401).send({
            message: "You are not authorized to delete this article"
        })
    }

    // Remove article from list of user articles
    const userArticles = user.articles
    for(let i = 0; i < userArticles.length; i++){
        if(userArticles[i] == article.title){
            userArticles.splice(i, 1)
        }
    }

    await user.save()
    await Article.findByIdAndDelete(req.params.id)

    // Return success message
    res.json({
        status: "success",
        message: `${article.title} was deleted`,
    })
}


const updateArticle = async (req, res) => {
    // Get details from request body
    const { title, description, state, tags, body } = req.body;

    const user = await checkUser(req, res)
    const article = await Article.findById(req.params.id)

    // check if current user is the author of the article
    if(user.firstName !== article.author){
        return res.send("You are not authorised to update this article")
    }

    // Update article
    const updatedArticle = await Article.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            title,
            description,
            state,
            tags,
            body
        }
    }, { new: true })

    // Return updated article
    res.status(200).json({
        status: "success",
        message: `${updatedArticle.title} was updated`,
        data: {
            updatedArticle
        }
    })
}


// Export all the functions
module.exports = {
    getAllArticles,
    getMyArticles,
    getArticle,
    createArticle,
    deleteArticle,
    updateArticle,
}
