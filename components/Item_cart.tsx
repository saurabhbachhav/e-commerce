"use client";

import { StaticImageData } from "next/image";
import Image from "next/image";

const Item_cart = (
  name: string,
  desc: string,
  price: string,
  category: string,
  imgsrc: StaticImageData
) => {
  return (
    <div className="p-2 cursor-pointer bg-black  to-black-200 ">
      <div className="m-1 border-gray-300 bg-pink-200 flex-row">
        <div className=" h-1/2 w-full ">
          <Image src={imgsrc} alt={`here is an image of ${name}`} />
        </div>
                 <hr />
                 <h3>{name}</h3>
                 <h5>{desc}</h5>
                 <h1>{price}</h1>
      </div>
    </div>
  );
};
