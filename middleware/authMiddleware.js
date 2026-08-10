const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token is required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;
        console.log(req.user)

        next();

    } catch (error) {

        res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

}

// const authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({
//                 message: "Access denied"
//             });
//         }
//         next();
//     };
// };

module.exports = verifyToken;