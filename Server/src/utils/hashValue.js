import bcrypt from "bcrypt";

export const hashValue = async(value)=>{

    return await bcrypt.hash(value.toString(),10);
}


export const compareValue = async(value,hashValue)=>{

    return await bcrypt.compare(value.toString(),hashValue.toString());
}