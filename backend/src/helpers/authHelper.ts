
import * as bcrypt from 'bcrypt'

export const hashPassword = async(password: any)=>{
    try{
        const hashedPassword = await bcrypt.hash(password,10)
        return hashedPassword
    }catch(error){
        console.log(error)
    }
}

export const comparePassword = async (password: any,hashedPassword: any)=>{
    return bcrypt.compare(password,hashedPassword)
}

