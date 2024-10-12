import gif from '../../assets/images/green_background.jpg'

const BlogHero = ({handleClick}) => {

  return (
<>
<div className="w-full bg-center bg-cover h-[42rem]" style={{backgroundImage: `url(${gif})`}}>
        <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
            <h1 className="text-5xl font-extrabold text-center lg:text-7xl 2xl:text-8xl">
            <span className="text-[#ffffff]">
                        E
                    </span>
                    <span className="text-[#0a9a0e]">
                        M
                    </span>
                    <span className="text-[#ffffff]">
                        R&nbsp;
                    </span>
                    <span className="text-transparent bg-gradient-to-tr bg-clip-text from-green-600 to-green-950">
                        BLOG
                    </span>
                </h1>
                <p className="max-w-3xl mx-auto mt-6 text-lg text-center text-gray-700 dark:text-white md:text-xl">
                Embark on a journey through our captivating blogosphere
                </p>
                <button onClick={handleClick} className=" w-auto px-4 py-2 mt-14 text-sm font-medium text-white uppercase transition-colors duration-200 transform bg-green-700 rounded-md lg:w-auto hover:bg-green-400 ">Explore</button>
            </div>
        </div>
    </div>
</>
  )
}

export default BlogHero;