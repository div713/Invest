function Login() {
    return ( 
        <div className="container p-3">
            <h2 className="mt-3">Login</h2>
            <form action="/login">
                <button className="mt-2 btn btn-primary fs-6" style={{width:"20%"}} >Log in to your account</button>
            </form>
        </div>
    );
}

export default Login;