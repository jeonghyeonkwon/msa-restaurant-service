import {BelongsToSetAssociationMixin, DataTypes, Model} from 'sequelize';

import {dbType} from "./index";
import {sequelize} from "./sequelize";
import Restaurant from "./restaurant";

class Food extends Model{
    public readonly id!:number;
    public foodName!:string;
    public foodPrice!:number;
    public foodId!:string;


    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;

    public addRestaurant! : BelongsToSetAssociationMixin<Restaurant,number>

}
Food.init({
    foodName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    foodPrice:{
        type:DataTypes.BIGINT,
        allowNull: false
    },
    foodId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }
},{
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'Food',
    tableName: 'foods',
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
})

export const associate = (db:dbType)=>{
    db.Food.belongsTo(db.Restaurant,{foreignKey:'restaurant_id',targetKey:"id"});
};

export default Food;
