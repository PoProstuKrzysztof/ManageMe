import express from 'express';
import { deleteUserById, getUsers } from '../models/UserDb'; 

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();

    return res.status(200).send(users);
    
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const deleteUser = async (req:express.Request, res:express.Response) => {
  try{
    const {id} = req.params;

    const deletedUser = await deleteUserById(id);

    return res.send(deletedUser)

     
  }catch(error){
    console.log(error);
    return res.sendStatus(500);
  }
}