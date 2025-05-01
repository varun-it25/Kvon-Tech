const Navbar = ({tab}:{tab:string}) => {
  return (
    <div className="justify-between bg-white pl-8 py-4 pr-10 items-center flex w-full">
        <p className="font-semibold text-xl">{tab}</p>
        <div className="flex items-center space-x-2.5">
            <p className="mt-[-1px] text-zinc-600">{localStorage.getItem('username') || 'User'}</p>
            <div className="w-7 flex justify-center items-center text-sm font-semibold text-white aspect-square rounded-full bg-sky-600">{localStorage.getItem('username')?.charAt(0).toUpperCase() || 'U'}</div>
        </div>
    </div>
  )
}

export default Navbar