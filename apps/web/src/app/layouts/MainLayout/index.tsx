/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { Page } from "@tensoremr/models";
import { AuthContext } from "../../_context/AuthContextProvider";
import { Actionbar } from "./ActionBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
interface Props {
  children: JSX.Element;
  onPageSelect: (route: string) => void;
  onAddPage: (page: Page) => void;
}

export const MainLayout: React.FC<Props> = ({
  children,
  onPageSelect,
  onAddPage,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const authContext = useContext(AuthContext);

  return (
    <div>
      <div className="sticky top-0 z-20">
        <div>
          <Header
            searchFocused={isFocused}
            setSearchFocused={setIsFocused}
            onChangePage={onPageSelect}
            onAddPage={onAddPage}
            onSignOut={() => {
              authContext.logout();
              // localStorage.removeItem('accessToken');
              // PocketBaseClient.authStore.clear();
              // window.location.replace('/');
            }}
          />
        </div>
        <div
          className={classNames(
            "fixed w-full h-full top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-10 cursor-pointer",
            { hidden: !isFocused }
          )}
        ></div>
        <div>
          <Actionbar onPageSelect={onPageSelect} />
        </div>
      </div>
      <main className="bg-gray-200 z-10">
        <div className="mx-auto max-w-full py-2 sm:px-6 lg:px-8">
          <div className="px-4 py-2 sm:px-0">
            <div>{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
