const base = require('./Base');
const Schema = base.Schema;
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const BookSchema = new Schema(
    {
        title: {type: String, required: true},
        author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
        summary: {type: String, required: true},
        isbn: {type: String, required: true},
        genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
        image:{type: String},
    }
);

// 虚拟属性'url': 藏书 URL
BookSchema
    .virtual('url')
    .get(function(){
        return '/catalog/book/' + this._id;
    });

// 导出 Book 模块
module.exports = base.mongoose.model('Book', BookSchema);    
