import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      class="navbar navbar-expand-lg bg-body-tertiary border-bottom"
      style={{ backgroundColor: "white" }}
    >
      <div class="container">
        <Link class="navbar-brand" to={"/"}>
          InvestX
        </Link>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <Link className="nav-link active" to={"/login"}>Login</Link>
            </li>
            <li class="nav-item">
              <Link className="nav-link active" to={"/register"}>Signup</Link>
            </li>

            <li class="nav-item">
              <Link class="nav-link active" to={"/about"}>About</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link active" to={"/product"}>Products</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link active" to={"/pricing"}>Pricing</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
