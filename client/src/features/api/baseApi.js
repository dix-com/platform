import { createApi } from "@reduxjs/toolkit/query/react";

const customBaseQuery =
    ({ baseUrl } = { baseUrl: process.env.REACT_APP_API_URL }) =>
        async (
            { url, method = "GET", headers = {}, body = null },
            api,
            extraOptions
        ) => {
            const options = {
                method,
                headers,
                credentials: "include",
            };

            if (body && method !== "GET" && method !== "HEAD") {
                if (body instanceof FormData) {
                    options.body = body;
                } else {
                    options.body = JSON.stringify(body);
                    headers["Content-Type"] = "application/json";
                }
            }

            const response = await fetch(baseUrl + url, options);
            const result = await response.json();

            if (result.error) {

                return {
                    error: {
                        status: result.error.status,
                        message: result.error.message,
                    },
                };
            }

            return {
                data: result,
            };
        };



export const baseApi = createApi({
    baseQuery: customBaseQuery(),
    reducerPath: "baseApi",
    tagTypes: ["Auth", "User", "Post", "UserWidget", "Bookmark"],
    keepUnusedDataFor: 30,
    endpoints: (builder) => ({}),
});
