import React from 'react'

export default function NoInfo({text="Нет информации"}:{text?:string}) {

  return (
      <div className="w-full h-[70vh] flex justify-center items-center pb-60 text-center">
        {text}
      </div>
    );
}

