import * as customerController from "./controllers/customerController";
import * as articleController from "./controllers/articleController";
import * as invoiceController from "./controllers/invoiceController";
import * as productController from "./controllers/productController";
import * as resourceController from "./controllers/resourceController";
import * as userController from "./controllers/userController";

import * as userService from "./services/userServices";
import * as sessionService from "./services/sessionServices";
import * as productService from "./services/productServices";
import * as articleService from "./services/articleServices";

import { Request, Response } from 'express';
let express = require('express')
let path = require('path');
let file_dir = path.join(__dirname, 'files');


module.exports = (app) => {
    
    //all needed get services without authentication
    app.get("/articles", articleService.loadArticles);
    app.get("/article/:id", articleController.getArticle);
    app.get("/products", productService.loadProducts);
    app.get("/product/:id", productController.getProduct);
    app.get("/resources", resourceController.getAllResources);
	app.get("/resource/:id", resourceController.getResource);

    //session services
    app.post("/login", sessionService.login) //login

    //file download - ToDo
    app.use("/files", express.static(file_dir));

    //activate when making a new account and disable afterwards
    //app.put("/register", userService.register);
    
    //authenticat request (req.header.authorization)
    app.all('/*', async (req: Request, res: Response, next) => {
        try{
            //validates requests, refreshs token and handles next, stops when invalid request
            await sessionService.validate(req, res, next);
            return;
        } catch(error){
            //todo error handling
            console.log("catch", error)
            return;
        }
    });

    //all data routes

	//customer routes
	app.get("/customers", customerController.getAllCustomers);
    app.get("/customer/:id", customerController.getCustomer);
	app.put("/customer", customerController.addCustomer);
	app.delete("/customer/:id", customerController.deleteCustomer);
    app.post("/customer/:id", customerController.updateCustomer);
    app.get("/customer", customerController.getCustomerByParam);

	//article routes
	//app.get("/articles", articleService.loadArticles);
	//app.get("/article/:id", articleController.getArticle);
	app.put("/article", articleController.addArticle);
	app.delete("/article/:id", articleController.deleteArticle);
	app.post("/article/:id", articleController.updateArticle);

	//product routes
    //app.get("/products", productService.loadProducts);
	//app.get("/product/:id", productController.getProduct);
	app.put("/product", productController.addProduct);
	app.delete("/product/:id", productController.deleteProduct);
	app.post("/product/:id", productController.updateProduct);

	//invoice routes
	app.get("/invoices", invoiceController.getAllInvoices);
	app.get("/invoice/:id", invoiceController.getInvoice);
	app.put("/invoice", invoiceController.addInvoice);
	app.delete("/invoice/:id", invoiceController.deleteInvoice);
	app.post("/invoice/:id", invoiceController.updateInvoice);

	//resource routes
    //app.get("/resources", resourceController.getAllResources);
	//app.get("/resource/:id", resourceController.getResource);
	app.put("/resource", resourceController.addResource);
	app.delete("/resource/:id", resourceController.deleteResource);
    app.post("/resource/:id", resourceController.updateResource);

    //file upload
    app.post("/fileupload", resourceController.fileupload)
    //file download
    app.use("/files", express.static(file_dir));

    //Only admins have access
    app.all('/*', async (req: Request, res: Response, next) => {
        try{
            //validates requests, refreshs token and handles next, stops when invalid request
            await sessionService.validateAdmin(req, res, next);
            return;
        } catch(error){
            //todo error handling
            console.log("catch", error)
            return;
        }
    });

    //session services
    app.put("/register", userService.register); //register
    
    //user routes
	app.get("/users", userController.getAllUsers);
    app.get("/user/:id", userController.getUser);
    app.put("/user", userController.addUser);
	app.delete("/user/:id", userController.deleteUser);
	app.post("/user/:id", userController.updateUser);

}