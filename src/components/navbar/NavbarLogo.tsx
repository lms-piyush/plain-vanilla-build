
import { Link } from 'react-router-dom';

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative h-12 w-56">
        <img 
          src="/talent_school.png" 
          alt="TalentSchool Logo" 
          className="h-full object-contain"
        />
      </div>
    </Link>
  );
};

export default NavbarLogo;
