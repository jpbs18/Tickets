import Link from 'next/link'

export default function Header({ currentUser }) {
    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/" className="navbar-brand">GiTix</Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {currentUser ? (
                        <>
                            <li className="nav-item" key="sell-tickets">
                                <Link href="/tickets/new" className="nav-link">Sell Tickets</Link>
                            </li>
                            <li className="nav-item" key="my-orders">
                                <Link href="/orders" className="nav-link">My Orders</Link>
                            </li>
                            <li className="nav-item" key="signout">
                                <Link href="/auth/signout" className="nav-link">Sign Out</Link>
                            </li>
                        </>                  
                    ) : (
                        <>
                            <li className="nav-item" key="signin">
                                <Link href="/auth/signin" className="nav-link">Sign In</Link>
                            </li>
                            <li className="nav-item" key="signup">
                                <Link href="/auth/signup" className="nav-link">Sign Up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}

