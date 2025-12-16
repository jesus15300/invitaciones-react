import qs from "qs";
import { getStrapiURL } from "./api-helpers.js";

export async function fetchAPI(
  path,
  urlParamsObject = {},
  options = {}
) {
  try {
    // Merge default and user options
    const mergedOptions = {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject, {
      encodeValuesOnly: true,
    });
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ""}`
    )}`;
    console.log("Request URL:", requestUrl);

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;

  } catch (error) {
    console.error(error);
    throw new Error(`Please check if your server is running and you set all the required tokens.`);
  }
}
export async function postApi(
  path,
  body = {},
  options = {}
) {
  try {
    // Merge default and user options
    const { headers: optionsHeaders = {}, ...restOptions } = options;
    const mergedOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...optionsHeaders,
      },
      body: JSON.stringify(body),
      ...restOptions,
    };
    const requestUrl = `${getStrapiURL(`/api${path}`)}`;
    console.log("Request URL:", requestUrl);

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;

  } catch (error) {
    console.error(error);
    throw new Error(`Please check if your server is running and you set all the required tokens.`);
  }
}