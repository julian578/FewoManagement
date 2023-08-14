import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';


//generate jwt token when user tries to log in
async function createToken(user) {

    try {
        return new Promise((resolve, reject) => {
            console.log(user)
            jwt.sign({user: user}, "secretkey", (err, token) => {
                if(err) {
                    console.log(err)
                    reject("wrong username or password");
                }
                else resolve(token)
            })
        })
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }

    

}


//verify jwt for every request
async function verifyToken(req, res, next) {

    
    
    try {
        const token = req.token
        jwt.verify(token, "secretkey", async (err, authData) => {
            if(err) {
                console.log(err);
                res.sendStatus(403);
            } else {

                
                req.token = token;

                const decoded = jwt.verify(token, "secretkey");
                

                const user = await UserModel.findOne({name: decoded.user.name});
                
                req.loggedInUser = user;
                console.log(req.loggedInUser)
                
                return next();  
            }
        })
    } catch(err) {
        console.log(err);
        res.sendStatus(403);
    }

}


//extract the jwt from request headers
async function extractToken(req, res, next) {
    try {
        const bearer = req.headers["authorization"];
        
        const token = bearer.substring(7);

        req.token = token;
        return next();
    } catch(err) {
        console.log(err);
        res.sendStatus(403);
    }
}

export {createToken, verifyToken, extractToken};