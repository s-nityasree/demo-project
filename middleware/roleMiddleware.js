function authorizeRoles(...allowedRoles) {

    return (req, res, next) => {

        // req.user comes from authMiddleware
        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });

        }

        next();

    };

}

module.exports = authorizeRoles;