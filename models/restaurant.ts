import {
    BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyGetAssociationsMixin,
    Model
} from "sequelize";

import {sequelize} from './sequelize'
import {dbType} from "./index";
import Food from "./food";
import Owner from "./owner";
class Restaurant extends Model {

    public readonly id!: number;
    public restaurantName!: string;

    public restaurantId!: string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;

    public readonly Owner! : Owner;
    public readonly Foods?:Food[];

    public setOwner!:BelongsToSetAssociationMixin<Owner,number>;
    public getOwner!:BelongsToGetAssociationMixin<Owner>
    public addFood!: HasManyAddAssociationMixin<Food, number>
    public getFoods!: HasManyGetAssociationsMixin<Food>



}
Restaurant.init({
    restaurantName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    restaurantId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }

},{
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'Restaurant',
    tableName: 'restaurants',
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
})

export const associate = (db:dbType)=>{
    db.Restaurant.hasMany(db.Food,{foreignKey:'restaurant_id',as:'Foods'});
    db.Restaurant.belongsTo(db.Owner,{foreignKey:'owner_id'});
}
export default Restaurant;