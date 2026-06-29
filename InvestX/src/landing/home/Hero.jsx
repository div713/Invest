function Hero() {
    return ( 
        <div className="container p-3">
            <div className="row">
                <img src="media/images/homeHero.png" alt="hero-image"/>
            </div>
            <h2 className="mt-3">Invest in everything</h2>
            <p>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
            <form action="/register">
                <button className="mt-2 btn btn-primary fs-6" style={{width:"20%"}} >Sign Up for free</button>
            </form>
        </div>
    );
}

export default Hero;