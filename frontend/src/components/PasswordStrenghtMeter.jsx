import React from 'react'
import {Check, X} from 'lucide-react'

const PasswordCriteria = ({password}) => {
    const criteria =[
        {label: "Minimum 6 characters", met: password.length >= 6},
        {label: "At least one lowercase letter", met: /[a-z]/.test(password)},
        {label: "At least one uppercase letter", met: /[A-Z]/.test(password)},
        {label: "At least one number", met: /[0-9]/.test(password)},
        {label: "At least one special character", met: /[^A-Za-z0-9]/.test(password)} 
    ];
    return (
        <div className='space-y-1 mt-2'>
            {criteria.map((item) => (
                <div key={item.label} className='flex items-center text -xs '>
                    {item.met ? (
                        <Check className='size-4 text-green-500 mr-2'/>
                    ) :(
                        <X className='size-4 text-gray-500 mr-2'/>
                    )}
                    <span className={item.met ? 'text-green-500' : 'text-gray-400'}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    )
}

const PasswordStrenghtMeter = ({password}) => {
    const getStrength = (pass) => {
        let strenght = 0;
        if (pass.length >= 6) strenght++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strenght++;
        if (pass.match(/\d/)) strenght++; 
        if (pass.match(/[^a-zA-Z\d]/)) strenght++; //[^a-zA-Z\d] means any character that is not a letter or a digit
        return strenght;
    }
    const strength = getStrength(password);

    const getColor = (strength) => {

        if (strength === 0) return 'bg-red-500';
        if (strength === 1) return 'bg-red-400';
        if (strength === 2) return 'bg-yellow-500';
        if (strength === 3) return 'bg-yellow-400';
        return 'bg-green-500';
    };

    const getStrengthText = (strength) => { 
        if (strength === 0) return ' Very Weak';
        if (strength === 1) return ' Weak';
        if (strength === 2) return ' Fair';
        if (strength === 3) return ' Good';
        return ' Strong';
    }
  return  <div className='mt-2'>
            <div className='flex justify-between items-center mb-1'>
            <span className='text-xs text-gray-400'>Password Strength</span>
            <span className='text-xs text-gray-400'>{getStrengthText(strength)}</span>
            </div>  

            <div className="flex space-x-1">
                {[...Array(4)].map((_, index) => (

                    <div key={index} className={`h-2 w-1/4 rounded-full transition-colors duration-300 ${index < strength ? getColor(strength) : "bg-gray-600"}`}/>
                ))}
            </div> 
            <PasswordCriteria password={password}/>
        </div>
  
}

export default PasswordStrenghtMeter