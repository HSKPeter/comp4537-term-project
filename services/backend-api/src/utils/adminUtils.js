const axios = require('axios');
const { AUTH_SERVER_ORIGIN } = require('../config');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');

const API_ENDPOINTS = {
  READ_ALL_FIELDS: `${AUTH_SERVER_ORIGIN}/readAllFields`,  // Assuming this endpoint is responsible for retrieving all fields from any table
  CREATE_ENTRY: `${AUTH_SERVER_ORIGIN}/createEntry`,      // Assuming this endpoint is responsible for creating an entry in any table
  UPDATE_ENTRY: `${AUTH_SERVER_ORIGIN}/updateEntry`,      // Assuming this endpoint is responsible for updating an entry in any table
  DELETE_ENTRY: `${AUTH_SERVER_ORIGIN}/deleteEntry`,      // Assuming this endpoint is responsible for deleting an entry in any table
};

async function readAllFields(tableName) {
  try {
    const response = await axios.get(`${API_ENDPOINTS.READ_ALL_FIELDS}/${tableName}`);
    return response.data;
  } catch (error) {
    console.error(SERVER_MESSAGES.failedToGetAllFields, error?.stack ?? error);
    throw new Error(SERVER_MESSAGES.failedToGetAllFields);
  }
}

async function createEntry(tableName, data) {
  try {
    const response = await axios.post(`${API_ENDPOINTS.CREATE_ENTRY}/${tableName}`, data);
    return response.data;
  } catch (error) {
    console.error(SERVER_MESSAGES.failedToCreateEntry, error?.stack ?? error);
    throw new Error(SERVER_MESSAGES.failedToCreateEntry);
  }
}

async function updateEntry(tableName, entryId, data) {
  try {
    const response = await axios.put(`${API_ENDPOINTS.UPDATE_ENTRY}/${tableName}/${entryId}`, data);
    return response.data;
  } catch (error) {
    console.error(SERVER_MESSAGES.failedToUpdateEntry, error?.stack ?? error);
    throw new Error(SERVER_MESSAGES.failedToUpdateEntry);
  }
}

async function deleteEntry(tableName, entryId) {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.DELETE_ENTRY}/${tableName}/${entryId}`);
    return response.data;
  } catch (error) {
    console.error(SERVER_MESSAGES.failedToDeleteEntry, error?.stack ?? error);
    throw new Error(SERVER_MESSAGES.failedToDeleteEntry);
  }
}

module.exports = {
  readAllFields,
  createEntry,
  updateEntry,
  deleteEntry,
};
