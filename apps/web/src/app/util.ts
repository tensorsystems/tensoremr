import _ from "lodash";
import { ClientResponseError } from "pocketbase";

export const pocketbaseErrorMessage = (error: ClientResponseError) => {
  const errorData = error?.data.data;
  if (!_.isEmpty(errorData)) {
    for (const key in errorData) {
      if (key) {
        return key + ' ' + errorData[key].message.toLowerCase();
      }
    }
  } else {
    return error?.message;
  }
};


