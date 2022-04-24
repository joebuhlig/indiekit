import { FormData } from "undici";
import got from "got";

/**
 * Upload attached file(s) via media endpoint
 *
 * @param {object} publication Publication configuration
 * @param {object} properties JF2 properties
 * @param {object} files Files to upload
 * @returns {Array} Uploaded file locations
 */
export const uploadMedia = async (publication, properties, files) => {
  const { bearerToken, mediaEndpoint } = publication;

  for await (const file of files) {
    // Create multipart/form-data
    const form = new FormData();
    const blob = new Blob([file.buffer]);
    form.append("file", blob, file.originalname);

    // Upload file via media endpoint
    let upload;
    try {
      upload = await got.post(mediaEndpoint, {
        body: form,
        headers: {
          authorization: `Bearer ${bearerToken}`,
          "content-type": file.mimetype,
        },
        responseType: "json",
      });
    } catch (error) {
      throw new Error(
        error.response ? error.response.body.error_description : error.message
      );
    }

    // Update respective media property with location of upload
    const filetype = file.fieldname.replace("[]", "");
    properties[filetype] = properties[filetype] || [];
    properties[filetype].push(upload.headers.location);
  }

  return properties;
};
