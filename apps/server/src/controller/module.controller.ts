import { NextFunction, Request, Response } from 'express';
import { ModuleInsert, ModuleSelect } from '../models/schema/modules';
import ModuleService from '../services/ModuleService';

export const create = async (
  req: Request<object, object, ModuleInsert>,
  res: Response<{ module: ModuleSelect }>,
  next: NextFunction
) => {
  try {
    const module = await ModuleService.createOne(req.body);
    res.json({ module });
  } catch (e) {
    console.error('Could not create a new Module');
    next(e);
  }
};

export const getAll = async (
  req: Request,
  res: Response<{ modules: ModuleSelect[] }>,
  next: NextFunction
) => {
  try {
    const modules = await ModuleService.getAll();
    res.json({ modules });
  } catch (e) {
    console.error("Couldn't fetch all Modules");
    next(e);
  }
};
