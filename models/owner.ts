import {DataTypes, Model} from 'sequelize';

import {dbType} from "./index";
import {sequelize} from "./sequelize";

class Owner extends Model{
    public readonly id!:number;
    public readonly ownerId!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}
Owner.init({
    ownerId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },

},{
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'Owner',
    tableName: 'owners',
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
})

export const associate = (db:dbType)=>{

};

export default Owner;
