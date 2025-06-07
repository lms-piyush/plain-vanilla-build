
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center">
      <GraduationCap className="h-8 w-8 text-[#8A5BB7]" />
      <h1 className="ml-2 text-2xl font-bold text-gray-900">TalentSchool</h1>
    </Link>
  );
};

export default NavbarLogo;
