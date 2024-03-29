import {
  UUID
} from "./lib/api/index";
import {
  couleurs
} from "./lib/gouv/colors";
import {
  findAdresse,
  getCommunes,
  getDataFromGouvFr,
} from "./lib/gouv/gouv_api";
import {
  updateEvent
} from "./lib/utils/updateEvent";
import {
  compass_getListAdditionalApps
} from "./lib/plateform/Compass";
import {
  _setDraggable,
  _setDroppable,
  _getServiceUrl,
  _getPlatformServices,
  _getServiceUrl_3DPassport,
  _getPlateformInfos,
  _httpCallAuthenticated,
  _setupTagger,
} from "./lib/plateform/main/3dexperience_api";
import {
  _AppMngt_get_users,
  _AppMngt_get_info_user,
} from "./lib/plateform/main/3dcompass_api";
import {
  createUserGroups,
  getComplementUG,
  getUsersGroupRules,
  getUserGroupsList,
  deleteUserGroups,
  patchUserGroups,
  patchUserGroupsControl,
  readUserGroupControl,
} from "./lib/plateform/Usersgroup";
import {
  _3DSpace_get_docInfo,
  _3DSpace_get_csrf,
  _3DSpace_csrf,
  _3DSpace_get_ticket,
  _3DSpace_file_url_csr,
  _3DSpace_file_update,
  _3DSpace_file_update_csr,
  _3DSpace_Create_Doc,
  _3DSpace_get_securityContexts,
  _3DSpace_download_doc,
  _3DSpace_download_multidoc,
  _3DSpace_get_downloadTicket_multidoc,
  _3DSpace_lifecycle_getNextStates,
  _3DSpace_lifecycle_changeState,
  _3DSpace_lifecycle_getGraph,
  _3DSpace_lifecycle_getNextRevision,
  _3DSpace_lifecycle_changeRevision,
  _3DSpace_bookmark_addSubsciptions,
  _3DSpace_findUsersGroup
} from "./lib/plateform/main/3dspace_api";

import {
  getCSRFToken
} from "./lib/plateform/main/getCSRFToken";
import {
  getAllContextSecurity
} from "./lib/plateform/main/getCTX";
import {
  getDataFrom3DSpace
} from "./lib/plateform/main/getDataFrom3DSpace";
import {
  getDownloadDocument
} from "./lib/plateform/main/getDownloadDocument";
import {
  pushDataIn3DSpace
} from "./lib/plateform/main/pushDataIn3DSpace";
import {
  getDatasFrom3DSpace,
  dataMixing,
  getDatasByTenant,
  get_3DSpace_csrf,
} from "./lib/plateform/main/loadDatas";
import {
  getInfoDocTags,
  removeTagToDoc,
  addTagToDoc,
} from "./lib/plateform/Tag";
import {
  _3DSwym_getAllCommunities,
  _3DSwym_getMembersCommunity,
  _3DSwym_getIdeaStatusMaturity,
  _3DSwym_buildDirectMessage,
  _3DSwym_findCommunityToInstantMSG,
  _3DSwym_sendMessageData,
} from "./lib/plateform/Swym/communauty";
import {
  _3DSwym_postIdea,
  _3DSwym_deleteIdea,
  _3DSwym_getSWYMIdea,
  _3DSwym_get_AllSWYMIdeas,
} from "./lib/plateform/Swym/idea";
import {
  _3DSwym_get_currentUser,
  _3DSwym_get_findUser,
} from "./lib/plateform/Swym/user";
import {
  _3DSwym_get_version,
  _3DSwym_getAllNews,
  _3DSwym_getFamiliarPeople,
} from "./lib/plateform/Swym/3dswym_api";
import {
  _Iterop_Auth_CAS,
  _getServiceUrl_Iterop,
  _Iterop_ListUsers
} from "./lib/plateform/main/iterop_apiv2";

import {
  sayHello
} from "./lib/add/index"; //Pour tester de la librairie

import {
  _3DSearch_usersGroup
} from "./lib/plateform/Search/index"

export {
  _3DSpace_Create_Doc,
  _3DSpace_csrf,
  _3DSpace_download_doc,
  _3DSpace_download_multidoc,
  _3DSpace_file_update_csr,
  _3DSpace_file_update,
  _3DSpace_file_url_csr,
  _3DSpace_get_ticket,
  _3DSpace_get_csrf,
  _3DSpace_get_docInfo,
  _3DSpace_get_downloadTicket_multidoc,
  _3DSpace_get_securityContexts,
  _3DSpace_lifecycle_changeRevision,
  _3DSpace_lifecycle_changeState,
  _3DSpace_lifecycle_getGraph,
  _3DSpace_lifecycle_getNextRevision,
  _3DSpace_lifecycle_getNextStates,
  _3DSpace_bookmark_addSubsciptions,
  _3DSearch_usersGroup,
  _3DSwym_getAllCommunities,
  _3DSwym_getMembersCommunity,
  _3DSwym_buildDirectMessage,
  _3DSwym_deleteIdea,
  _3DSwym_findCommunityToInstantMSG,
  _3DSwym_get_AllSWYMIdeas,
  _3DSwym_get_currentUser,
  _3DSwym_get_findUser,
  _3DSwym_get_version,
  _3DSwym_getAllNews,
  _3DSwym_getFamiliarPeople,
  _3DSwym_getIdeaStatusMaturity,
  _3DSwym_getSWYMIdea,
  _3DSwym_postIdea,
  _3DSwym_sendMessageData,
  _getServiceUrl_Iterop,
  _Iterop_Auth_CAS,
  _Iterop_ListUsers,
  _AppMngt_get_info_user,
  _AppMngt_get_users,
  _getPlateformInfos,
  _getServiceUrl,
  _getPlatformServices,
  _getServiceUrl_3DPassport,
  _httpCallAuthenticated,
  _setDraggable,
  _setDroppable,
  _setupTagger,
  addTagToDoc,
  compass_getListAdditionalApps,
  couleurs,
  createUserGroups,
  dataMixing,
  deleteUserGroups,
  findAdresse,
  get_3DSpace_csrf,
  getAllContextSecurity,
  getCommunes,
  getComplementUG,
  getCSRFToken,
  getDataFrom3DSpace,
  getDataFromGouvFr,
  getDatasByTenant,
  getDatasFrom3DSpace,
  getDownloadDocument,
  getInfoDocTags,
  getUserGroupsList,
  getUsersGroupRules,
  patchUserGroups,
  patchUserGroupsControl,
  pushDataIn3DSpace,
  readUserGroupControl,
  removeTagToDoc,
  sayHello, // fonction de test
  updateEvent,
  UUID,
};