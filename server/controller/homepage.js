const { errorCode } = require("../res_code/code");

function homepageController(req,res){
    try{
        console.log(path.join(__dirname, + '..'));
        res.readFile(path.join(__dirname, + '..' + '/public/hosting.html'));
    } catch(error){
        errorCode.data.message = error.message;
    return errorCode;
    }
}

module.exports = {
    homepageController
}