import * as express from 'express';
import {addFood, createRestaurant} from "../controllers/restaurant";


const router = express.Router();

router.post('/:accountRandomId',createRestaurant);

router.post('/:accountRandomId/restaurant/:restaurantRandomId/food',addFood);
export default router;