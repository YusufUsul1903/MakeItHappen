import BaseModel from "./BaseModel.js";

class User extends BaseModel {
    static get tableName() {
        return "users";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",

            required: ["full_name", "email", "password"],

            properties: {
                id: {
                    type: "integer"
                },

                full_name: {
                    type: "string",
                    maxLength: 255
                },

                email: {
                    type: "string",
                    maxLength: 255
                },

                password: {
                    type: "string"
                }
            }
        };
    }
}

export default User;