import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ message: "Access Denied: No Cookie" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (err) { 
    res.clearCookie('token'); 
    res.status(401).json({ message: "Invalid Token" }); 
  }
};

export default auth;