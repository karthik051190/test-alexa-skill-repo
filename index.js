'use strict';

const AWS = require('aws-sdk');
const mysql = require('mysql');

const ErrorFunction = require("./error");
const logger = require("./logger");

exports.handler = (event, context, callback) => {
  // var input = event["queryStringParameters"];
  let input = JSON.parse(event.body);
  //input validation
  // if (input.cityId && input.notification) {
    let db_name = process.env.db_name;
    let db_host = process.env.db_host;
    let db_user = process.env.db_username;
    let db_pwd = process.env.db_password;
    let region = process.env.region;
    AWS.config.update({
      region: region
    });
    // environment variables validation
    if (db_name && db_host && db_user && db_pwd) {
      try { // check for mysql connection error
        let connection = mysql.createConnection({
          host: db_host,
          user: db_user,
          password: db_pwd,
          database: db_name
        });
        getResponse(200, {}, rejectedResponse, false, function(successResponse) {
        callback(null, successResponse); });
      } catch (e) {
        console.error("MySQL connection error: ", e);
        getResponse(500, {}, new ErrorFunction("ConnectionError", "MySQL connection initiation error"), false, function(errResponse) {
          callback(null, errResponse);
        });
      }
    } else {
      console.error("Required Environment variables not set");
      getResponse(404, {}, new ErrorFunction("ClientError", "Required environment variables not set"), false, function(errResponse) {
        callback(null, errResponse);
      });
    }
  // } else {
  //   console.error("Required input not passed: ", event);
  //   getResponse(400, {}, new ErrorFunction("InputError", "Required input not passed"), false, function(errResponse) {
  //     callback(null, errResponse);
  //   });
  // }
};


function getResponse(statusCode, headers, body, isBase64Encoded, callback) {
  headers["Access-Control-Allow-Origin"] = "*";
  let responseMsg = {
    "statusCode": statusCode,
    "headers": headers,
    "body": JSON.stringify(body),
    "isBase64Encoded": isBase64Encoded
  };
  if (statusCode == 200) {
    console.info("Response Message: ", responseMsg);
  } else {
    console.error("Response Message: ", responseMsg);
  }
  callback(responseMsg);
}
