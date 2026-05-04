import type { UseFormRegister } from "react-hook-form";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

interface Props{
    label:string
    placeholder?:string
    description?:string
    errorMsg:string | undefined,
    name:string,
    registration:ReturnType<UseFormRegister<any>>
}

export default function MessageBox({label,placeholder,description,errorMsg,name, registration}:Props){
    return(
      <Field className="p-2">
        <FieldLabel  htmlFor={name}>{label}</FieldLabel>
        <Textarea 
          id={name} 
          placeholder={placeholder}
          {...registration}  
        />
        {description && 
        <FieldDescription className='text-white text-sm'>{description}</FieldDescription>}
        {errorMsg && <FieldDescription className='text-red-500 text-sm'>{errorMsg}</FieldDescription>}
      </Field>
    )
}