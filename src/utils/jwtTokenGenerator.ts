import jwt from 'jsonwebtoken';

const jwtTokenGenerator = (userId:number, userEmail:string, appName:string) =>{
    return jwt.sign({id:userId,email:userEmail,appName:appName},process.env.JWT_SECRET as string,{expiresIn:'1d'})
}

export default jwtTokenGenerator;