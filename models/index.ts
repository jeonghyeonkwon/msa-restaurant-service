import Restaurant ,{ associate as associateRestaurant } from "./restaurant";
import Food,{associate as associateFood} from "./food";
import Owner,{associate as associateOwner} from './owner';
export * from './sequelize'

const db = {
    Restaurant,
    Food,
    Owner
};

export type dbType = typeof db;

associateRestaurant(db);
associateFood(db);
associateOwner(db);