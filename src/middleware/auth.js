const adminAuth=(req, res, next) => {
        var data='xyz';
        var isauthorised= data==='xyz';
        if(!isauthorised){
       res.status(401).send('Unauthorized access');
        }else{
            next();
        }
    }

    const userAuth=(req, res, next) => {
        var data='xyp';
        var isauthorised= data==='xyz';
        if(!isauthorised){
       res.status(401).send('Unauthorized access');
        }else{
            next();
        }
    }

module.exports={adminAuth,userAuth}