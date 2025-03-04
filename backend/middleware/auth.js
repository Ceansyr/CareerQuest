export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            error: {
                message: "Authorization token is missing",
                status: 401
            }
        });
    }
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: {
                message: "Invalid Authorization token",
                status: 401
            }
        });
    }
};