const {
  findAdresse,
  getCommunes,
  getDataFromGouvFr,
} = require("../gouv/gouv_api");

const {
  _httpCallAuthenticated,
  _setDraggable,
  _setupTagger,
  _getPlatformServices,
  _setDroppable,
} = require("./main/3dexperience_api");

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
} = require("./main/3dspace_api");

const { getDownloadDocument } = require("./main/getDownloadDocument");
const { compass_getListAdditionalApps } = require("./Compass/index");
const {
  _3DSwym_get_currentUser,
  _3DSwym_get_findUser,
} = require("./Swym/user/index");

const {
  _3DSwym_get_version,
  _3DSwym_getAllNews,
  _3DSwym_getFamiliarPeople,
} = require("./Swym/3dswym_api");

const { getActiveServices } = require("./main/getActiveServices");
const { getCSRFToken } = require("./main/getCSRFToken");
const { getAllContextSecurity } = require("./main/getCTX");
const { getDataFrom3DSpace } = require("./main/getDataFrom3DSpace");
const {
  get_3DSpace_csrf,
  getDatasByTenant,
  getDatasFrom3DSpace,
  dataMixing,
} = require("./main/loadDatas");
import {
  _3dSwym_postIdea,
  _3dSwym_deleteIdea,
  _3DSwym_getSWYMIdea,
  _3DSwym_get_AllSWYMIdeas,
} from "@/plugins/Swym/idea";

import {
  _3dSwim_getAllCommunities,
  _3dSwim_getMembersCommunity,
  _3DSwym_getIdeaStatusMaturity,
  _3dSwym_buildDirectMessage,
} from "@/plugins/Swym/communaute";

import {
  addTagToDoc,
  getActualTagsOnDoc,
  removeTagToDoc,
  getInfoDoc,
} from "@/plugins/Tag";

import {
  createUserGroups,
  getComplementUG,
  getUsersGroupRules,
  getUserGroupsList,
  deleteUserGroups,
  patchUserGroups,
  patchUserGroupsControl,
  readUserGroupControl,
} from "@/plugins/Usersgroup";

import { pushDataIn3DSpace } from "./main/pushDataIn3DSpace";
import { updateEvent } from "./main/updateEvent";

export {
  findAdresse,
  getCommunes,
  getDataFromGouvFr,
  _httpCallAuthenticated,
  _setDraggable,
  _setupTagger,
  _setDroppable,
  _getPlatformServices,
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
  getDownloadDocument,
  compass_getListAdditionalApps,
  _3DSwym_get_version,
  _3DSwym_getAllNews,
  _3DSwym_getFamiliarPeople,
  _3DSwym_get_currentUser,
  _3DSwym_get_findUser,
  getActiveServices,
  getCSRFToken,
  getAllContextSecurity,
  getDataFrom3DSpace,
  get_3DSpace_csrf,
  getDatasByTenant,
  getDatasFrom3DSpace,
  dataMixing,
  // non fait
  pushDataIn3DSpace,
  updateEvent,
};
