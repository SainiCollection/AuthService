import jwt from 'jsonwebtoken';

const jwtTokenGenerator = (userId:number, userName:string, userEmail:string, appName:string) =>{
    return jwt.sign({id:userId,userName:userName, email:userEmail,appName:appName},process.env.JWT_SECRET as string,{expiresIn:'1d'})
}

export default jwtTokenGenerator;