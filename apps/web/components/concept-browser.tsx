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

import React, { useState } from "react";
import { Spinner } from "flowbite-react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import useSWR from "swr";
import { getConceptChildren } from "../api";

interface ConceptItem {
  conceptId: string;
  active: boolean;
  definitionStatus?: string;
  moduleId?: string;
  fsn: {
    term: string;
    lang: string;
  };
  pt: {
    term: string;
    lang: string;
  };
  id: string;
  descendantCount?: number;
}

interface Props {
  conceptId: string;
  onSelect?: (concept: ConceptItem) => void;
}

export const ConceptBrowser: React.FC<Props> = ({ conceptId, onSelect }) => {
  const conceptChildrenQuery = useSWR(`concepts/${conceptId}`, () =>
    getConceptChildren(conceptId)
  );

  return (
    <div className="border border-indigo-600 rounded-md shadow-inner">
      {conceptChildrenQuery.isLoading && (
        <div className="h-20 w-full flex items-center justify-center">
          <Spinner color="info" />
        </div>
      )}
      {!conceptChildrenQuery.isLoading && (
        <div className="p-3 h-96 overflow-scroll">
          <ul>
            {conceptChildrenQuery?.data?.data?.map((item, i) => (
              <ConceptListItem
                key={i}
                item={item}
                onChildSelect={(item) => {
                  if (onSelect) onSelect(item);
                }}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface ConceptListItemProps {
  item: ConceptItem;
  onChildSelect: (item: ConceptItem) => void;
}

const ConceptListItem: React.FC<ConceptListItemProps> = ({
  item,
  onChildSelect,
}) => {
  const hasChildren = item.descendantCount > 1;

  const [expanded, setExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [children, setChildren] = useState<ConceptItem[]>([]);

  const handleExpand = () => {
    setIsLoading(true);

    getConceptChildren(item?.id)
      .then((result) => {
        if (result.data) {
          setChildren(result.data);
          setIsLoading(false);
          setExpanded(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  };

  return (
    <li key={item.id} className="cursor-pointer text-gray-800">
      <div className="flex items-center space-x-2 ">
        {isLoading ? (
          <Spinner size="sm" color="warning" aria-label="Button loading" />
        ) : (
          <div>
            {hasChildren ? (
              <div>
                {expanded ? (
                  <ChevronDownIcon
                    className="w-5 h-5"
                    onClick={() => setExpanded(false)}
                  />
                ) : (
                  <ChevronRightIcon
                    className="w-5 h-5"
                    onClick={() => handleExpand()}
                  />
                )}
              </div>
            ) : (
              <MinusIcon className="w-5 h-5" />
            )}
          </div>
        )}
        <button
          type="button"
          className="text-cyan-700 hover:text-cyan-800"
          onDoubleClick={() => onChildSelect(item)}
        >
          {item.pt?.term}
        </button>
      </div>
      <ul className="ml-8 mt-1">
        {expanded &&
          children.length > 0 &&
          children.map((child, i) => (
            <ConceptListItem
              key={i}
              item={child}
              onChildSelect={onChildSelect}
            />
          ))}
      </ul>
    </li>
  );
};
