import {Request,Response,NextFunction} from "express";
import {v4} from 'uuid';
import Food from "../models/food";

import Restaurant from '../models/restaurant';
import Owner from "../models/owner";
import {producer} from "../config/kafka";
import {sequelize} from "../models";

// /:accountRandomId
export const createRestaurant = async (req:Request,res:Response,next:NextFunction)=>{
    const transaction = await sequelize.transaction();
    try{
        const accountRandomId = req.params.accountRandomId;

        const isExistRestaurant = await Restaurant.findOne({where: {restaurantOwnerId: accountRandomId}});
        if(isExistRestaurant){
            throw new Error('이미 음식점에 대한 정보가 있습니다');
        }

        const {restaurantName} = req.body;
        const createRestaurant = await Restaurant.create({
            restaurantName:restaurantName,

            restaurantId:v4()
        },{transaction});

        const createOwner = await Owner.create({
            ownerId:accountRandomId
        },{transaction})

        await createRestaurant.setOwner(createOwner,{transaction});
        await producer.send({
            topic:'restaurant-create-restaurant-event',
            messages:[{value:JSON.stringify(createRestaurant,null,2)}]
        })

        await transaction.commit();
        res.status(201).send({
            statusCode:201,
            message:{
                restaurantId :createRestaurant.restaurantId
            }
        })
    }catch (err){
        await transaction.rollback();
        next(err);
    }

}
// /:accountRandomId/restaurant/:restaurantRandomId/food
export const addFood = async (req:Request,res:Response,next:NextFunction)=>{
    const transaction = await sequelize.transaction();
    try{
        const {accountRandomId, restaurantRandomId } = req.params;
        const restaurant = await Restaurant.findOne({
            where:
                {
                    restaurantId:restaurantRandomId
                },
            include:{
                model:Owner,
                required:true
            }});
        if(!restaurant || restaurant!.Owner.ownerId !== accountRandomId){
            throw new Error("잘못된 경로로 접근 하였습니다.");
        }

        // console.log(restaurant!.Owner)


        
        const {foodName,foodPrice} = req.body;
        const createFood = await Food.create({
            foodName:foodName,
            foodPrice:foodPrice,
            // restaurantId:restaurant.restaurantId,
            foodId:v4()
        },{transaction});
        await restaurant!.addFood(createFood,{transaction});


        const foodMessage = {
            id:createFood.id,
            foodName:createFood.foodName,
            foodPrice:createFood.foodPrice,
            foodId:createFood.foodId,
            updatedAt:createFood.createdAt,
            createAt:createFood.createdAt,
            restaurantId:restaurantRandomId,
        }
        console.log(JSON.stringify(foodMessage,null,2));
        await producer.send({
            topic:'restaurant-create-food-event',
            messages:[{value:JSON.stringify(foodMessage,null,2)}]
        })
        await transaction.commit();
        res.status(201).send({
            statusCode:201,
            msg : {
                foodId : createFood.foodId
            }
        })
    }catch (err){
        await transaction.rollback();
        next(err);
    }
}

