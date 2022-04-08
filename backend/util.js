import jwt from "jsonwebtoken"
export const generateToken=(user)=>{
    return jwt.sign(
        {
            _id:user._id,
            email:user.email,
            name:user.name,
            isAdmin:user.isAdmin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'30d',
        }
    )
}

export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    console.log("authorization12345",req.headers)
    if (authorization) {
      const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {  
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          console.log("is Authorized")
          next();
        }
      });
      
    } else {
      res.status(401).send({ message: 'No Token' });
    }
  };
  
  export const isAdmin = (req, res, next) => {
    console.log("is Admin")
    if (req.user && req.user.isAdmin) {
     
      next();
    } else {
      res.status(401).send({ message: 'Invalid Admin Token' });
    }
  };