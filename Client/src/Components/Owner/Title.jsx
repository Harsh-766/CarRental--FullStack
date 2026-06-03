// import React from 'react'

// const Title = (title, subTitle) => {
//   return (
//     <div>
//       <h1 className='font-medium text-3xl'>{title}</h1>
//       <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-156'>{subTitle}</p>
//     </div>
//   )
// }

// export default Title


import React from 'react';

const Title = ({ title, subTitle, align }) => {
  return (
    <div className={align === "left" ? "text-left" : "text-start"}>

      <h1 className='text-3xl font-bold'>
        {title}
      </h1>

      <p className='text-gray-500 mt-2'>
        {subTitle}
      </p>

    </div>
  );
};

export default Title;