var mongoose=require("mongoose");
var contentsSechma=require("../schemas/contents");

module.exports=mongoose.model("Content",contentsSechma);
