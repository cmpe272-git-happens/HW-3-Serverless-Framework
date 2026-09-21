"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/api/users/index.ts
var users_exports = {};
__export(users_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(users_exports);
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var import_crypto = require("crypto");
var USERS_TABLE = process.env.USERS_TABLE || "";
var dynamoDb = new import_client_dynamodb.DynamoDBClient({});
var documentClient = import_lib_dynamodb.DynamoDBDocumentClient.from(dynamoDb);
var handler = (event, context) => {
  let response;
  switch (`${event.httpMethod} ${event.resource}`) {
    case "POST /users" /* CREATE_USER */:
      response = createUser(event);
      break;
    case "DELETE /users/{userid}" /* DELETE_USER */:
      response = deleteUser(event);
      break;
    case "GET /users/{userid}" /* GET_USER */:
      response = getUser(event);
      break;
    case "GET /users" /* GET_USERS */:
      response = getUsers();
      break;
    case "PUT /users/{userid}" /* UPDATE_USER */:
      response = updateUser(event);
      break;
    default:
      response = Promise.resolve({
        statusCode: 400,
        headers: { ...defaultHeaders },
        body: JSON.stringify({
          message: "Unsupported route"
        })
      });
      break;
  }
  return response.catch((error) => {
    console.log(error);
    return {
      statusCode: 400,
      headers: { ...defaultHeaders },
      body: JSON.stringify({ "Error": error })
    };
  });
};
var defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
var createUser = (event) => {
  const body = JSON.parse(event.body || "{}");
  body["timestamp"] = (/* @__PURE__ */ new Date()).toISOString();
  body["userid"] = (0, import_crypto.randomUUID)();
  return documentClient.send(new import_lib_dynamodb.PutCommand({
    TableName: USERS_TABLE,
    Item: {
      ...body
    }
  })).then(() => {
    return {
      statusCode: 201,
      headers: { ...defaultHeaders },
      body: JSON.stringify(body)
    };
  });
};
var deleteUser = (event) => {
  const { userid } = event.pathParameters || {};
  return documentClient.send(new import_lib_dynamodb.DeleteCommand({
    TableName: USERS_TABLE,
    Key: {
      "userid": userid
    }
  })).then(() => {
    return {
      statusCode: 200,
      headers: { ...defaultHeaders },
      body: JSON.stringify({})
    };
  });
};
var getUser = (event) => {
  const { userid } = event.pathParameters || {};
  return documentClient.send(new import_lib_dynamodb.GetCommand({
    TableName: USERS_TABLE,
    Key: {
      "userid": userid
    }
  })).then((data) => {
    return {
      statusCode: 200,
      headers: { ...defaultHeaders },
      body: JSON.stringify(data.Item || {})
    };
  });
};
var getUsers = () => {
  return documentClient.send(new import_lib_dynamodb.ScanCommand({
    TableName: USERS_TABLE,
    Select: "ALL_ATTRIBUTES"
  })).then((data) => {
    return {
      statusCode: 200,
      headers: { ...defaultHeaders },
      body: JSON.stringify(data.Items)
    };
  });
};
var updateUser = (event) => {
  const { userid } = event.pathParameters || {};
  const body = JSON.parse(event.body || "{}");
  body["timestamp"] = (/* @__PURE__ */ new Date()).toISOString();
  body["userid"] = userid;
  return documentClient.send(new import_lib_dynamodb.PutCommand({
    TableName: USERS_TABLE,
    Item: {
      ...body
    }
  })).then(() => {
    return {
      statusCode: 200,
      headers: { ...defaultHeaders },
      body: JSON.stringify(body)
    };
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
