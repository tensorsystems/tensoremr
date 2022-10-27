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

import React, { useState } from 'react';
import classnames from 'classnames';
import { Page } from '@tensoremr/models';
import { useApolloClient } from '@apollo/client';
import Logo from './logo.png';
import { SearchBar } from './SearchBar';
import { useHistory } from 'react-router-dom';
import { parseJwt } from '@tensoremr/util';
import { Menu, Transition } from '@headlessui/react';

interface Props {
  setSearchFocused: (focused: boolean) => void;
  searchFocused: boolean;
  onSignOut: () => void;
  onChangePage: (route: string) => void;
  onAddPage: (page: Page) => void;
}

export const Header: React.FC<Props> = ({
  searchFocused,
  setSearchFocused,
  onSignOut,
  onChangePage,
  onAddPage,
}) => {
  const [isNavBarOpen, setNavBarOpen] = useState(false);
  const history = useHistory();

  const onProfileClick = (
    evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    evt.preventDefault();

    const token = localStorage.getItem('accessToken');
    const claim = parseJwt(token);

    history.push(`/profile/${claim.ID}`);
  };

  return (
    <div className="bg-gray-200">
      <nav className="bg-gray-800">
        <div className="mx-auto px-6 py-1">
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-grow items-center">
              <div>
                <img className="h-auto w-36" src={Logo} />
              </div>
              <div className="items-baseline flex-grow relative mx-36">
                <SearchBar
                  searchFocused={searchFocused}
                  setSearchFocused={setSearchFocused}
                  onChangePage={onChangePage}
                  onAddPage={onAddPage}
                />
              </div>
            </div>
            <div className="hidden md:block flex-grow-0">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  className="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700"
                  aria-label="Notifications"
                >
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>

                <div className="ml-3 relative z-50">
                  <Menu>
                    {({ open }) => (
                      <>
                        <span className="rounded-md shadow-sm">
                          <Menu.Button className="inline-flex justify-center text-white mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="h-8 w-8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </Menu.Button>
                        </span>

                        <Transition
                          show={open}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                          >
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={`${
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                    onClick={onProfileClick}
                                  >
                                    Your profile
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700'
                                    } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                    onClick={() => {
                                      onSignOut();
                                    }}
                                  >
                                    Sign out
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setNavBarOpen(!isNavBarOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
              >
                <svg
                  className="block h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>

                <svg
                  className="hidden h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={classnames('md:hidden', { hidden: !isNavBarOpen })}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3"></div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5 space-x-3">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="space-y-1">
                <div className="text-base font-medium leading-none text-white">
                  Tom Cook
                </div>
                <div className="text-sm font-medium leading-none text-gray-400">
                  tom@example.com
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
              >
                Your Profile
              </a>

              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
              >
                Settings
              </a>

              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
