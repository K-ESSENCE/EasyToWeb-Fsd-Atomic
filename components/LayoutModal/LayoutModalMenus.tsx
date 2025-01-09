const LayoutModalMenus = ({
  menus,
  selectedMenu,
  onClickMenu,
}: {
  menus: string[];
  selectedMenu: string;
  onClickMenu: (menu: string) => void;
}) => {
  return (
    <div className="cursor-pointer">
      {menus.map((menu, idx) => (
        <p 
          onClick={() => onClickMenu(menu)} 
          className={`
            font-medium text-lg leading-[21.48px] tracking-[0.36px] mb-[22px]
            ${menu === selectedMenu ? 'text-primary-100' : 'text-black'}
          `} 
          key={idx}
        >
          {menu}
        </p>
      ))}
    </div>
  );
};

export default LayoutModalMenus;