import HttpError from "http-errors";
import { getPostType } from "./post-type-discovery.js";
import { normaliseProperties } from "./jf2.js";
import { getPostTypeConfig } from "./utils.js";

/**
 * Count post types
 *
 * @param {object} publication Publication configuration
 * @param {object} properties JF2 properties
 * @returns {object} Post data
 */

export const PostTypeCount = class {
  async get(publication, properties) {
    try {
      if (!publication) {
        throw new Error("No publication configuration provided");
      }

      if (!properties) {
        throw new Error("No properties included in request");
      }

      const { me, postTypes, timeZone } = publication;

      // Normalise properties
      properties = normaliseProperties(publication, properties);

      // Post type
      const type = getPostType(properties);
      properties["post-type"] = type;

      // Get post type config
      const typeConfig = getPostTypeConfig(type, postTypes);
      if (!typeConfig) {
        throw new HttpError(
          501,
          `No configuration found for ${type} post type. See https://getindiekit.com/customisation/post-types/`
        );
      }

      console.log(type);
      const { posts, postTemplate, store, storeMessageTemplate } = publication;
      const count = await store.countFiles();
      return count;
    } catch (error) {
      throw new HttpError(400, error);
    }
  }
};
