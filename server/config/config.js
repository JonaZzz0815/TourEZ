/*
 * @Date: 2024-05-27 13:56:12
 * @LastEditors: Qingjing Zhang
 * @LastEditTime: 2024-05-30 23:40:14
 * @FilePath: /TourEZ/server/config/config.js
 */
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10, // Adjust based on your application's needs
        host: 'cis550-finalproject.cxqo2gqqoqpu.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: '6AA.5hfCJJrt_F7fL7Us',
        database: 'FINAL_PROJECT',
        port:3306
});

const executeQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, data) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const closeDBConnection = () => {
    pool.end(err => {
        if (err) console.error('Error closing pool:', err.stack);
    });
};


module.exports = {
    executeQuery,
    closeDBConnection
};


