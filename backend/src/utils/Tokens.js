import jwt from "jsonwebtoken"


export const GenerateToken = (data)=>{
    return jwt.sign({data},process.env.SECRET,{
        expiresIn:"5m"
    })
}
