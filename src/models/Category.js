import { Model } from "objection";
import BaseModel from "./BaseModel.js";
import User from "./User.js";

class Category extends BaseModel {
    static get tableName() {
        return "categories";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",

            required: ["name", "user_id"],

            properties: {
                id: {
                    type: "integer"
                },

                name: {
                    type: "string",
                    maxLength: 50
                },

                color: {
                    type: "string",
                    maxLength: 7
                },

                user_id: {
                    type: "integer"
                }
            }
        };
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,

                join: {
                    from: "categories.user_id",
                    to: "users.id"
                }
            }
        };
    }
}

export default Category;