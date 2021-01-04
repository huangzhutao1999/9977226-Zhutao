const base = require('./Base');
const Schema = base.Schema;
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
var moment = require('moment');

const AuthorSchema = new Schema(
    {
        first_name : {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
);

// 虚拟属性 'name': 表示作者命名
AuthorSchema
    .virtual('name')
    .get(function() {
        return this.family_name + ', ' + this.first_name;
    });

// 虚拟属性'url':作者URL
AuthorSchema
    .virtual('url')
    .get(function() {
        return '/catalog/author/' + this._id;
    });    

// 虚拟属性 'date_of_birth_formatted': 生效日期格式化
AuthorSchema
    .virtual('date_of_birth_formatted')
    .get(function(){
        return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
    });

// 虚拟属性 'date_of_death_formatted': 失效日期格式化
AuthorSchema
    .virtual('date_of_death_formatted')
    .get(function() {
        return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
    });

// 虚拟属性 'lifespan': 生命周期
AuthorSchema
    .virtual('lifespan')
    .get(function(){
        var lifespan = (this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : '') +
            "    -    " + (this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '');
        return  lifespan;
        
    }); 

// 导出 Author 模型
module.exports = base.mongoose.model('Author', AuthorSchema);    
