import * as express from 'express';
import {addFood, createRestaurant} from "../controllers/restaurant";
import {NextFunction, Request, Response} from "express";


const router = express.Router();

router.get('/',async (req:Request,res:Response,next:NextFunction)=>{
    console.log('root')
})

router.get('/check',async (req:Request,res:Response,next:NextFunction)=>{
    console.log('check')
})
router.get('/restaurant-service',async (req:Request,res:Response,next:NextFunction)=>{
    console.log('root1')
})

router.get('/restaurant-service/check',async (req:Request,res:Response,next:NextFunction)=>{
    console.log('check1')
})
router.post('/:accountRandomId/restaurant',createRestaurant);

router.post('/:accountRandomId/restaurant/:restaurantRandomId/food',addFood);
export default router;