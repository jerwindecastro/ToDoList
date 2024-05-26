const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const _ = require('lodash');
// const date = require(__dirname + "/date");
const mongoose = require("mongoose");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({entexted: true}));
app.use(express.static("public"));
// let userToDO = ["Buy food","Cook food","Eat food"];
// let workItems = [];

mongoose.connect('mongodb+srv://admin-win:test123@cluster0.dxe08gd.mongodb.net/todolistDB');

const todolistSchema = new mongoose.Schema({
        taskName: String,
})
const Todolist = new mongoose.model("Task",todolistSchema);
const task1 = new Todolist({taskName: "Buy food",});
const task2 = new Todolist({taskName: "Cook food",});
const task3 = new Todolist({taskName: "Eat food",});
const defaultTask = [task1,task2,task3];

const listSchema = new mongoose.Schema({
    name: String,
    item: [todolistSchema]
})
const newList = new mongoose.model("list", listSchema);

app.get("/",function(req, res){
  Todolist.find()
  .then((taskList)=>{
      if(taskList.length === 0){
        Todolist.insertMany(defaultTask);
        res.redirect("/");
      }else{
        res.render("list", {Title: "Today", nextToDO: taskList});
      }
  })
  .catch((error)=>{
    console.log(error);   
})
})

app.get("/favicon.ico", (req,res)=>{
    return 'your faveicon'
})

app.get("/:customListName",function(req, res){
    const customListName =  _.capitalize(req.params.customListName);
    newList.findOne({name: customListName})
    .then((taskName)=>{
        console.log(taskName);
        if(!taskName){
            const newTask = new newList({
                name: customListName,
                item: defaultTask,
            });
            newTask.save();
            res.redirect("/" + customListName);
        }
        else{
            res.render("list", {Title: taskName.name, nextToDO: taskName.item});
        }
    })
    .catch((error)=>{
      console.log(error);   
  })

})

app.post("/",function(req,res){
    const item = req.body.addTodo;
    const listName = req.body.submit;
    var newTask = new Todolist({
        taskName: item,
    });
    if(listName === "Today"){
        newTask.save();
        res.redirect("/");
    }else{
        newList.findOne({name: listName})
        .then((foundList)=>{
         foundList.item.push(newTask);
         foundList.save();
         res.redirect("/" + listName);
        })
        .catch((error)=>{
            console.log(error);   
        })
    }
})

app.post("/delete",function(req,res){
    const deletedtaskID = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today"){
        Todolist.deleteOne({ _id: deletedtaskID}).exec();
        res.redirect("/");
    }else{
        newList.updateOne({name:listName},{$pull:{item:{_id:deletedtaskID}}}).exec();
        res.redirect("/" + listName);
    }

})

app.listen(3000, function(){
    console.log("Server is running on port 3000");
    
})