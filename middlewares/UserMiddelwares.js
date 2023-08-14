async function checkAdminRole(req, res, next) {
    try {
        const user = req.loggedInUser;
        console.log(user)

        if(user.roles.indexOf("ADMIN") === -1) {
            
            res.json({hasRole: false});
        } else {
            return next();
        }
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function checkAdvancedUserRole(req, res, next) {
    try {

        const user = req.loggedInUser;
        console.log(user)

        if(user.roles.indexOf("ADVANCED_USER") === -1) {
            
            res.json({hasRole: false});
        } else {
            return next();
        }

        

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export {checkAdminRole, checkAdvancedUserRole};