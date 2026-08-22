import { Model } from "objection";
import BaseModel from "./BaseModel.js";
import User from "./User.js";
import Category from "./Category.js";

class Task extends BaseModel {
    static get tableName() {
        return "tasks";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",

            required: ["title", "user_id"],

            properties: {
                id: {
                    type: "integer"
                },

                title: {
                    type: "string",
                    maxLength: 200
                },

                completed: {
                    type: "boolean"
                },

                category_id: {
                    type: ["integer", "null"]
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
                    from: "tasks.user_id",
                    to: "users.id"
                }
            },

            category: {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,

                join: {
                    from: "tasks.category_id",
                    to: "categories.id"
                }
            }
        };
    }
}

export default Task;