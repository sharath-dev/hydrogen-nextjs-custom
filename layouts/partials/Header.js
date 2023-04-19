import menu from "@config/menu.json";
import { useHeaderContext } from "context/state";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
const Header = () => {
  // router
  const router = useRouter();

  //context
  const { categories } = useHeaderContext();

  //local state
  const [openMenu, setOpenMenu] = useState(false);
  const [navMenu, setNavMenu] = useState(
    menu.main.map((item) => ({ ...item, type: "main" }))
  );

  useEffect(() => {
    const matchRoute = menu.main.find((item) => item.url === router.asPath);
    const navList = [...menu.main];

    if (matchRoute) {
      if (matchRoute.url === "/") {
        const arr = categories.slice(0, 4);
        navList.splice(1, 0, ...arr);
        setNavMenu(navList);
      } else {
        setNavMenu(menu.main);
      }
    } else {
      //if route not match
      navList.splice(1, 0, ...categories);
      navList.splice(navList.length - 2, menu.main.length - 1);
      setNavMenu(navList);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, menu.main, categories]);

  return (
    <>
      <header className={`header mt-4 pb-3 text-white`}>
        <nav className="navbar container text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start">
            <Image src="/images/logo.png" width="64" height="64" ></Image>
            <p className="ms-2 p-0 text-xl font-bold">
              God Almighty
            </p>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
