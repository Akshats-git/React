import React from 'react'

function Card({username="Akaza", animename="Kimetsu no Yaiba"}) { // destructuring props in the function parameter and assigning default values to them
    // console.log(props)
    return(
        // <> // dumb component
        //     <img src="https://i.pinimg.com/736x/45/24/45/452445af9ce64f01ab92758f1dc57e47.jpg" alt="Hero" />
        //     <h1 className='text-2xl bg-green-500 text-white p-2'>A card for photos</h1>
        //     <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, nihil. </p>
        // </>
        <>
            <div className="flex flex-col items-center p-7 rounded-2xl">
            <div>
                <img className="size-48 shadow-xl rounded-md" alt="" src="https://i.pinimg.com/736x/45/24/45/452445af9ce64f01ab92758f1dc57e47.jpg" />
            </div>
            <div className="flex flex-col gap-2">
                {/* <span>{props.username}</span> */}
                <span>{username}</span>  {/* props is destructured in the function parameter, so we can directly use username and animename instead of props.username and props.animename */}
                {/* <span>{animename}</span> */}
                <span>{animename}</span>
                <span className="flex">
                <span>No. 4</span>
                <span>·</span>
                <span>2025</span>
                </span>
            </div>
            </div>
        </>
    )
}

export default Card;