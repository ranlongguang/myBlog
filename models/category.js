var mongoose=require("mongoose");
var categoriesSechma=require("../schemas/categories");

module.exports=mongoose.model("Category",categoriesSechma);
