const ejs = require('ejs')

module.exports.render = (content, data) => {
    return ejs.render(content, data)
}