import { _httpCallAuthenticated } from "../../main/3dexperience_api";

export function _3DSwym_addComment(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  const {
    _3DSwym,
    _3DSwym_token,
    subjectUri,
    richMessage
  } = credentials;
  const url = `${_3DSwym}/commentproxy/subjects/${subjectUri}/comments`;
  const body = { richMessage };
  const headerOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Accept: "application/json",
      "X-DS-SWYM-CSRFTOKEN": _3DSwym_token,
    },
    data: JSON.stringify(body),
    type: "json",
    onComplete(response, head, xhr) {
      const info = {
        response:
          typeof response === "string" ? JSON.parse(response) : response,
      };
      info["status"] = xhr.status;
      if (onDone) onDone(info);
    },
    onFailure(response) {
      if (onError) onError(response);
    },
  };
  _httpCallAuthenticated(url, headerOptions);
}
