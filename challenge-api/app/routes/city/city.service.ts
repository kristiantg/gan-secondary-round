import prisma from "../../../prisma/prisma-client"
import HttpException from '../../models/http-exception.model';
import Task from "../../models/task.model";
import {cityMapper, cityToGeoCoordinates, haversine} from "./city.utils";

const tasks: Task[] = [];

const getById = async (id: string) => {
  const city = await prisma.addresses.findUnique({
    where: {
      guid: id,
    }
  })
  
  if (!city) {
    throw new HttpException(404, "City not found");
  }

  return cityMapper(city);
}

export const getAll = async (pageNumber: number, pageSize: number) => {
  const offset = (pageNumber - 1) * pageSize;

  const cities = await prisma.addresses.findMany({
    skip: offset,
    take: pageSize,
  });
  
  return cities.map(city => cityMapper(city))
}

export const getCitiesByTag = async (tag: string, isActive: boolean) => {
    const cities = await prisma.addresses.findMany({
      where: {
        isActive: isActive,
        tags: {
          has: tag
        },
      },
    });   
  
    return cities.map(city => cityMapper(city));
  };

  export const findDistanceBetweenTwoCities = async (fromCityId: string, toCityId: string) => {
    const toCity = await getById(toCityId);
    const fromCity = await getById(fromCityId);

    const distanceBetween = haversine(cityToGeoCoordinates(fromCity), cityToGeoCoordinates(toCity));

    return {
      to: toCity, 
      from: fromCity,
      unit: 'km',
      distance: distanceBetween
    };
  }

  export const findCitiesWithinDistance = async (task: Task, maxDistance: number, cityId: string) => {
    tasks.push(task);
    
    const fromCity = await getById(cityId);
    const allCities = await prisma.addresses.findMany();

    const citiesWithinDistance = allCities.filter(city => {
        const distance = haversine(cityToGeoCoordinates(fromCity), cityToGeoCoordinates(city));

        if(distance === 0){
          return;
        }

        return distance < maxDistance;
    });

    task.cities = citiesWithinDistance;
    task.status = 'completed';
    
    return task;
};

export const getTaskById = (taskId: string) => {
  const task = tasks.find(task => task.id === taskId);

  if(!task){
    throw new HttpException(404, "Task not found"); 
  }

  return task;
} 