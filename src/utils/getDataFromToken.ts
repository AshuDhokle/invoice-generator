import { NextRequest} from "next/server";
import jwt from 'jsonwebtoken';

export const getDataFromToken = async(req : NextRequest) =>{
    try {
      const token = req.cookies.get('token')?.value || '';
      const decodedToken = jwt.verify(token,process.env.JWT_SECRET!);
      if (typeof decodedToken === 'string' || !('id' in decodedToken)) {
        throw new Error('Invalid token');
      }
      return decodedToken.id;
      
    } catch (error : unknown) {
      console.log(error);
      throw new Error('Data not available');    
    }
}