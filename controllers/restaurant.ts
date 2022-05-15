import {Request,Response,NextFunction} from "express";
import {v4} from 'uuid';
import Food from "../models/food";

import Restaurant from '../models/restaurant';
import Owner from "../models/owner";
// /:accountRandomId
export const createRestaurant = async (req:Request,res:Response,next:NextFunction)=>{

    try{
        const accountRandomId = req.params.accountRandomId;

        // const isExistRestaurant = await Restaurant.findOne({where: {restaurantOwnerId: accountRandomId}});
        // if(isExistRestaurant){
        //     throw new Error('이미 음식점에 대한 정보가 있습니다');
        // }

        const {restaurantName} = req.body;
        const createRestaurant = await Restaurant.create({
            restaurantName:restaurantName,

            restaurantId:v4()
        });
        const createOwner = await Owner.create({
            ownerId:accountRandomId
        })

        await createRestaurant.setOwner(createOwner);

        res.status(201).send({
            statusCode:201,
            message:{
                restaurantId :createRestaurant.restaurantId
            }
        })
    }catch (err){
        next(err);
    }

}
// /:accountRandomId/restaurant/:restaurantRandomId/food
export const addFood = async (req:Request,res:Response,next:NextFunction)=>{
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
        if(!restaurant||restaurant!.Owner.ownerId!==accountRandomId){
            throw new Error("잘못된 경로로 접근 하였습니다.");
        }

        // console.log(restaurant!.Owner)


        // if(!restaurant){
        //     throw new Error('음식점에 대한 정보가 없습니다.');
        // }
        const {foodName,foodPrice} = req.body;
        const createFood = await Food.create({
            foodName:foodName,
            foodPrice:foodPrice,
            // restaurantId:restaurant.restaurantId,
            foodId:v4()
        });
        await restaurant!.addFood(createFood.id);
        res.status(201).send({
            statusCode:201,
            message : {
                foodId : createFood.foodId
            }
        })
    }catch (err){
        next(err);
    }
}

