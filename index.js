//FIXME - Problème d'importation des fonctions depuis un widget (voir avec import export )
//TODO - Faire une liste des fonctions disponible
const {
  findAdresse,
  getCommunes,
  getDataFromGouvFr,
} = require("./src/gouv/gouv_api");

const {
  _httpCallAuthenticated,
  _setDraggable,
  _setupTagger,
  _getPlatformServices,
  _getPlateformInfos,
  _setDroppable,
} = require("./src/plateform/main/3dexperience_api");

const {
  _3DSpace_get_docInfo,
  _3DSpace_csrf,
  _3DSpace_get_csrf,
  _3DSpace_file_url,
  _3DSpace_file_url_csr,
  _3DSpace_file_update,
  _3DSpace_file_update_csr,
  _3DSpace_Create_Doc,
  _3DSpace_get_securityContexts,
  _3DSpace_download_doc,
  _3DSpace_download_multidoc,
  _3DSpace_lifecycle_getNextStates,
  _3DSpace_lifecycle_changeState,
  _3DSpace_lifecycle_getGraph,
  _3DSpace_lifecycle_getNextRevision,
  _3DSpace_lifecycle_changeRevision,
} = require("./src/plateform/main/3dspace_api");

const {
  getDownloadDocument,
} = require("./src/plateform/main/getDownloadDocument");
const {
  compass_getListAdditionalApps,
} = require("./src/plateform/Compass/index");
const {
  _3DSwym_get_currentUser,
  _3DSwym_get_findUser,
} = require("./src/plateform/Swym/user/index");

const {
  _3DSwym_get_version,
  _3DSwym_getAllNews,
  _3DSwym_getFamiliarPeople,
} = require("./src/plateform/Swym/3dswym_api");

const { getActiveServices } = require("./src/plateform/main/getActiveServices");
const { getCSRFToken } = require("./src/plateform/main/getCSRFToken");
const { getAllContextSecurity } = require("./src/plateform/main/getCTX");
const {
  getDataFrom3DSpace,
} = require("./src/plateform/main/getDataFrom3DSpace");
const {
  get_3DSpace_csrf,
  getDatasByTenant,
  getDatasFrom3DSpace,
  dataMixing,
} = require("./src/plateform/main/loadDatas");

const { updateEvent } = require("./src/utils/updateEvent");
const { pushDataIn3DSpace } = require("./src/plateform/main/pushDataIn3DSpace");

const {
  _3DSwym_postIdea,
  _3DSwym_deleteIdea,
  _3DSwym_getSWYMIdea,
  _3DSwym_get_AllSWYMIdeas,
} = require("./src/plateform/Swym/idea/index");

const {
  _3DSwim_getAllCommunities,
  _3DSwim_getMembersCommunity,
  _3DSwym_getIdeaStatusMaturity,
  _3DSwym_buildDirectMessage,
} = require("./src/plateform/Swym/communaute/index");
const {
  addTagToDoc,
  removeTagToDoc,
  getInfoDocTags,
} = require("./src/plateform/Tag/index");
const {
  createUserGroups,
  getComplementUG,
  getUsersGroupRules,
  getUserGroupsList,
  deleteUserGroups,
  patchUserGroups,
  patchUserGroupsControl,
  readUserGroupControl,
} = require("./src/plateform/Usersgroup/index");

// module.exports = {
//   findAdresse,
//   getCommunes,
//   getDataFromGouvFr,
//   _httpCallAuthenticated,
//   _setDraggable,
//   _setupTagger,
//   _setDroppable,
//   _getPlateformInfos,
//   _getPlatformServices,
//   _3DSpace_get_docInfo,
//   _3DSpace_csrf,
//   _3DSpace_get_csrf,
//   _3DSpace_file_url,
//   _3DSpace_file_url_csr,
//   _3DSpace_file_update,
//   _3DSpace_file_update_csr,
//   _3DSpace_Create_Doc,
//   _3DSpace_get_securityContexts,
//   _3DSpace_download_doc,
//   _3DSpace_download_multidoc,
//   _3DSpace_lifecycle_getNextStates,
//   _3DSpace_lifecycle_changeState,
//   _3DSpace_lifecycle_getGraph,
//   _3DSpace_lifecycle_getNextRevision,
//   _3DSpace_lifecycle_changeRevision,
//   getDownloadDocument,
//   compass_getListAdditionalApps,
//   _3DSwym_get_version,
//   _3DSwym_getAllNews,
//   _3DSwym_getFamiliarPeople,
//   _3DSwym_get_currentUser,
//   _3DSwym_get_findUser,
//   getActiveServices,
//   getCSRFToken,
//   getAllContextSecurity,
//   getDataFrom3DSpace,
//   get_3DSpace_csrf,
//   getDatasByTenant,
//   getDatasFrom3DSpace,
//   dataMixing,
//   pushDataIn3DSpace,
//   updateEvent,
//   _3DSwym_postIdea,
//   _3DSwym_deleteIdea,
//   _3DSwym_getSWYMIdea,
//   _3DSwym_get_AllSWYMIdeas,
//   _3DSwim_getAllCommunities,
//   _3DSwim_getMembersCommunity,
//   _3DSwym_getIdeaStatusMaturity,
//   _3DSwym_buildDirectMessage,
//   addTagToDoc,
//   removeTagToDoc,
//   getInfoDocTags,
//   createUserGroups,
//   getComplementUG,
//   getUsersGroupRules,
//   getUserGroupsList,
//   deleteUserGroups,
//   patchUserGroups,
//   patchUserGroupsControl,
//   readUserGroupControl,
// };
export default {
  findAdresse,
  getCommunes,
  getDataFromGouvFr,
  _httpCallAuthenticated,
  _setDraggable,
  _setupTagger,
  _getPlatformServices,
  _getPlateformInfos,
  _setDroppable,
};
