import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { UseFormRegister } from "react-hook-form"

type Props = {
    label: string, 
    name: string, 
    registration: ReturnType<UseFormRegister<any>>
    description?:string,
    errorMsg?:string,
    type?: string
}

export default function FormInput({label, name, registration, description, errorMsg, type="text"}:Props){
    return(
        <Field className="p-2">
            <FieldLabel htmlFor={name}>
                {label}
            </FieldLabel>
            <Input id={name} type={type} {...registration} />
            {(description || errorMsg) &&
            <FieldDescription className={errorMsg ? 'text-red-500 text-sm' : 'text-white text-sm' }>
                {errorMsg ?? description}
            </FieldDescription>
            }
        </Field>
    )
}