function restCall(method, endpoint, token, data) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, endpoint, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    token ? xhr.setRequestHeader("Authorization", "Bearer " + token) : null;
    if (data) {
      if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.send(JSON.stringify(data));
      }
    } else {
      xhr.send();
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.response);
        resolve(response);
      } else if (xhr.status !== 200) {
        reject(xhr.status);
      }
    };
  });
}

async function fifthKindLogin() {
  return await restCall("POST", "/fifthkind/login").then(value => {
    const auth_token = value.access_token;
    return auth_token;
  });
}

async function getUploadJWT(auth_token) {
  return await restCall("POST", "/fifthkind/get_upload_jwt", auth_token).then(
    value => {
      const crs_jwt = value.jwt;
      return crs_jwt;
    }
  );
}

async function getJWT(auth_token) {
  return await restCall("POST", "/fifthkind/get_jwt", auth_token).then(
    value => {
      const meta_jwt = value.jwt;
      return meta_jwt;
    }
  );
}

async function prepUploadByFilePath(meta_jwt, fileArray) {
  return await restCall(
    "POST",
    "/fifthkind/prep_upload_by_file_path",
    meta_jwt,
    fileArray
  ).then(value => {
    return value;
  });
}

async function getUploadToken(crs_jwt, num_of_files) {
  return await restCall(
    "GET",
    "/fifthkind/get_upload_token/" + num_of_files,
    crs_jwt
  ).then(value => {
    const upload_token = JSON.parse(value).items.uploadToken;
    return upload_token;
  });
}

async function uploadFileByPath(payload, crs_jwt, upload_token, groupId) {
  const upload_data = {
    payload: payload,
    uploadToken: upload_token,
    groupId: groupId
  };
  return await restCall(
    "POST",
    "/fifthkind/upload_file_by_path",
    crs_jwt,
    upload_data
  ).then(value => {
    return JSON.parse(value).items;
  });
}

async function getDomainTags(meta_jwt) {
  return await restCall("GET", "/fifthkind/get_domain_tags", meta_jwt).then(
    value => {
      return JSON.parse(value).items.filter(group => {
        return group.value !== "Quick Share";
      });
    }
  );
}

async function getTagGroups(meta_jwt) {
  return await restCall("GET", "/fifth_kind/get_tag_groups", meta_jwt).then(
    value => {
      return value.items;
    }
  );
}

async function getTagGroupByValue(meta_jwt, groupName) {
  return await restCall("GET", "/fifthkind/get_tag_groups", meta_jwt).then(
    value => {
      return JSON.parse(value).items.filter(group => {
        return group.name === groupName;
      });
    }
  );
}

async function getTagGroupById(
  meta_jwt,
  groupId,
  domainPurpose,
  isStructural,
  isRequired
) {
  let endpoint =
    "/fifthkind/get_tag_group_by_id?group_id=" +
    groupId +
    "&domain_purpose_id=" +
    domainPurpose;
  isStructural ? (endpoint += "&is_structural=" + isStructural) : null;
  isRequired ? (endpoint += "&is_required=" + isRequired) : null;
  return await restCall("GET", endpoint, meta_jwt).then(value => {
    return JSON.parse(value).items;
  });
}

async function getTagsBySelectedId(meta_jwt, groupId, selectedId) {
  return await restCall(
    "GET",
    "/fifthkind/get_tags_by_selected_id?group_id=" +
      groupId +
      "&selected_ids=" +
      selectedId,
    meta_jwt
  ).then(value => {
    return JSON.parse(value).items;
  });
}

async function addTagsToFile(meta_jwt, fileId, tags) {
  return await restCall(
    "PUT",
    "/fifthkind/add_tags_to_file/" + fileId,
    meta_jwt,
    tags
  ).then(value => {
    return value.items;
  });
}

export {
  fifthKindLogin,
  getUploadJWT,
  getJWT,
  prepUploadByFilePath,
  getUploadToken,
  uploadFileByPath,
  getDomainTags,
  getTagGroups,
  getTagGroupByValue,
  getTagGroupById,
  getTagsBySelectedId,
  addTagsToFile
};
