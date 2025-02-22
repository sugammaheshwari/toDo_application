const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Not authorized, token missing" });
    }

    try {
        token = token.split(" ")[1]; // Remove "Bearer " prefix
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        res.status(401).json({ error: "Not authorized, token invalid" });
    }
};

module.exports = { protect };
