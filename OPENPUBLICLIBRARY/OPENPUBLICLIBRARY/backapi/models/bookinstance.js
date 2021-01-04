const base = require('./Base');
const Schema = base.Schema;
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
var moment = require('moment');

const BookInstanceSchema = new Schema({
    // 指向相关藏书的引用
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    // 出版项
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
        default: 'Maintenance'
    },
    due_back: { type: Date, default: Date.now }
});

// 虚拟属性 'url': 藏书副本URL
BookInstanceSchema
    .virtual('url')
    .get(function () {
        return '/catalog/bookinstance/' + this._id;
    });

// 虚拟属性 'ddue_back_formatted': 归还日期
BookInstanceSchema
    .virtual('due_back_formatted')
    .get(() => {
        return moment(this.due_back).format('MMMM Do, YYYY');
    });
    
//format 'YYYY-MM-DD'
BookInstanceSchema
    .virtual('due_back_yyyy_mm_dd')
    .get(function () {
        return DateTime.fromJSDate(this.due_back).toISODate(); 
    });
// 导出 BookInstance 模型
module.exports = base.mongoose.model('BookInstance', BookInstanceSchema);    
