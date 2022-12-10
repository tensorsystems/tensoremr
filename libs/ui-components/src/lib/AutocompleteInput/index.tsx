/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useWatch } from 'react-hook-form';
import './index.css';

interface Props {
  baseUrl: string;
  name: string;
  field: string;
  type: string;
  register: any;
  uri: string;
  setFormValue: any;
  control: any;
  disabled?: boolean;
  onInputChange?: () => void;
}

export const AutocompleteInput = (props: Props) => {
  const {
    baseUrl,
    name,
    field,
    type,
    register,
    uri,
    control,
    disabled,
    setFormValue,
    onInputChange,
  } = props;

  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<string>>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  const userInput = useWatch({
    control,
    name: name,
    defaultValue: '',
  });

  useEffect(() => {
    onInputChange && onInputChange();

    if (userInput && userInput.length > 0) {
      const payload = {
        suggest: {
          autocomplete: {
            prefix: userInput,
            completion: {
              field: field,
              skip_duplicates: true,
            },
          },
        },
      };

      fetch(
        // @ts-ignore
        `${baseUrl}/${uri}/_search?size=5`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const autocomplete = data.suggest.autocomplete.find(
            (e: any) => e.text === userInput
          );

          if (autocomplete) {
            const suggestions = autocomplete.options.map((e: any) => e.text);
            setSuggestions(suggestions);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userInput]);

  const onChange = (e: any) => {
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setActiveSuggestion(0);
    setFilteredSuggestions(filteredSuggestions);
    setShowSuggestions(true);

    onInputChange && onInputChange();
  };

  const onClick = (e: any) => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setFormValue(name, e.currentTarget.innerText);
  };

  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setFormValue(name, filteredSuggestions[activeSuggestion]);
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  let suggestionsListComponent;

  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <ul className="mt-1 max-h-36 overflow-y-auto pl-0 border rounded-md rounded-t-none shadow-lg absolute w-full z-20">
          {filteredSuggestions.map((suggestion, index) => {
            return (
              <li
                className={classnames('py-2 pl-3 cursor-pointer ', {
                  'bg-gray-100 text-gray-600 ': index === activeSuggestion,
                  'hover:bg-gray-200 bg-white': index !== activeSuggestion,
                })}
                key={suggestion}
                onClick={onClick}
              >
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    } else {
      suggestionsListComponent = <div></div>;
    }
  }

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        onKeyDown={onKeyDown}
        ref={register}
        onChange={onChange}
        autoComplete="off"
        disabled={disabled}
        className="border-gray-300 rounded-lg shadow-sm w-full h-8"
      />
      {suggestionsListComponent}
    </div>
  );
};
