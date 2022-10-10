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
import { Spinner } from 'flowbite-react';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  MinusSmIcon,
} from '@heroicons/react/outline';
import { GET_CONCEPT_CHILDREN } from '@tensoremr/util';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  ConceptChild,
  Query,
  QueryConceptChildrenArgs,
} from '@tensoremr/models';

interface Props {
  conceptId: string;
  onSelect?: (concept: ConceptChild) => void;
}

export const ConceptBrowser: React.FC<Props> = ({ conceptId, onSelect }) => {
  const { data, loading } = useQuery<Query, QueryConceptChildrenArgs>(
    GET_CONCEPT_CHILDREN,
    {
      variables: {
        conceptId,
      },
    }
  );

  return (
    <div className="border border-indigo-600 rounded-md shadow-inner">
      {loading && (
        <div className="h-20 w-full flex items-center justify-center">
          <Spinner color="info" />
        </div>
      )}
      {!loading && (
        <div className="p-3 h-96 overflow-scroll">
          <ul>
            {data?.conceptChildren.map((item, i) => (
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
  item: ConceptChild;
  onChildSelect: (item: ConceptChild) => void;
}

const ConceptListItem: React.FC<ConceptListItemProps> = ({
  item,
  onChildSelect,
}) => {
  const hasChildren = item.childrenCount > 1;

  const [expanded, setExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [children, setChildren] = useState<ConceptChild[]>([]);

  const getConceptChildren = useLazyQuery<Query, QueryConceptChildrenArgs>(
    GET_CONCEPT_CHILDREN
  );

  const handleExpand = () => {
    setIsLoading(true);

    getConceptChildren[0]({
      variables: {
        conceptId: item.concept.sctid,
      },
    }).then((result) => {
      if (result.data?.conceptChildren) {
        setChildren(result.data.conceptChildren);
        setIsLoading(false);
        setExpanded(true);
      }
    });
  };

  return (
    <li key={item.description.sctid} className="cursor-pointer text-gray-800">
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
              <MinusSmIcon className="w-5 h-5" />
            )}
          </div>
        )}
        <button
          type="button"
          className="text-cyan-700 hover:text-cyan-800"
          onDoubleClick={() => onChildSelect(item)}
        >
          {item.description.term}
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
