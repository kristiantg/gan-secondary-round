import cityController from './city/city.controller';
import { Router } from "express";

const api = Router()
  .use(cityController)

export default Router().use('', api);