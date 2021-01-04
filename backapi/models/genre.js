const base = require('./Base');
const Schema = base.Schema;
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: {type:String, required: true,min:3, max: 100}
});

// 虚拟属性'url': 书本类别'URL'
GenreSchema
    .virtual('url')
    .get(function(){
        return '/catalog/genre/' + this._id;
    });

// 导出 genre 模型
module.exports = base.mongoose.model('Genre', GenreSchema);    
