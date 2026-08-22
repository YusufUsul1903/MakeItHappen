import { Model } from 'objection';
import db from '../database/db.js';

Model.knex(db);

class BaseModel extends Model {}

export default BaseModel;