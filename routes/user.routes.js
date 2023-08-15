import express from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { createToken, extractToken, verifyToken } from '../security/jwtUtils.js';
import { checkAdminRole, checkAdvancedUserRole } from '../middlewares/UserMiddelwares.js';


const userRouter = express.Router();

//register new user
userRouter.post("/register", extractToken, verifyToken, checkAdminRole, async(req, res) => {
        
        var transmittedUser = req.body;
        transmittedUser.roles = ["USER"];
        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(transmittedUser.password, salt, async (err, hash) => {
                if(err)return res.sendStatus(500);
                transmittedUser.password = hash;
                try {
                    const user = new UserModel(transmittedUser);
                    console.log(user);
            
                    await user.save();
                    res.json(user);
                } catch(err) {
                    console.log(err);
                    res.sendStatus(400)
                }
                
            })
        })


})



//login as user
userRouter.post("/login", async(req, res) => {
    try {

        
        
        const user = await UserModel.find({name: req.body.name});
        

        await bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) return res.sendStatus(403);
            if(result) {
                createToken(user[0]).then((token) => {
                    
                    return res.json({"jwt": token})})
            }
            else return res.sendStatus(400)
            


        } )

    } catch(err) {
        res.sendStatus(403)
    }
})


//add role to user
userRouter.put("/addRole", extractToken, verifyToken, checkAdminRole, async(req, res) => {

    try {

        let user = await UserModel.findOne({name: req.body.name});

        if(user) {
            var roles = user.roles;
            console.log(roles);
            console.log(req.body.new_roles)
            req.body.new_roles.forEach(role => {
                if(roles.indexOf(role) === -1) {
                    roles.push(role);
                }
                
            });
    
            var new_user = {
                name: user.name,
                password: user.password,
                roles: roles
            }
    
    
            await user.updateOne(new_user);
    
            res.json(new_user);
        } else {
            console.log("not found")
            res.sendStatus(404);
        }
        

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});


userRouter.get("/hasRole/:role", extractToken, verifyToken, async(req, res) => {
    try {

        const user = req.loggedInUser;
        var response = false;
        if(user.roles.indexOf(req.params.role) !== -1) {
            
            response = true;
        } 

        res.json({hasRole: response});
        

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});



userRouter.get("/all", extractToken, verifyToken, checkAdminRole, async (req, res) => {
    const user = await UserModel.find();
    res.json(user)
})

//delete user by id
userRouter.delete("/delete/:_id", extractToken, verifyToken, checkAdminRole, async (req, res) => {
    try {
        await UserModel.deleteOne({_id:req.params._id})
        res.sendStatus(200)
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    } 
    
})

//delete user by name
userRouter.post("/deleteByName", extractToken, verifyToken, checkAdminRole, async(req, res) => {

    try {

        const user = await UserModel.findOne({
            name: req.body.name
        });
        if(user) {
            await UserModel.deleteOne({_id: user._id});
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
        
        
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

export{userRouter};



