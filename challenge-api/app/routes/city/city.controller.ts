import { Router, Request, Response } from 'express';
import { getCitiesByTag, findCitiesWithinDistance, findDistanceBetweenTwoCities, getTaskById, getAll } from './city.service';
import auth from '../../middlewares/auth/auth';
import Task from '../../models/task.model';
import { cityByDistanceQuerySchema, cityByTagQuerySchema, findCitiesWithinDistanceSchema, getByIdSchema } from './city.schemas';
import { zParse } from '../../utils/validation';
import HttpException from '../../models/http-exception.model';

const router = Router();
const URL = "http://127.0.0.1:8080";

router.get(
    '/cities-by-tag',
    auth.required,
    async (req: Request, res: Response) => {
        try {
            const { query } = await zParse(cityByTagQuerySchema, req, res);
            const cities = await getCitiesByTag(query.tag, query.isActive,);
    
            res.json({cities: cities});
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.errorCode).send(error.message);
            }
        }
});

router.get(
    '/distance',
    auth.required,
    async (req: Request, res: Response) => {
        try {
            const { query } = await zParse(cityByDistanceQuerySchema, req, res);
            const distance = await findDistanceBetweenTwoCities(query.from, query.to);
    
            res.json(distance);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.errorCode).send(error.message);
            }
        }
});

router.get(
    '/area-result/:id', 
    auth.required,
    async (req: Request, res: Response) => {
        try {
            const { params } = await zParse(getByIdSchema, req, res);
            const task = await getTaskById(params.id)
    
            if(task.status == 'pending'){
                res.status(202);
            }
    
            res.json(task);
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.errorCode).send(error.message);
            }
        }
});

router.get(
    '/area',
    auth.required,
    async (req: Request, res: Response) => {
        try {
            const { query } = await zParse(findCitiesWithinDistanceSchema, req, res);
            const task: Task = {id: "2152f96f-50c7-4d76-9e18-f7033bd14428", status: 'pending'}
    
            findCitiesWithinDistance(task, query.distance, query.from);
    
            const resultsUrl = `${URL}/area-result/${task.id}`;
            res.status(202).json({ resultsUrl });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.errorCode).send(error.message);
            }
        }
});

router.get(
    '/all-cities', 
    auth.required, 
    async (req: Request, res: Response) => {
        const batchSize = 500;
        let pageNumber = 1;
        let hasNextPage = true;
        let isFirstBatch = true; 
        
        res.write('[');
        
        while (hasNextPage) {
            const citiesBatch = await getAll(pageNumber, batchSize);
        
            if (citiesBatch.length > 0) {
                const cityStrings = citiesBatch.map(city => JSON.stringify(city));
    
                if (!isFirstBatch) {
                    res.write(',\n');
                }

                res.write(cityStrings.join(',\n'));
                isFirstBatch = false;
            }
        
            if (citiesBatch.length < batchSize) {
                hasNextPage = false;
            } else {
                pageNumber++;
            }
        }
        
        res.write('\n]');
        res.end();        
})

export default router;