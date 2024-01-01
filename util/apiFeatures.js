class APIFeatures {
    constructor(filterQuery, query) {
        this.filterQuery = filterQuery;
        this.query = query;
    }

    filter() {
        const queryObj = { ...this.query };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        this.filterQuery = this.filterQuery.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.query.sort) {
            const sortBy = this.query.sort.split(",").join(" ");
            this.filterQuery = this.filterQuery.sort(sortBy);
        } else {
            this.filterQuery = this.filterQuery.sort("-createdAt");
        }

        return this;
    }

    limitField() {
        if (this.query.fields) {
            const fields = this.query.fields.split(",").join(" ");
            this.filterQuery = this.filterQuery.select(fields);
        } else {
            this.filterQuery = this.filterQuery.select("-__v");
        }

        return this;
    }

    pagination() {
        const page = this.query.page * 1 || 1;
        const limit = this.query.limit * 1 || 20;
        const skip = (page - 1) * limit;

        this.filterQuery = this.filterQuery.skip(skip).limit(limit);

        return this;
    }

    artworks(userId) {
        if (userId) {
            this.filterQuery = this.filterQuery.find({ artist: userId });
        }

        return this;
    }
}

module.exports = APIFeatures;
