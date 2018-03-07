var mongoose=require("mongoose");
var usersSechma=require("../schemas/users");

module.exports=mongoose.model("User",usersSechma);
