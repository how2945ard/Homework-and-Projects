/*
please uncomment the code and modify
*/

module.exports = {
    cookieSecret: "cookieSecret",
    sessionSecret: "sessionSecret",
    emailSecret: "emailSecret",
    db: 'db',
    host: '128.199.225.72',
    port: 3000,
    session: {
        redis: {
            host: 'localhost',
            port: 6379
        }
    },
    base_url: 'http://localhost:3000',
    env_test: false,
    test: {
        session_disable: false
    },
    mongoose_debug: false,
    mongoUrl: 'mongodb://127.0.0.1/hackNTU',
    // mongoUrl: 'mongodb://128.199.225.72/hackNTU',
};