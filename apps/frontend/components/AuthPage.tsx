export function AuthPage({isSignin} : {
    isSignin: boolean
}){
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-2 m-2 flex flex-col text-black bg-white rounded">
            <input className="border border-black m-2" type="text" placeholder="email"></input>
            <input className="border border-black m-2" type="password" placeholder="password"></input>
            {!isSignin && <input className="border border-black m-2" type="text" placeholder="username"></input>}
            <button>{isSignin ? "Sign In" : "Sign Up"}</button>
        </div>

    </div>
}