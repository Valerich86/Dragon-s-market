import React from 'react'

export default function NoInfo({text="Нет информации"}:{text?:string}) {

  return (
      <div className="w-screen h-screen flex justify-center items-center pb-60">
        {text}
      </div>
    );
}

