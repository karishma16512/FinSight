const dns = require("dns");
const mongoose = require("mongoose");

const configuredDnsServers = process.env.MONGO_DNS_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

if (configuredDnsServers?.length) {
    dns.setServers(configuredDnsServers);
} else if (dns.getServers().every((server) => server === "127.0.0.1" || server === "::1")) {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing. Add your MongoDB connection string to backend/.env.");
    }

    console.log("Attempting MongoDB connection...");
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    });
    console.log("MongoDB Connected Successfully!");
};

module.exports = connectDB;