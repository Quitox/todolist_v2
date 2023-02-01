
// const express = require("express");
import express from "express";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";
// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const { render } = require("ejs");
import {render} from "ejs";
// const UQ = require(__dirname + "/Utilities_Quito.js");
// const utilidades = __dirname + "/Utilities_Quito.js"
import {firstLetterUp} from "./Utilities_Quito.js";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const firstLetterUp = (word) => {
//   return word.length !== 0
//     ? word.substring(0, 1).toUpperCase() +
//         word.substring(1, word.length).toLowerCase()
//     : "";
// };

mongoose.set("strictQuery", false);
const db = "todolistDB";
const user = "admin_Esteban";
const pwss = "UFoKeO2JYi74oQKJ";
const serverPathAtlas = `mongodb+srv://${user}:${pwss}@cluster0.wuect6a.mongodb.net/${db}?retryWrites=true&w=majority`;

const serverPathLocal = "mongodb://127.0.0.1:27017/";

let actualDB = "";
let infoConn;
mongoose.connect(serverPathAtlas, function (err, connected) {
  if (err) return console.log(err);
  else {
    infoConn = connected;
    actualDB = "Atlas";
    console.log("Success"); // Almacena toda la información de la conección. A tener cuidado.
  }
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

// const Item = mongoose.model.Items || mongoose.model("Item", itemsSchema);
const Item = mongoose.model("Item", itemsSchema);

// console.log(mongoose.Collection())

const itemA = new Item({
  name: "Welcome to your ToDoList!",
});
const itemB = new Item({
  name: "Hit the + button to add a new item.",
});
const itemC = new Item({
  name: "<-- Hit this to delete a item.",
});
const defaultItems = [itemA, itemB, itemC];

// Item.insertMany(defaultItems);

// You can use a Model to create new documents using `new`:
// const Item0 = new Item({ name: "Faa" });
// console.log(Item0);
// Item0.save();

const listSchema = mongoose.Schema({
  name: String,
  items: [itemsSchema],
});
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (err) return console.log("Error en la busqueda de Items: " + err);
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err, docs) {
        if (err) console.log("Error en la inserción de documentos: " + err);
        else {
          // console.log(docs);
          res.redirect("/");
        }
      });
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems,
        actualDB,
      });
    }
    // console.log(foundItems);
  });
});

app.post("/", function (req, res) {
  const listName = firstLetterUp(req.body.list);
  const itemName = firstLetterUp(req.body.newItem);

  const document = new Item({ name: itemName });

  if (listName === "Today") {
    document.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      if (!err) {
        if (foundList) {
          foundList.items.push(document);
          foundList.save();
          res.redirect(`/${listName}`);
        }
      }
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = firstLetterUp(req.body.list);

  if (listName === "Today") {
    // Item.deleteOne({"_id": checkedItemId}, function(err, doc){
    //   if (err) console.log("Error en la inserción de documentos: " + err);
    //   else {
    //     console.log(doc);
    //     res.redirect("/");
    //   }
    // });
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Exito en la eliminación del documento.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err) {
        if (!err) res.redirect(`/${listName}`);
      }
    );
  }
});

app.get("/about", function (req, res) {
  res.render("about", { actualDB });
});

app.get("/:listName", function (req, res) {
  const FormatedListName = firstLetterUp(req.params.listName);

  List.findOne({ name: FormatedListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //en caso de no existir la lista, la crea.
        const list = new List({
          name: FormatedListName,
          items: defaultItems,
        });
        list.save(); // guarda la lista
        res.redirect(`/${FormatedListName}`);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
          actualDB,
        });
      }
    } else {
      console.log("Ha ocurrido un error en la carga de la Lista.\n" + err);
    }
  });
});

app.post("/origin", function (req, res) {
  const origin = req.body.database;
  async function changeServer(origin) {
    await mongoose.connection.close();
    if (origin === "atlas") {
      await mongoose.connect(serverPathAtlas, function (err, connected) {
        if (err) return console.log(err);
        else {
          infoConn = connected;
          // collections_info = connected.collections; // Almacena toda la información de la conección. A tener cuidado.
          console.log("Success");
          actualDB = "Atlas";
          res.redirect("/");
        }
      });
    } else if (origin === "local") {
      await mongoose.connect(serverPathLocal, function (err, connected) {
        if (err) return console.log(err);
        else {
          infoConn = connected;
          // collections_info = connected.collections; // Almacena toda la información de la conección. A tener cuidado.
          console.log("Success");
          actualDB = "LocalHost";
          res.redirect("/");
        }
      });
    } else {
      console.log("Ha ocurrido un error en la selecion");
      res.redirect("/about");
      return;
    }
  }

  changeServer(origin);
});

const puerto = process.env.PORT || 3000;

app.listen(puerto, function () {
  console.log("Server started on port "+puerto);
  console.log("http://localhost:"+puerto);
});
