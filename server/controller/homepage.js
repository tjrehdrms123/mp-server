const { errorCode } = require("../res_code/code");

function homepageController(req,res){
    try{
        res.render('/page/index.html');
    } catch(error){
        errorCode.data.message = error.message;
    return errorCode;
    }
}

module.exports = {
    homepageController
}