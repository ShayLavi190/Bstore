import { Link } from 'react-router-dom';
import './myaccount.css';
import Navbar from '../../components/navbar';


const MyAccount = () => {
  return (
    <div>
      <Navbar />
      <nav>
        <ul>
          <li>
            <Link to="/personaldata">Personal Data</Link>
          </li>
          <li>
            <Link to="/myorders">My Orders</Link>
          </li>
        </ul>
      </nav>
      <div className="content">
        <header className='tit'>
          <h1>Welcome</h1>
          <h2>The account page provides a comprehensive overview of your orders, allowing you to easily track your purchase history and delivery statuses. Additionally, it offers the convenience of updating your user information, ensuring your account details are always current and accurate. With access to both order management and user profile adjustments, the page serves as a centralized hub for managing your online experience efficiently. Whether checking past purchases or modifying personal details, this feature enhances user control and convenience.</h2>
        </header>
      </div>
    </div>
  );
};

export default MyAccount;
