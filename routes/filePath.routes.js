import express from "express";
import { extractToken, verifyToken } from "../security/jwtUtils.js";

import { checkAdminRole } from "../middlewares/UserMiddelwares.js";
import FilePathModel from "../models/FilePath.js";

const filePathRouter = express.Router();

//set a path; if the subject already exists, only the path will be updated
filePathRouter.post("/setPath", extractToken, verifyToken, checkAdminRole, async(req, res) => {


    try {

        const subject = req.body.subject;

        
        const filePath = await FilePathModel.findOne({subject: subject});


        if(filePath) {
            await filePath.updateOne(req.body);
        } else {
            const filePath = new FilePathModel(req.body);
            await filePath.save();
        }

        res.sendStatus(200);

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

//get all filpath objects
filePathRouter.get("/", extractToken, verifyToken, async(req, res) => {
    try{

        const filePaths = await FilePathModel.find();
        res.json(filePaths);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }

})

//get path object by subject
filePathRouter.get("/:subject", extractToken, verifyToken, async(req, res) => {
    try {

        const filePath = await FilePathModel.findOne({subject: req.params.subject});
        if(filePath)res.json(filePath);
        else res.json({});
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
})


export default filePathRouter;