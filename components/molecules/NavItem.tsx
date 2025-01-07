import Text from '../atoms/Text';

interface NavItemProps {
  href: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, label }) => {
  return <Text href={href} variant="nav">{label}</Text>;
};

export default NavItem;
