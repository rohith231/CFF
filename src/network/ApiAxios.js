import axios from "axios";
import checkIfSessionActive from "commonFunctions/checkIfSessionActive";
import config from "../config";

// const https = require('https');
//
// const agent = new https.Agent({
//     rejectUnauthorized: false,
// });

const instance = axios.create({
  baseURL: config.WS_BASE_URL,
});

instance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? token : "";
  config.headers.ContentType = "application/json";
  return config;
});

//users API
export const getAllWithRole = async () => await instance.get("/users");

export const getDbUsersWithRole = async () => {
  const res = await instance.get("users/dbusers");
  return checkIfSessionActive(res);
};

export const getDbUsersWithRoleByClient = async (clientId) => {
  const res = await instance.get(`users/dbusers/${clientId}`);
  return checkIfSessionActive(res);
};

export const getAllByRole = async (roleId) => {
  const res = await instance.get(`users/${roleId}`);
  return checkIfSessionActive(res);
};

export const register = async (userDetails) => {
  const res = await instance.post("users/register", userDetails);
  return checkIfSessionActive(res);
};

export const confirmRegister = async (id) => {
  const res = await instance.post(`users/confirm/${id}`);
  return checkIfSessionActive(res);
};

export const forgotPassword = async (email) => {
  const res = await instance.post("users/forgotpassword", { email });
  return checkIfSessionActive(res);
};

export const confirmReset = async ({ id, password }) => {
  const res = await instance.post(`users/resetpass/${id}`, { password });
  return checkIfSessionActive(res);
};
export const login = async (userCreds) => {
  const res = await instance.post("users/login", userCreds);
  return checkIfSessionActive(res);
};
export const logout = async (token) => {
  const res = await instance.post("users/logout", { token });
  return checkIfSessionActive(res);
};
export const edit = async (userDetails) => {
  const res = await instance.put("/users", userDetails);
  return checkIfSessionActive(res);
};
export const deleteUser = async (userId) => {
  const res = await instance.delete(`/users/${userId}`);
  return checkIfSessionActive(res);
};

//rolesAPI

export const getRoleById = async (roleId) => {
  const res = await instance.get(`/roles/${roleId}`);
  return checkIfSessionActive(res);
};

export const editRoleById = async ({ roleId, roleName }) => {
  const res = await instance.put(`/roles/${roleId}`, { roleName });
  return checkIfSessionActive(res);
};

export const getAllRoles = async () => {
  const res = await instance.get("/roles");
  return checkIfSessionActive(res);
};

export const getDbRoles = async () => {
  const res = await instance.get("/roles/dbroles");
  return checkIfSessionActive(res);
};

export const getDbRolesByClient = async (clientId) => {
  const res = await instance.get(`/roles/dbroles/${clientId}`);
  return checkIfSessionActive(res);
};

export const createNewRole = async ({ roleName, clientId }) => {
  const res = await instance.post("/roles", { roleName, clientId });
  return checkIfSessionActive(res);
};

export const deleteRole = async (roleId) => {
  const res = await instance.delete(`/roles/${roleId}`);
  return checkIfSessionActive(res);
};

//teams API
export const getAllTeams = async () => {
  const res = await instance.get("/teams");
  return checkIfSessionActive(res);
};

export const getAllTeamsByClient = async (clientId) => {
  const res = await instance.get(`/teams/teamClient/${clientId}`);
  return checkIfSessionActive(res);
};

export const createNewTeam = async ({ teamName, userIds, clientId }) => {
  const res = await instance.post("/teams", {
    teamName,
    userIds,
    clientId,
  });
  return checkIfSessionActive(res);
};

export const editTeamById = async ({ teamId, teamName, userIds, clientId }) => {
  const res = await instance.put(`/teams/${teamId}`, {
    teamName,
    userIds,
    clientId,
  });
  return checkIfSessionActive(res);
};

export const deleteTeam = async (teamId) => {
  const res = await instance.delete(`/teams/${teamId}`);
  return checkIfSessionActive(res);
};

export const getUserTeamById = async (teamId) => {
  const res = await instance.get(`/teams/${teamId}`);
  return checkIfSessionActive(res);
};

//functionality API
export const getAllFunctionalities = async () => {
  const res = await instance.get(`/functionalities`);
  return checkIfSessionActive(res);
};

export const getAllFuncsFuncgroups = async () => {
  const res = await instance.get(`/functionalities/funcsfuncgroups`);
  return checkIfSessionActive(res);
};

export const createNewFunctionality = async ({
  funcName,
  funcLabel,
  sectorId,
}) => {
  const res = await instance.post("/functionalities", {
    funcName,
    funcLabel,
    sectorId,
  });
  return checkIfSessionActive(res);
};

export const createNewGroupFunctionality = async ({
  groupName,
  funcNames,
  sectorId,
}) => {
  const res = await instance.post("/functionalities/group", {
    groupName,
    funcNames,
    sectorId,
  });
  return checkIfSessionActive(res);
};

export const setRoleFunctionalities = async ({ roleId, funcIds }) => {
  const res = await instance.post("/functionalities/setfunc", {
    roleId,
    funcIds,
  });
  return checkIfSessionActive(res);
};

export const deleteFunctionality = async (funcId) => {
  const res = await instance.delete(`/functionalities/${funcId}`);
  return checkIfSessionActive(res);
};

export const getFuncWithSectorId = async () => {
  const res = await instance.get(`/functionalities/funcWithSecId`);
  return checkIfSessionActive(res);
};

export const getFuncFuncgroupsWithSectorId = async () => {
  const res = await instance.get(`/functionalities/funcFuncgroupsWithSecId`);
  return checkIfSessionActive(res);
};

export const getFuncWithRoleId = async () => {
  const res = await instance.get(`/functionalities/funcWithRoleId`);
  return checkIfSessionActive(res);
};

export const getFuncByRoleId = async (roleId) => {
  const res = await instance.get(`/functionalities/${roleId}`);
  return checkIfSessionActive(res);
};

export const getFuncsFuncgroupsByRoleId = async (roleId) => {
  const res = await instance.get(`/functionalities/funcsfuncgroups/${roleId}`);
  return checkIfSessionActive(res);
};

export const getFuncFuncgroupsBySectorId = async (clientId) => {
  const res = await instance.get(
    `/functionalities/funcFuncgroupsBySecId/${clientId}`
  );
  return checkIfSessionActive(res);
};

export const getFuncsByFuncgroupId = async (funcgroupId) => {
  const res = await instance.get(
    `/functionalities/funcsByFuncgroupId/${funcgroupId}`
  );
  return checkIfSessionActive(res);
};

export const editFunctionalitiesWithSectorId = async ({
  funcName,
  funcLabel,
  sectorId,
  funcId,
}) => {
  const res = await instance.put("/functionalities/funcWithSecId", {
    funcName,
    funcLabel,
    sectorId,
    funcId,
  });
  return checkIfSessionActive(res);
};

export const editFuncFuncgroupsWithSectorId = async ({
  groupName,
  funcNames,
  sectorId,
  groupId,
}) => {
  const res = await instance.put("/functionalities/funcFuncgroupsWithSecId", {
    groupName,
    funcNames,
    sectorId,
    groupId,
  });
  return checkIfSessionActive(res);
};

//sectors API
export const getAllSectors = async () => {
  const res = await instance.get("/sectors");
  return checkIfSessionActive(res);
};

export const editSectorById = async ({ sectorId, sectorName, sectorCode }) => {
  const res = await instance.put(`/sectors/${sectorId}`, {
    sectorName,
    sectorCode,
  });
  return checkIfSessionActive(res);
};

export const createNewSector = async ({ sectorName, sectorCode }) => {
  const res = await instance.post("/sectors", { sectorName, sectorCode });
  return checkIfSessionActive(res);
};

export const deleteSector = async (sectorId) => {
  const res = await instance.delete(`/sectors/${sectorId}`);
  return checkIfSessionActive(res);
};

//clients API
export const getAllClients = async () => {
  const res = await instance.get("/clients");
  return checkIfSessionActive(res);
};

export const editClientById = async ({ clientId, clientName, sectorId }) => {
  const res = await instance.put(`/clients/${clientId}`, {
    clientName,
    sectorId,
  });
  return checkIfSessionActive(res);
};

export const getBanner = async (clientId) => {
  const res = await instance.get(`/clients/banner/${clientId}`);
  return checkIfSessionActive(res);
};

export const getAllClientsWithSector = async () => {
  const res = await instance.get("/clients/cliWithSec");
  return checkIfSessionActive(res);
};

export const createNewClient = async ({ clientName, sectorId }) => {
  const res = await instance.post("/clients/newCliAssSec", {
    clientName,
    sectorId,
  });
  return checkIfSessionActive(res);
};

export const updateBanner = async ({ clientId, banner }) => {
  const res = await instance.put(`/clients/banner/${clientId}`, banner);
  return checkIfSessionActive(res);
};

export const deleteClient = async (clientId) => {
  const res = await instance.delete(`/clients/${clientId}`);
  return checkIfSessionActive(res);
};

//webmap API
export const createNewWebmap = async (webmapDetails) => {
  const res = await instance.post("/webmaps", webmapDetails);
  return checkIfSessionActive(res);
};

export const getActiveWebmap = async (roleId) => {
  const res = await instance.get(`/webmaps/active/${roleId}`);
  return checkIfSessionActive(res);
};

//portal API
export const createNewPortal = async (portalDetails) => {
  const res = await instance.post("/portal", portalDetails);
  return checkIfSessionActive(res);
};

export const getActivePortal = async (roleId) => {
  const res = await instance.get(`/portal/active/${roleId}`);
  return checkIfSessionActive(res);
};

//test API
export const getExtData = async (webUrl) => {
  const res = await instance.get(webUrl);
  return checkIfSessionActive(res);
};

//charts API
export const createChart = async (chartDetails) => {
  const res = await instance.post("/charts", chartDetails);
  return checkIfSessionActive(res);
};

export const getChartsByRole = async (roleId) => {
  const res = await instance.get(`/charts/${roleId}`);
  return checkIfSessionActive(res);
};

export const getAllCharts = async () => {
  const res = await instance.get("/charts");
  return checkIfSessionActive(res);
};

export const setRoleCharts = async ({ roleId, chartIds }) => {
  const res = await instance.post("/charts/chartRole", { roleId, chartIds });
  return checkIfSessionActive(res);
};

//files API
export const fileUpload = async (files) => {
  const res = await instance.post("/files", files);
  return checkIfSessionActive(res);
};

export const getFilesByParent = async (parentId) => {
  const res = await instance.get(`/files/filesByParent/${parentId}`);
  return checkIfSessionActive(res);
};

export const dbUsersFileUpload = async ({ roleId, files }) => {
  const res = await instance.post(`/files/dbUsers/${roleId}`, files);
  return checkIfSessionActive(res);
};

//avatar API
export const updateDp = async ({ formData, userId }) => {
  const res = await instance.post(`/avatars/${userId}`, formData);
  return checkIfSessionActive(res);
};

export const getActiveAvatar = async (userId) => {
  const res = await instance.get(`/avatars/active/${userId}`);
  return checkIfSessionActive(res);
};

//folders API
export const getRootFolderByClient = async (clientId) => {
  const res = await instance.get(`/folders/root/${clientId}`);
  return checkIfSessionActive(res);
};

export const getFoldersByParent = async (folderId) => {
  const res = await instance.get(`/folders/foldbyParent/${folderId}`);
  return checkIfSessionActive(res);
};

export const createNewFolder = async ({ folderPath, parentId }) => {
  const res = await instance.post("/folders", { folderPath, parentId });
  return checkIfSessionActive(res);
};

export const createRootFolder = async (clientId) => {
  const res = await instance.post("/folders/root", { clientId });
  return checkIfSessionActive(res);
};

//expbuild_config API
export const getConfigByClient = async (clientId) => {
  const res = await instance.get(`/expbuild/configByClient/${clientId}`);
  return checkIfSessionActive(res);
};

export const createNewConfig = async ({ username, clientId }) => {
  const res = await instance.post("/expbuild", { username, clientId });
  return checkIfSessionActive(res);
};

export const getExperiencesByClient = async (clientId) => {
  const res = await instance.get(`/expbuild/expByClient/${clientId}`);
  return checkIfSessionActive(res);
};

export const setRoleExp = async ({ roleId, expId }) => {
  const res = await instance.post("/expbuild/roleExp", { roleId, expId });
  return checkIfSessionActive(res);
};

export const getExpByRole = async (roleId) => {
  const res = await instance.get(`/expbuild/roleExp/${roleId}`);
  return checkIfSessionActive(res);
};

//dataTableApproval API
export const getAllTables = async (dbName) => {
  const res = await instance.get(`/dataApproval/tables/${dbName}`);
  return checkIfSessionActive(res);
};

export const getAllCols = async (dbName, tableName) => {
  const res = await instance.get(
    `/dataApproval/columns/${dbName}/${tableName}`
  );
  return checkIfSessionActive(res);
};

export const createNewApproval = async ({ roleId, tables }) => {
  const res = await instance.post("/dataApproval", { roleId, tables });
  return checkIfSessionActive(res);
};

export const getApprovalByRoleId = async (roleId) => {
  const res = await instance.get(`/dataApproval/${roleId}`);
  return checkIfSessionActive(res);
};

export const deleteApprovalByRoleId = async (roleId) => {
  const res = await instance.delete(`/dataApproval/${roleId}`);
  return checkIfSessionActive(res);
};

export const InsertOrUpdateApproval = async ({ roleId, dbs }) => {
  const res = await instance.put("/dataApproval", { roleId, dbs });
  return checkIfSessionActive(res);
};

export const checkIfDataEntryRole = async (roleId) => {
  const res = await instance.get(`/dataApproval/exists/${roleId}`);
  return checkIfSessionActive(res);
};

export const getAlldbs = async () => {
  const res = await instance.get("/dataApproval/databases");
  return checkIfSessionActive(res);
};

// DataEntry API
export const selectQuery = async (roleId, dbName, tableName) => {
  const res = await instance.get(`/dataEntry/${roleId}/${dbName}/${tableName}`);
  return checkIfSessionActive(res);
};

//Layers API
export const InsertOrUpdateLayers = async ({ portalItems, roleId }) => {
  const res = await instance.put("/layers", {
    portalItems,
    roleId,
  });
  return checkIfSessionActive(res);
};

export const getLayersByRoleId = async (roleId) => {
  const res = await instance.get(`/layers/${roleId}`);
  return checkIfSessionActive(res);
};
