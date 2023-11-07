export const setting = {
    MONGO_URI: process.env.MONGO_URL || "mongodb://localhost:27017",
    JWT_SECRET: process.env.JWT_SECRET || "123"
}