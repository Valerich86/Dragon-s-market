import React from 'react'

export default function NoInfo({text="Нет информации"}:{text?:string}) {

  return (
      <div className="w-full h-[50vh] flex justify-center items-center text-center">
        {text}
      </div>
    );
}

