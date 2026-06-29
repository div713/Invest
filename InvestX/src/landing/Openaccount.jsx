function Openaccount() {
    return ( 
        <div className="container p-3">
            <h2 className="mt-3">Open Account</h2>
            <p className="mt-2 mb-2">Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
            <form action="/register">
                <button className="mt-2 btn btn-primary fs-6" style={{width:"20%"}} >Sign Up for free</button>
            </form>
        </div>
    );
}

export default Openaccount;