class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((el) => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj); // duration
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      // let query = Tour.find(JSON.parse(queryStr));
      this.query = this.query.find(JSON.parse(queryStr)); // duration[gte]
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query
          .sort(sortBy)
          .populate("author", "first_name last_name");
        console.log(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }
      return this;
    }
  
    paginate() {
      const { page = 1, limit = 10 } = this.queryString;
      this.query = this.query
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate("author", "first_name last_name")
        .exec();
  
      return this;
    }
    state() {
      if (this.queryString.state) {
        const queryObj = { ...this.queryString };
        let queryStr = JSON.stringify(queryObj);
        console.log(JSON.parse(queryStr));
  
        this.query = this.query.find(JSON.parse(queryStr));
      } else {
        this.query = this.query.find();
      }
      return this;
    }
    search() {
      if (this.queryString.author) {
        const author = this.queryString.author.split(",").join(" ");
        this.query = this.query.find({
          owner: { $regex: author },
          // state: "published",
        });
      }
      if (this.queryString.title) {
        const title = this.queryString.title.split(",").join(" ");
        this.query = this.query.find({ title: { $regex: title } });
      }
      if (this.queryString.tags) {
        const tags = this.queryString.tags.split(",").join(" ");
        this.query = this.query.find({ tags: { $regex: tags } });
      }
      return this;
    }
  }
  
  module.exports = APIFeatures;